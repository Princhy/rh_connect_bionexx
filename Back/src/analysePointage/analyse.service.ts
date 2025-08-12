import { Between } from "typeorm";
import { IAnalyse, AnalyseOutput, StatutAnalyse } from "./analyse.entity";
import { analyseRepository } from "./analyse.repository";
import { PlanningService } from "../planningEquipe/planning.service";
import { PointageService } from "../pointage/pointage.service";
import { CongeService } from "../conge/conge.service";
import { TypePointage } from "../enum";
import { userRepository } from "../user/user.repository";
import { Analyse } from "./analyse.entity";

export type AnalyseCreationParams = Pick<
  IAnalyse,
  "matricule" | "date" | "heure_prevue_arrivee" | "heure_prevue_depart" | 
  "heure_reelle_arrivee" | "heure_reelle_depart" | "retard_minutes" | 
  "sortie_anticipee_minutes" | "statut_final" | "travaille_aujourd_hui" | 
  "commentaire" | "mode_pointage" | "lieu_pointage"
>;

export type AnalyseUpdateParams = Partial<Pick<IAnalyse, "justifie" | "commentaire">>;

export class AnalyseService {
  private planningService = new PlanningService();
  private pointageService = new PointageService();
  private congeService = new CongeService();
  private TOLERANCE_MINUTES = 15; // Tolérance de 15 minutes

  // ===== CRUD BASIQUE =====
  
  public async getAnalyseById(id: number): Promise<AnalyseOutput | undefined> {
    return await analyseRepository().findOne({
      where: { id_analyse: id },
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu']
    });
  }

  public async createAnalyse(params: AnalyseCreationParams): Promise<AnalyseOutput> {
    const analyse = analyseRepository().create(params);
    const saved = await analyseRepository().save(analyse);
    return await this.getAnalyseById(saved.id_analyse);
  }

  public async getAllAnalyses(): Promise<AnalyseOutput[]> {
    return await analyseRepository().find({
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { date: 'DESC', date_analyse: 'DESC' }
    });
  }

  public async updateAnalyse(id: number, params: AnalyseUpdateParams): Promise<AnalyseOutput | undefined> {
    await analyseRepository().update(id, params);
    return await this.getAnalyseById(id);
  }

  public async deleteAnalyse(id: number): Promise<AnalyseOutput | undefined> {
    const analyse = await this.getAnalyseById(id);
    if (analyse) {
      await analyseRepository().delete(id);
    }
    return analyse;
  }

  // ===== MÉTHODES DE RECHERCHE =====

  public async getAnalysesByDate(date: string): Promise<AnalyseOutput[]> {
    return await analyseRepository().find({
      where: { date: new Date(date) },
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { matricule: 'ASC' }
    });
  }

  public async getAnalysesByMatricule(matricule: string): Promise<AnalyseOutput[]> {
    return await analyseRepository().find({
      where: { matricule },
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { date: 'DESC' }
    });
  }

  public async getAnalysesByStatut(statut: StatutAnalyse, date?: string): Promise<AnalyseOutput[]> {
    const where: any = { statut_final: statut };
    if (date) {
      where.date = new Date(date);
    }

    return await analyseRepository().find({
      where,
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { date: 'DESC', matricule: 'ASC' }
    });
  }

  // ===== VÉRIFICATION DES CONGÉS =====

  private async verifierCongeEmploye(matricule: string, date: string): Promise<{
    estEnConge: boolean;
    conge?: any;
  }> {
    try {
      const dateVerification = new Date(date);
      const conges = await this.congeService.getCongesByMatricule(matricule);
      
      // Trouver le congé qui correspond à cette date
      const congeActuel = conges.find(conge => {
        const dateDepart = new Date(conge.date_depart);
        const dateReprise = new Date(conge.date_reprise);
        return dateVerification >= dateDepart && dateVerification < dateReprise;
      });
      
      return {
        estEnConge: !!congeActuel,
        conge: congeActuel
      };
    } catch (error) {
      console.error(`Erreur vérification congé pour ${matricule}:`, error);
      return { estEnConge: false };
    }
  }

  private async getEmployesEnCongeForDate(date: string): Promise<any[]> {
    try {
      const dateVerification = new Date(date);
      
      // Récupérer tous les congés qui incluent cette date
      const tousLesConges = await this.congeService.getAllConges();
      
      const employesEnConge = [];
      for (const conge of tousLesConges) {
        const dateDepart = new Date(conge.date_depart);
        const dateReprise = new Date(conge.date_reprise);
        
        // Si la date est dans la période de congé
        if (dateVerification >= dateDepart && dateVerification < dateReprise) {
          employesEnConge.push({
            matricule: conge.matricule,
            conge: conge
          });
        }
      }
      
      console.log(`🏖️ ${employesEnConge.length} employés en congé le ${date}`);
      return employesEnConge;
    } catch (error) {
      console.error(`Erreur récupération employés en congé:`, error);
      return [];
    }
  }

  // ===== ANALYSE PRINCIPALE =====

  public async analyserJournee(date: string): Promise<{
    analyses: AnalyseOutput[];
    statistiques: {
      total_employes: number;
      presents: number;
      absents: number;
      retards: number;
      sorties_anticipees: number;
      presents_avec_retard: number;
      en_conge: number;
      taux_presence: number;
      retard_moyen_minutes: number;
    };
  }> {
    console.log(`🔍 Analyse de la journée du ${date}`);

    // 1. Supprimer les analyses existantes pour cette date
    try {
      const deleteResult = await analyseRepository()
        .createQueryBuilder()
        .delete()
        .from(Analyse)
        .where("DATE(date) = :targetDate", { targetDate: date })
        .execute();
      
      console.log(`🗑️ ${deleteResult.affected} analyses supprimées pour le ${date}`);
    } catch (error) {
      console.error("Erreur lors de la suppression des analyses existantes:", error);
    }

    // 2. Récupérer qui devrait travailler
    const targetDate = new Date(date);
    const planningsJour = await this.planningService.getAllEmployeesPlanningForDate(targetDate);
    const equipesQuiDoiventTravailler = planningsJour.filter(p => p.planning.travaille);

    console.log(`🏢 ${equipesQuiDoiventTravailler.length} équipes devraient travailler`);

    // 2.5. Récupérer tous les employés de ces équipes
    const tousLesEmployes = [];
    for (const planningEquipe of equipesQuiDoiventTravailler) {
      const employesEquipe = await userRepository().find({
        where: { id_equipe: planningEquipe.id_equipe },
        relations: ['equipe']
      });
      
      console.log(`👥 Équipe ${planningEquipe.id_equipe} (${planningEquipe.equipe?.equipe}): ${employesEquipe.length} employés`);
      
      for (const employe of employesEquipe) {
        tousLesEmployes.push({
          matricule: employe.matricule,
          nom: employe.nom,
          prenom: employe.prenom,
          equipe: employe.equipe?.equipe || 'Inconnue',
          id_equipe: employe.id_equipe,
          planning: planningEquipe.planning
        });
      }
    }

    // 2.6. Ajouter les employés en congé même si leur équipe ne travaille pas
    const employesEnConge = await this.getEmployesEnCongeForDate(date);
    for (const employeConge of employesEnConge) {
      // Vérifier si l'employé n'est pas déjà dans la liste
      const dejaPresent = tousLesEmployes.some(emp => emp.matricule === employeConge.matricule);
      if (!dejaPresent) {
        // Récupérer les infos de l'employé
        const employeInfo = await userRepository().findOne({
          where: { matricule: employeConge.matricule },
          relations: ['equipe']
        });
        
        if (employeInfo) {
          tousLesEmployes.push({
            matricule: employeInfo.matricule,
            nom: employeInfo.nom,
            prenom: employeInfo.prenom,
            equipe: employeInfo.equipe?.equipe || 'Inconnue',
            id_equipe: employeInfo.id_equipe,
            planning: { deb_heure: '08:00', fin_heure: '17:00' } // Planning par défaut pour les congés
          });
        }
      }
    }

    console.log(`👥 ${tousLesEmployes.length} employés au total à analyser`);

    // 3. Récupérer tous les pointages du jour avec les relations
    const pointagesJour = await this.pointageService.getPointagesByDate(date);
    console.log(`📊 ${pointagesJour.length} pointages enregistrés`);

    // 4. Analyser chaque employé
    const analyses: AnalyseOutput[] = [];
    for (const employe of tousLesEmployes) {
      const analyse = await this.analyserEmployeIndividuel(employe, pointagesJour, date);
      analyses.push(analyse);
    }

    // 5. Calculer les statistiques
    const statistiques = this.calculerStatistiques(analyses);

    console.log(`📈 Résultats: ${statistiques.presents} présents, ${statistiques.absents} absents, ${statistiques.retards} retards, ${statistiques.en_conge} en congé`);

    return { analyses, statistiques };
  }

  // Analyser un employé individuel
  private async analyserEmployeIndividuel(employe: any, pointagesJour: any[], date: string): Promise<AnalyseOutput> {
    // 1. Vérifier si l'employé est en congé
    const verificationConge = await this.verifierCongeEmploye(employe.matricule, date);
    
    if (verificationConge.estEnConge) {
      console.log(`🏖️ ${employe.nom} ${employe.prenom} (${employe.matricule}) est en congé`);
      
      const analyse: AnalyseCreationParams = {
        matricule: employe.matricule,
        date: new Date(date),
        heure_prevue_arrivee: employe.planning.deb_heure,
        heure_prevue_depart: employe.planning.fin_heure,
        heure_reelle_arrivee: undefined,
        heure_reelle_depart: undefined,
        retard_minutes: 0,
        sortie_anticipee_minutes: 0,
        statut_final: StatutAnalyse.EN_CONGE,
        travaille_aujourd_hui: false,
        commentaire: `EN CONGÉ - ${verificationConge.conge?.type || 'Congé'} du ${new Date(verificationConge.conge?.date_depart).toLocaleDateString()} au ${new Date(verificationConge.conge?.date_reprise).toLocaleDateString()}`,
        mode_pointage: undefined,
        lieu_pointage: undefined
      };

      return await this.createAnalyse(analyse);
    }

    // 2. Pointages de cet employé
    const pointagesEmploye = pointagesJour.filter(p => p.matricule === employe.matricule);
    pointagesEmploye.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log(`🔍 Analyse ${employe.nom} ${employe.prenom} (${employe.matricule}): ${pointagesEmploye.length} pointages`);

    // 3. Données de base
    const analyse: AnalyseCreationParams = {
      matricule: employe.matricule,
      date: new Date(date),
      heure_prevue_arrivee: employe.planning.deb_heure,
      heure_prevue_depart: employe.planning.fin_heure,
      heure_reelle_arrivee: undefined,
      heure_reelle_depart: undefined,
      retard_minutes: 0,
      sortie_anticipee_minutes: 0,
      statut_final: StatutAnalyse.ABSENT,
      travaille_aujourd_hui: true,
      commentaire: `Devrait travailler ${employe.planning.deb_heure}-${employe.planning.fin_heure}`,
      mode_pointage: undefined,
      lieu_pointage: undefined
    };

    // 4. Si aucun pointage = ABSENT
    if (pointagesEmploye.length === 0) {
      analyse.statut_final = StatutAnalyse.ABSENT;
      analyse.commentaire = `ABSENT - Aucun pointage (devait travailler ${employe.planning.deb_heure}-${employe.planning.fin_heure})`;
      console.log(`❌ ${employe.nom} ${employe.prenom} - ABSENT (0 pointages)`);
      return await this.createAnalyse(analyse);
    }

    // 5. Analyser les pointages
    const premiereEntree = pointagesEmploye.find(p => p.type === TypePointage.ENTREE);
    const derniereSortie = [...pointagesEmploye].reverse().find(p => p.type === TypePointage.SORTIE);

    // 6. Récupérer le mode et lieu du premier pointage
    if (pointagesEmploye.length > 0) {
      const premierPointage = pointagesEmploye[0];
      analyse.mode_pointage = premierPointage.mode;
      // Récupérer le lieu via pointeuse -> lieu
      analyse.lieu_pointage = premierPointage.pointeuse?.lieu?.lieu || 'Lieu inconnu';
    }

    if (premiereEntree) {
      analyse.heure_reelle_arrivee = this.extraireHeure(premiereEntree.date);
      analyse.retard_minutes = this.calculerRetard(employe.planning.deb_heure, premiereEntree.date);
    } else {
      // Pas d'entrée = comportement anormal
      analyse.statut_final = StatutAnalyse.ABSENT;
      analyse.commentaire = `${pointagesEmploye.length} pointages mais pas d'ENTREE`;
      return await this.createAnalyse(analyse);
    }

    if (derniereSortie) {
      analyse.heure_reelle_depart = this.extraireHeure(derniereSortie.date);
      analyse.sortie_anticipee_minutes = this.calculerSortieAnticipee(employe.planning.fin_heure, derniereSortie.date);
    }

    // 7. Déterminer le statut final
    analyse.statut_final = this.determinerStatutFinal(analyse);

    return await this.createAnalyse(analyse);
  }

  // ===== MÉTHODES UTILITAIRES =====

  private calculerRetard(heurePrevue: string, heureReelle: Date): number {
    const [heureP, minuteP] = heurePrevue.split(':').map(Number);
    const minutesPrevues = heureP * 60 + minuteP;
    
    const heureR = new Date(heureReelle);
    const minutesReelles = heureR.getHours() * 60 + heureR.getMinutes();
    
    const retard = minutesReelles - minutesPrevues;
    return retard > 0 ? retard : 0;
  }

  private calculerSortieAnticipee(heurePrevue: string, heureReelle: Date): number {
    const [heureP, minuteP] = heurePrevue.split(':').map(Number);
    const minutesPrevues = heureP * 60 + minuteP;
    
    const heureR = new Date(heureReelle);
    const minutesReelles = heureR.getHours() * 60 + heureR.getMinutes();
    
    const sortieAnticipee = minutesPrevues - minutesReelles;
    return sortieAnticipee > 0 ? sortieAnticipee : 0;
  }

  private determinerStatutFinal(analyse: AnalyseCreationParams): StatutAnalyse {
    if (!analyse.heure_reelle_arrivee) {
      return StatutAnalyse.ABSENT;
    }

    const aRetard = analyse.retard_minutes > this.TOLERANCE_MINUTES;
    const sortieTot = analyse.sortie_anticipee_minutes > this.TOLERANCE_MINUTES;

    if (aRetard && sortieTot) {
      return StatutAnalyse.PRESENT_AVEC_RETARD;
    } else if (aRetard) {
      return StatutAnalyse.RETARD;
    } else if (sortieTot) {
      return StatutAnalyse.SORTIE_ANTICIPEE;
    } else {
      return StatutAnalyse.PRESENT;
    }
  }

  private extraireHeure(date: Date): string {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  private calculerStatistiques(analyses: AnalyseOutput[]) {
    const total = analyses.length;
    const presents = analyses.filter(a => a.statut_final === StatutAnalyse.PRESENT).length;
    const absents = analyses.filter(a => a.statut_final === StatutAnalyse.ABSENT).length;
    const retards = analyses.filter(a => a.statut_final === StatutAnalyse.RETARD).length;
    const sortiesAnticipees = analyses.filter(a => a.statut_final === StatutAnalyse.SORTIE_ANTICIPEE).length;
    const presentsAvecRetard = analyses.filter(a => a.statut_final === StatutAnalyse.PRESENT_AVEC_RETARD).length;
    const enConge = analyses.filter(a => a.statut_final === StatutAnalyse.EN_CONGE).length;

    const totalRetardMinutes = analyses.reduce((sum, a) => sum + a.retard_minutes, 0);
    const employesAvecRetard = retards + presentsAvecRetard;
    const retardMoyen = employesAvecRetard > 0 ? Math.round(totalRetardMinutes / employesAvecRetard) : 0;

    // Calculer le taux de présence en excluant les employés en congé
    const totalEmployesTravail = total - enConge;
    const presentsTotal = presents + retards + sortiesAnticipees + presentsAvecRetard;
    const tauxPresence = totalEmployesTravail > 0 ? Math.round((presentsTotal / totalEmployesTravail) * 100) : 0;

    return {
      total_employes: total,
      presents,
      absents,
      retards,
      sorties_anticipees: sortiesAnticipees,
      presents_avec_retard: presentsAvecRetard,
      en_conge: enConge,
      taux_presence: tauxPresence,
      retard_moyen_minutes: retardMoyen
    };
  }

  // ===== MÉTHODES SPÉCIALISÉES =====

  public async getRetardsDuJour(date: string): Promise<AnalyseOutput[]> {
    return await analyseRepository().find({
      where: [
        { date: new Date(date), statut_final: StatutAnalyse.RETARD },
        { date: new Date(date), statut_final: StatutAnalyse.PRESENT_AVEC_RETARD }
      ],
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { retard_minutes: 'DESC' }
    });
  }

  public async getAbsentsDuJour(date: string): Promise<AnalyseOutput[]> {
    return await this.getAnalysesByStatut(StatutAnalyse.ABSENT, date);
  }

  public async getEmployesEnConge(date: string): Promise<AnalyseOutput[]> {
    return await this.getAnalysesByStatut(StatutAnalyse.EN_CONGE, date);
  }

  public async getSortiesAnticipeesDuJour(date: string): Promise<AnalyseOutput[]> {
    return await analyseRepository().find({
      where: [
        { date: new Date(date), statut_final: StatutAnalyse.SORTIE_ANTICIPEE },
        { date: new Date(date), statut_final: StatutAnalyse.PRESENT_AVEC_RETARD }
      ],
      relations: ['user', 'user.equipe', 'user.departement', 'user.lieu'],
      order: { sortie_anticipee_minutes: 'DESC' }
    });
  }

  public async justifierAnalyse(id: number, justifie: boolean, commentaire?: string): Promise<AnalyseOutput | undefined> {
    return await this.updateAnalyse(id, { justifie, commentaire });
  }

  public async getRapportPeriode(dateDebut: string, dateFin: string): Promise<{
    periode: string;
    analyses: AnalyseOutput[];
    statistiques_globales: any;
    top_retardataires: any[];
    top_absents: any[];
  }> {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    const analyses = await analyseRepository().find({
      where: {
        date: Between(debut, fin)
      },
      relations: ['user', 'user.equipe'],
      order: { date: 'DESC', matricule: 'ASC' }
    });

    // Statistiques par employé
    const statsParEmploye = analyses.reduce((acc: any, analyse) => {
      if (!acc[analyse.matricule]) {
        acc[analyse.matricule] = {
          matricule: analyse.matricule,
          nom: analyse.user?.nom,
          prenom: analyse.user?.prenom,
          equipe: analyse.user?.equipe?.equipe,
          jours_travail: 0,
          retards: 0,
          absences: 0,
          total_minutes_retard: 0
        };
      }
      
      // Ne compter que les jours de travail (pas les congés)
      if (analyse.statut_final !== StatutAnalyse.EN_CONGE) {
        acc[analyse.matricule].jours_travail++;
      }
      
      if (analyse.statut_final === StatutAnalyse.RETARD || analyse.statut_final === StatutAnalyse.PRESENT_AVEC_RETARD) {
        acc[analyse.matricule].retards++;
        acc[analyse.matricule].total_minutes_retard += analyse.retard_minutes;
      }
      if (analyse.statut_final === StatutAnalyse.ABSENT) {
        acc[analyse.matricule].absences++;
      }
      
      return acc;
    }, {});

    const topRetardataires = Object.values(statsParEmploye)
      .sort((a: any, b: any) => b.retards - a.retards)
      .slice(0, 10);

    const topAbsents = Object.values(statsParEmploye)
      .sort((a: any, b: any) => b.absences - a.absences)
      .slice(0, 10);

    return {
      periode: `${dateDebut} au ${dateFin}`,
      analyses,
      statistiques_globales: this.calculerStatistiques(analyses),
      top_retardataires: topRetardataires,
      top_absents: topAbsents
    };
  }
}
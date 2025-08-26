import { Between } from "typeorm";
import { IAnalyse, AnalyseOutput, StatutAnalyse } from "./analyse.entity";
import { analyseRepository } from "./analyse.repository";
import { PlanningService } from "../planningEquipe/planning.service";
import { PointageService } from "../pointage/pointage.service";
import { CongeService } from "../conge/conge.service";
import { JourFerieService } from "../jourFerie/jourferie.service";
import { TypePointage } from "../enum";
import { userRepository } from "../user/user.repository";
import { Analyse } from "./analyse.entity";
import { StatutConge } from "../conge/conge.entity";

export type AnalyseCreationParams = Pick<
  IAnalyse,
  "matricule" | "date" | "heure_prevue_arrivee" | "heure_prevue_depart" | 
  "heure_reelle_arrivee" | "heure_reelle_depart" | "retard_minutes" | 
  "sortie_anticipee_minutes" | "statut_final" | "travaille_aujourd_hui" | 
  "commentaire" | "mode_pointage" | "lieu_pointage" | "cycle_travail_debut" | "cycle_travail_fin" | "est_equipe_nuit"
>;

export type AnalyseUpdateParams = Partial<Pick<IAnalyse, "justifie" | "commentaire"|"statut_final" |"mode_pointage">>;

export class AnalyseService {
  private planningService = new PlanningService();
  private pointageService = new PointageService();
  private congeService = new CongeService();
  private jourFerieService = new JourFerieService();
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
      
      // Trouver le congé validé qui correspond à cette date
      const congeActuel = conges.find(conge => {
        const dateDepart = new Date(conge.date_depart);
        const dateReprise = new Date(conge.date_reprise);
        return conge.statut === StatutConge.VALIDE && dateVerification >= dateDepart && dateVerification < dateReprise;
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
      
      // Récupérer tous les congés validés qui incluent cette date
      const tousLesConges = await this.congeService.getAllConges();
      
      const employesEnConge = [];
      for (const conge of tousLesConges) {
        const dateDepart = new Date(conge.date_depart);
        const dateReprise = new Date(conge.date_reprise);
        
        // Si la date est dans la période de congé validé
        if (conge.statut === StatutConge.VALIDE && dateVerification >= dateDepart && dateVerification < dateReprise) {
          employesEnConge.push({
            matricule: conge.matricule,
            conge: conge
          });
        }
      }
      
      console.log(`🏖️ ${employesEnConge.length} employés en congé validé le ${date}`);
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
      en_repos: number;
      taux_presence: number;
      taux_absence: number;
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

    // 2. Récupérer les plannings du jour
    const targetDate = new Date(date);
    const estFerie = await this.estJourFerie(date);
    const planningsJour = await this.planningService.getAllEmployeesPlanningForDate(targetDate);
    const equipesQuiDoiventTravailler = planningsJour.filter(p => p.planning.travaille);
    const equipesEnRepos = planningsJour.filter(p => !p.planning.travaille);
    
    console.log(`🛌 ${equipesEnRepos.length} équipes en repos`);
    console.log(`🏢 ${equipesQuiDoiventTravailler.length} équipes devraient travailler`);

    // 3. Récupérer tous les pointages du jour
    const pointagesJour = await this.pointageService.getPointagesByDate(date);
    console.log(`📊 ${pointagesJour.length} pointages enregistrés`);

    // 4. Créer une liste de tous les employés avec leur statut (travail ou repos)
    const tousLesEmployesAvecStatut = [];

    // 4.1 Employés qui travaillent
    for (const planningEquipe of equipesQuiDoiventTravailler) {
      const employesEquipe = await userRepository().find({
        where: { id_equipe: planningEquipe.id_equipe },
        relations: ['equipe']
      });
      
      console.log(`👥 Équipe qui travaille ${planningEquipe.id_equipe} (${planningEquipe.equipe?.equipe}): ${employesEquipe.length} employés`);
      
      for (const employe of employesEquipe) {
        const nomEquipe = employe.equipe?.equipe || 'Inconnue';
        const equipeABC = this.estEquipeABC(nomEquipe);
        const forcerReposFerie = estFerie && !equipeABC;
        tousLesEmployesAvecStatut.push({
          matricule: employe.matricule,
          nom: employe.nom,
          prenom: employe.prenom,
          equipe: nomEquipe,
          id_equipe: employe.id_equipe,
          planning: planningEquipe.planning,
          estEnRepos: forcerReposFerie,
          estReposFerie: forcerReposFerie
        });
      }
    }

    // 4.2 Employés en repos (qui peuvent avoir des pointages)
    for (const planningEquipe of equipesEnRepos) {
      const employesEquipe = await userRepository().find({
        where: { id_equipe: planningEquipe.id_equipe },
        relations: ['equipe']
      });
      
      console.log(`🛌 Équipe en repos ${planningEquipe.id_equipe} (${planningEquipe.equipe?.equipe}): ${employesEquipe.length} employés`);
      
      for (const employe of employesEquipe) {
        tousLesEmployesAvecStatut.push({
          matricule: employe.matricule,
          nom: employe.nom,
          prenom: employe.prenom,
          equipe: employe.equipe?.equipe || 'Inconnue',
          id_equipe: employe.id_equipe,
          planning: planningEquipe.planning,
          estEnRepos: true,
          estReposFerie: false
        });
      }
    }

    // 4.3 Ajouter les employés en congé qui ne sont dans aucune équipe active
    const employesEnConge = await this.getEmployesEnCongeForDate(date);
    for (const employeConge of employesEnConge) {
      const dejaPresent = tousLesEmployesAvecStatut.some(emp => emp.matricule === employeConge.matricule);
      if (!dejaPresent) {
        const employeInfo = await userRepository().findOne({
          where: { matricule: employeConge.matricule },
          relations: ['equipe']
        });
        
        if (employeInfo) {
          tousLesEmployesAvecStatut.push({
            matricule: employeInfo.matricule,
            nom: employeInfo.nom,
            prenom: employeInfo.prenom,
            equipe: employeInfo.equipe?.equipe || 'Inconnue',
            id_equipe: employeInfo.id_equipe,
            planning: { deb_heure: '08:00', fin_heure: '17:00' },
            estEnRepos: false,
            estReposFerie: false
          });
        }
      }
    }

    console.log(`👥 ${tousLesEmployesAvecStatut.length} employés au total à analyser`);

    // 5. Analyser chaque employé avec son statut (travail ou repos)
    const analyses: AnalyseOutput[] = [];
    for (const employe of tousLesEmployesAvecStatut) {
      const analyse = await this.analyserEmployeIndividuel(
        employe, 
        pointagesJour, 
        date, 
        employe.estEnRepos,
        employe.estReposFerie === true
      );
      analyses.push(analyse);
    }

    // 6. Calculer les statistiques
    const statistiques = this.calculerStatistiques(analyses);

    console.log(`📈 Résultats: ${statistiques.presents} présents, ${statistiques.absents} absents, ${statistiques.retards} retards, ${statistiques.en_conge} en congé, ${statistiques.en_repos} en repos`);

    return { analyses, statistiques };
  }

  // Analyser un employé individuel avec gestion du statut repos
  private async analyserEmployeIndividuel(
    employe: any, 
    pointagesJour: any[], 
    date: string,
    estEnRepos: boolean = false,
    estReposFerie: boolean = false
  ): Promise<AnalyseOutput> {
    
    // 1. Vérifier si l'employé est en congé (priorité sur le repos)
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

    // 2. Pointages de cet employé (inclure le lendemain pour les équipes de nuit)
    const pointagesEmploye = pointagesJour.filter(p => p.matricule === employe.matricule);
    pointagesEmploye.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let pointagesDemain: any[] = [];
    const isNightShift = employe.planning?.shift === 'nuit' || this.shiftTraverseMinuit(employe.planning?.deb_heure, employe.planning?.fin_heure);
    if (isNightShift) {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      const demainStr = d.toISOString().split('T')[0];
      try {
        pointagesDemain = await this.pointageService.getPointagesByMatriculeAndDate(employe.matricule, demainStr);
      } catch (e) {
        console.error(`Erreur chargement pointages du lendemain pour ${employe.matricule}:`, e);
      }
    }

    console.log(`🔍 Analyse ${employe.nom} ${employe.prenom} (${employe.matricule}): ${pointagesEmploye.length} pointages${estEnRepos ? ' (EN REPOS)' : ''}`);

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
      statut_final: estEnRepos ? StatutAnalyse.EN_REPOS : StatutAnalyse.ABSENT,
      travaille_aujourd_hui: !estEnRepos,
      commentaire: estEnRepos 
        ? `EN REPOS - Équipe ${employe.equipe} ne travaille pas aujourd'hui` 
        : `Devrait travailler ${employe.planning.deb_heure}-${employe.planning.fin_heure}`,
      mode_pointage: undefined,
      lieu_pointage: undefined
    };

    // 4. Si aucun pointage
    if (pointagesEmploye.length === 0) {
      if (estEnRepos) {
        analyse.commentaire = estReposFerie
          ? `EN REPOS (Jour férié) - Équipe ${employe.equipe}`
          : `EN REPOS - Équipe ${employe.equipe} ne travaille pas aujourd'hui (aucun pointage)`;
        console.log(`🛌 ${employe.nom} ${employe.prenom} - EN REPOS (0 pointages)`);
      } else {
        analyse.statut_final = StatutAnalyse.ABSENT;
        analyse.commentaire = `ABSENT - Aucun pointage (devait travailler ${employe.planning.deb_heure}-${employe.planning.fin_heure})`;
        console.log(`❌ ${employe.nom} ${employe.prenom} - ABSENT (0 pointages)`);
      }
      return await this.createAnalyse(analyse);
    }

    // 5. Analyser les pointages (même pour les employés en repos)
    const premiereEntree = pointagesEmploye.find(p => p.type === TypePointage.ENTREE);
    let derniereSortie = [...pointagesEmploye].reverse().find(p => p.type === TypePointage.SORTIE);
    if (isNightShift) {
      const sortieDemain = [...pointagesDemain].reverse().find(p => p.type === TypePointage.SORTIE);
      if (sortieDemain) {
        derniereSortie = sortieDemain;
      }
    }

    // 6. Récupérer le mode et lieu du premier pointage
    if (pointagesEmploye.length > 0) {
      const premierPointage = pointagesEmploye[0];
      analyse.mode_pointage = premierPointage.mode;
      analyse.lieu_pointage = premierPointage.pointeuse?.lieu?.lieu || 'Lieu inconnu';
    }

    // 7. Traiter les heures d'arrivée et de départ
    if (premiereEntree) {
      analyse.heure_reelle_arrivee = this.extraireHeure(premiereEntree.date);
      // Pour les employés en repos, on ne calcule pas le retard
      if (!estEnRepos) {
        analyse.retard_minutes = this.calculerRetard(employe.planning.deb_heure, premiereEntree.date);
      }
    }

    if (derniereSortie) {
      analyse.heure_reelle_depart = this.extraireHeure(derniereSortie.date);
      // Pour les employés en repos, on ne calcule pas la sortie anticipée
      if (!estEnRepos) {
        analyse.sortie_anticipee_minutes = this.calculerSortieAnticipee(employe.planning.fin_heure, derniereSortie.date);
      }
    }

    // 8. Déterminer le statut final
    if (estEnRepos) {
      // Le statut reste EN_REPOS même s'il y a des pointages
      analyse.statut_final = StatutAnalyse.EN_REPOS;
      
      // Construire un commentaire détaillé pour les employés en repos avec pointages
      let commentaireRepos = estReposFerie
        ? `EN REPOS (Jour férié) - Équipe ${employe.equipe}`
        : `EN REPOS - Équipe ${employe.equipe} ne travaille pas aujourd'hui`;
      if (pointagesEmploye.length > 0) {
        const typesPointages = pointagesEmploye.map(p => p.type).join(', ');
        commentaireRepos += ` (${pointagesEmploye.length} pointages: ${typesPointages})`;
      }
      analyse.commentaire = commentaireRepos;
      
      console.log(`🛌 ${employe.nom} ${employe.prenom} - EN REPOS avec ${pointagesEmploye.length} pointages`);
    } else {
      // Pour les employés qui travaillent, déterminer le statut normal
      if (!analyse.heure_reelle_arrivee) {
        analyse.statut_final = StatutAnalyse.ABSENT;
        analyse.commentaire = `${pointagesEmploye.length} pointages mais pas d'ENTREE`;
      } else {
        analyse.statut_final = this.determinerStatutFinal(analyse);
      }
    }

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
    
    // Si la fin prévue est avant le début prévu (shift de nuit), considérer la sortie le lendemain possible
    let sortieAnticipee = minutesPrevues - minutesReelles;
    // Si négatif, pas de sortie anticipée
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

  // Détermine si un nom d'équipe correspond à A, B ou C (insensible à la casse)
  private estEquipeABC(nomEquipe: string): boolean {
    const n = (nomEquipe || '').trim().toUpperCase();
    return n === 'A' || n === 'B' || n === 'C' || n === 'EQUIPE A' || n === 'EQUIPE B' || n === 'EQUIPE C';
  }

  // Vérifie si la date est un jour férié (prend en compte le flag récurrent)
  private async estJourFerie(dateStr: string): Promise<boolean> {
    try {
      const d = new Date(dateStr);
      const yyyy = d.getFullYear();
      const mm = (d.getMonth() + 1).toString().padStart(2, '0');
      const dd = d.getDate().toString().padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;

      const jours = await this.jourFerieService.getAllJoursFeries();
      return jours.some((jf: any) => {
        if (jf.recurrent) {
          const jfd = new Date(jf.date);
          return jfd.getDate() === d.getDate() && jfd.getMonth() === d.getMonth();
        }
        const jfy = new Date(jf.date);
        const jy = jfy.getFullYear();
        const jm = (jfy.getMonth() + 1).toString().padStart(2, '0');
        const jd = jfy.getDate().toString().padStart(2, '0');
        const jiso = `${jy}-${jm}-${jd}`;
        return jiso === iso;
      });
    } catch (e) {
      console.error('Erreur vérification jour férié:', e);
      return false;
    }
  }

  private extraireHeure(date: Date): string {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  // Retourne vrai si un shift traverse minuit (ex: 18:00 -> 06:00)
  private shiftTraverseMinuit(deb?: string, fin?: string): boolean {
    if (!deb || !fin) return false;
    const [dh, dm] = deb.split(':').map(Number);
    const [fh, fm] = fin.split(':').map(Number);
    const start = dh * 60 + dm;
    const end = fh * 60 + fm;
    return end <= start; // fin <= début → traverse minuit
  }

  private calculerStatistiques(analyses: AnalyseOutput[]) {
    const total = analyses.length;
    const presents = analyses.filter(a => a.statut_final === StatutAnalyse.PRESENT).length;
    const absents = analyses.filter(a => a.statut_final === StatutAnalyse.ABSENT).length;
    const retards = analyses.filter(a => a.statut_final === StatutAnalyse.RETARD).length;
    const sortiesAnticipees = analyses.filter(a => a.statut_final === StatutAnalyse.SORTIE_ANTICIPEE).length;
    const presentsAvecRetard = analyses.filter(a => a.statut_final === StatutAnalyse.PRESENT_AVEC_RETARD).length;
    const enConge = analyses.filter(a => a.statut_final === StatutAnalyse.EN_CONGE).length;
    const enRepos = analyses.filter(a => a.statut_final === StatutAnalyse.EN_REPOS).length;

    const totalRetardMinutes = analyses.reduce((sum, a) => sum + a.retard_minutes, 0);
    const employesAvecRetard = retards + presentsAvecRetard;
    const retardMoyen = employesAvecRetard > 0 ? Math.round(totalRetardMinutes / employesAvecRetard) : 0;

    // Calculer le taux de présence en excluant les employés en congé ET en repos
    const totalEmployesTravail = total - enConge - enRepos;
    const presentsTotal = presents + retards + sortiesAnticipees + presentsAvecRetard;
    const tauxPresence = totalEmployesTravail > 0 ? Math.round((presentsTotal / totalEmployesTravail) * 100) : 0;
    const tauxAbsence = totalEmployesTravail > 0 ? Math.round((absents / totalEmployesTravail) * 100) : 0;

    return {
      total_employes: total,
      presents,
      absents,
      retards,
      sorties_anticipees: sortiesAnticipees,
      presents_avec_retard: presentsAvecRetard,
      en_conge: enConge,
      taux_presence: tauxPresence,
      taux_absence: tauxAbsence,
      retard_moyen_minutes: retardMoyen,
      en_repos: enRepos,
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

  public async getEmployesEnRepos(date: string): Promise<AnalyseOutput[]> {
    return await this.getAnalysesByStatut(StatutAnalyse.EN_REPOS, date);
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
      
      // Ne compter que les jours de travail (pas les congés ni repos)
      if (analyse.statut_final !== StatutAnalyse.EN_CONGE && analyse.statut_final !== StatutAnalyse.EN_REPOS) {
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
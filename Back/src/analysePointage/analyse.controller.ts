import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Path,
  Post,
  Route,
  Tags,
  Security,
  Query,
} from "tsoa";
import { AnalyseOutput, StatutAnalyse } from "./analyse.entity";
import { AnalyseService, AnalyseCreationParams, AnalyseUpdateParams } from "./analyse.service";

interface AnalyseValidationResult {
  success: boolean;
  message: string;
  data?: any;
}

@Route("analyses")
@Tags("Analyse")
export class AnalyseController extends Controller {

  // ===== CRUD BASIQUE =====

  

  @Post()
  @Security("jwt", ["admin", "RH"])
  public async createAnalyse(@Body() requestBody: AnalyseCreationParams): Promise<AnalyseValidationResult> {
    try {
      const analyse = await new AnalyseService().createAnalyse(requestBody);
      this.setStatus(201);
      return {
        success: true,
        message: "Analyse créée avec succès",
        data: analyse
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la création: ${error}`
      };
    }
  }

  @Get()
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAllAnalyses(): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAllAnalyses();
  }

  @Put("{id}")
  @Security("jwt", ["admin", "RH"])
  public async updateAnalyse(
    @Path() id: number,
    @Body() requestBody: AnalyseUpdateParams
  ): Promise<AnalyseValidationResult> {
    try {
      const analyse = await new AnalyseService().updateAnalyse(id, requestBody);
      return {
        success: true,
        message: "Analyse mise à jour avec succès",
        data: analyse
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la mise à jour: ${error}`
      };
    }
  }

  @Delete("{id}")
  @Security("jwt", ["admin"])
  public async deleteAnalyse(@Path() id: number): Promise<AnalyseOutput | undefined> {
    return new AnalyseService().deleteAnalyse(id);
  }

  // ===== ANALYSES PAR CRITÈRES =====

  @Get("date/{date}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesByDate(@Path() date: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAnalysesByDate(date);
  }

  @Get("matricule/{matricule}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesByMatricule(@Path() matricule: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAnalysesByMatricule(matricule);
  }

  @Get("statut/{statut}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesByStatut(
    @Path() statut: StatutAnalyse,
    @Query() date?: string
  ): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAnalysesByStatut(statut, date);
  }

  // ===== ANALYSE PRINCIPALE =====

  @Post("analyser-journee")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async analyserJournee(@Body() body: { date: string }): Promise<AnalyseValidationResult> {
    try {
      const { date } = body;
      
      // Validation de la date
      if (!date || isNaN(new Date(date).getTime())) {
        return {
          success: false,
          message: "Date invalide. Format attendu: YYYY-MM-DD"
        };
      }

      console.log(`📊 Démarrage analyse de la journée ${date}`);
      
      const result = await new AnalyseService().analyserJournee(date);
      
      return {
        success: true,
        message: `Analyse terminée: ${result.statistiques.total_employes} employés analysés`,
        data: result
      };
    } catch (error) {
      console.error("Erreur analyse journée:", error);
      return {
        success: false,
        message: `Erreur lors de l'analyse: ${error}`
      };
    }
  }

  @Post("analyser-aujourdhui")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async analyserAujourdhui(): Promise<AnalyseValidationResult> {
    try {
      const aujourdhui = new Date().toISOString().split('T')[0];
      
      console.log(`📊 Analyse automatique du ${aujourdhui}`);
      
      const result = await new AnalyseService().analyserJournee(aujourdhui);
      
      return {
        success: true,
        message: `Analyse d'aujourd'hui terminée`,
        data: {
          date: aujourdhui,
          ...result
        }
      };
    } catch (error) {
      console.error("Erreur analyse aujourd'hui:", error);
      return {
        success: false,
        message: `Erreur lors de l'analyse: ${error}`
      };
    }
  }

  // ===== ANALYSES SPÉCIALISÉES =====

  @Get("retards/{date}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getRetardsDuJour(@Path() date: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getRetardsDuJour(date);
  }

  @Get("absents/{date}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getAbsentsDuJour(@Path() date: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAbsentsDuJour(date);
  }

  @Get("sorties-anticipees/{date}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getSortiesAnticipeesDuJour(@Path() date: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getSortiesAnticipeesDuJour(date);
  }

  @Get("statistiques/{date}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getStatistiquesJour(@Path() date: string): Promise<{
    date: string;
    statistiques: any;
  }> {
    try {
      const analyses = await new AnalyseService().getAnalysesByDate(date);
      
      if (analyses.length === 0) {
        return {
          date,
          statistiques: {
            message: "Aucune analyse trouvée pour cette date. Lancez d'abord l'analyse.",
            total_employes: 0,
            presents: 0,
            absents: 0,
            retards: 0,
            sorties_anticipees: 0,
            presents_avec_retard: 0,
            en_conge: 0,
            en_repos: 0,
            taux_presence: 0,
            taux_absence: 0,
            retard_moyen_minutes: 0
          }
        };
      }

      const analyseService = new AnalyseService();
      const statistiques = (analyseService as any).calculerStatistiques(analyses);

      return {
        date,
        statistiques
      };
    } catch (error) {
      throw new Error(`Erreur calcul statistiques: ${error}`);
    }
  }

  // ===== JUSTIFICATIONS =====

  @Put("justifier/{id}")
  @Security("jwt", ["admin", "RH"])
  public async justifierAnalyse(
    @Path() id: number,
    @Body() body: { justifie: boolean; commentaire?: string }
  ): Promise<AnalyseValidationResult> {
    try {
      const analyse = await new AnalyseService().justifierAnalyse(id, body.justifie, body.commentaire);
      
      if (!analyse) {
        return {
          success: false,
          message: "Analyse non trouvée"
        };
      }

      return {
        success: true,
        message: `${body.justifie ? 'Justification ajoutée' : 'Justification supprimée'}`,
        data: analyse
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la justification: ${error}`
      };
    }
  }

  @Put("justifier-matricule/{matricule}/{date}")
  @Security("jwt", ["admin", "RH"])
  public async justifierParMatriculeDate(
    @Path() matricule: string,
    @Path() date: string,
    @Body() body: { justifie: boolean; commentaire?: string }
  ): Promise<AnalyseValidationResult> {
    try {
      const analyses = await new AnalyseService().getAnalysesByDate(date);
      const analyse = analyses.find(a => a.matricule === matricule);
      
      if (!analyse) {
        return {
          success: false,
          message: "Analyse non trouvée pour cet employé et cette date"
        };
      }

      const updated = await new AnalyseService().justifierAnalyse(analyse.id_analyse, body.justifie, body.commentaire);
      
      return {
        success: true,
        message: `${body.justifie ? 'Justification ajoutée' : 'Justification supprimée'} pour ${matricule}`,
        data: updated
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la justification: ${error}`
      };
    }
  }

  // ===== RAPPORTS ET DASHBOARDS =====

  @Get("dashboard-aujourdhui")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getDashboardAujourdhui(): Promise<{
    date: string;
    heure_actuelle: string;
    analyses_disponibles: boolean;
    statistiques?: any;
    retards?: AnalyseOutput[];
    absents?: AnalyseOutput[];
    alertes?: string[];
  }> {
    try {
      const maintenant = new Date();
      const aujourdhui = maintenant.toISOString().split('T')[0];
      const heureActuelle = maintenant.toLocaleTimeString('fr-FR');
      
      const analyseService = new AnalyseService();
      
      // Vérifier si des analyses existent pour aujourd'hui
      const analyses = await analyseService.getAnalysesByDate(aujourdhui);
      
      if (analyses.length === 0) {
        return {
          date: aujourdhui,
          heure_actuelle: heureActuelle,
          analyses_disponibles: false,
          alertes: ["Aucune analyse disponible pour aujourd'hui. Lancez l'analyse de la journée."]
        };
      }

      const [retards, absents] = await Promise.all([
        analyseService.getRetardsDuJour(aujourdhui),
        analyseService.getAbsentsDuJour(aujourdhui)
      ]);

      const statistiques = (analyseService as any).calculerStatistiques(analyses);
      
      const alertes = [];
      if (absents.length > 0) {
        alertes.push(`🚨 ${absents.length} employé(s) absent(s)`);
      }
      if (retards.length > 5) {
        alertes.push(`⏰ ${retards.length} employé(s) en retard`);
      }
      if (statistiques.taux_presence < 80) {
        alertes.push(`📉 Taux de présence faible: ${statistiques.taux_presence}%`);
      }

      return {
        date: aujourdhui,
        heure_actuelle: heureActuelle,
        analyses_disponibles: true,
        statistiques,
        retards: retards.slice(0, 10), // Top 10 retards
        absents: absents.slice(0, 20), // Top 20 absents
        alertes
      };
    } catch (error) {
      console.error("Erreur dashboard:", error);
      throw error;
    }
  }

  @Get("dashboard-temps-reel")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getDashboardTempsReel(): Promise<{
    date: string;
    heure_actuelle: string;
    analyses_jour: AnalyseOutput[];
    retards_actuels: AnalyseOutput[];
    absents_actuels: AnalyseOutput[];
    statistiques: any;
    alertes_non_justifiees: number;
  }> {
    try {
      const maintenant = new Date();
      const aujourdhui = maintenant.toISOString().split('T')[0];
      const heureActuelle = maintenant.toLocaleTimeString('fr-FR');

      const analyseService = new AnalyseService();
      
      const [analyses, retards, absents] = await Promise.all([
        analyseService.getAnalysesByDate(aujourdhui),
        analyseService.getRetardsDuJour(aujourdhui),
        analyseService.getAbsentsDuJour(aujourdhui)
      ]);

      const statistiques = analyses.length > 0 ? (analyseService as any).calculerStatistiques(analyses) : {
        total_employes: 0,
        presents: 0,
        absents: 0,
        retards: 0,
        sorties_anticipees: 0,
        presents_avec_retard: 0,
        en_conge: 0,
        en_repos: 0,
        taux_presence: 0,
        taux_absence: 0,
        retard_moyen_minutes: 0
      };

      const alertesNonJustifiees = [...retards, ...absents].filter(a => !a.justifie).length;

      return {
        date: aujourdhui,
        heure_actuelle: heureActuelle,
        analyses_jour: analyses,
        retards_actuels: retards,
        absents_actuels: absents,
        statistiques,
        alertes_non_justifiees: alertesNonJustifiees
      };
    } catch (error) {
      console.error("Erreur dashboard temps réel:", error);
      throw error;
    }
  }

  @Get("rapport-periode")
  //@Security("jwt", ["admin", "RH"])
  public async getRapportPeriode(
    @Query() dateDebut: string,
    @Query() dateFin: string
  ): Promise<{
    periode: string;
    analyses: AnalyseOutput[];
    statistiques_globales: any;
    top_retardataires: any[];
    top_absents: any[];
  }> {
    try {
      if (!dateDebut || !dateFin) {
        throw new Error("dateDebut et dateFin sont requis");
      }

      return await new AnalyseService().getRapportPeriode(dateDebut, dateFin);
    } catch (error) {
      throw new Error(`Erreur génération rapport: ${error}`);
    }
  }

  @Get("rapport-mensuel/{annee}/{mois}")
  //@Security("jwt", ["admin", "RH"])
  public async getRapportMensuel(
    @Path() annee: number,
    @Path() mois: number
  ): Promise<{
    mois: string;
    statistiques_globales: any;
    analyses: AnalyseOutput[];
    retardataires_du_mois: any[];
    absents_du_mois: any[];
  }> {
    try {
      const debutMois = new Date(annee, mois - 1, 1).toISOString().split('T')[0];
      const finMois = new Date(annee, mois, 0).toISOString().split('T')[0];
      
      const rapport = await new AnalyseService().getRapportPeriode(debutMois, finMois);
      
      return {
        mois: `${mois.toString().padStart(2, '0')}/${annee}`,
        statistiques_globales: rapport.statistiques_globales,
        analyses: rapport.analyses,
        retardataires_du_mois: rapport.top_retardataires,
        absents_du_mois: rapport.top_absents
      };
    } catch (error) {
      throw new Error(`Erreur rapport mensuel: ${error}`);
    }
  }

  // ===== UTILITAIRES ET MAINTENANCE =====

  @Post("recalculer-periode")
  //@Security("jwt", ["admin"])
  public async recalculerPeriode(@Body() body: { 
    dateDebut: string; 
    dateFin: string 
  }): Promise<AnalyseValidationResult> {
    try {
      const { dateDebut, dateFin } = body;
      
      // Validation des dates
      if (!dateDebut || !dateFin || isNaN(new Date(dateDebut).getTime()) || isNaN(new Date(dateFin).getTime())) {
        return {
          success: false,
          message: "Dates invalides. Format attendu: YYYY-MM-DD"
        };
      }

      const analyseService = new AnalyseService();
      let totalJours = 0;
      let joursTraites = 0;

      // Calculer le nombre de jours
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      const diffTime = fin.getTime() - debut.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      totalJours = diffDays;

      console.log(`🔄 Recalcul des analyses du ${dateDebut} au ${dateFin} (${totalJours} jours)`);

      // Analyser chaque jour de la période
      for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(debut);
        currentDate.setDate(debut.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        try {
          console.log(`📊 Analyse du ${dateStr}...`);
          await analyseService.analyserJournee(dateStr);
          joursTraites++;
        } catch (error) {
          console.error(`❌ Erreur analyse ${dateStr}:`, error);
          // Continuer même en cas d'erreur sur un jour
        }
      }

      return {
        success: true,
        message: `Recalcul terminé: ${joursTraites}/${totalJours} jours traités`,
        data: {
          periode: `${dateDebut} au ${dateFin}`,
          total_jours: totalJours,
          jours_traites: joursTraites,
          jours_erreur: totalJours - joursTraites
        }
      };
    } catch (error) {
      console.error("Erreur recalcul période:", error);
      return {
        success: false,
        message: `Erreur lors du recalcul: ${error}`
      };
    }
  }

  @Delete("nettoyer-anciennes/{nbJours}")
  @Security("jwt", ["admin"])
  public async nettoyerAnciennesAnalyses(@Path() nbJours: number): Promise<AnalyseValidationResult> {
    try {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - nbJours);

      const result = await new AnalyseService().getAllAnalyses();
      const anciennesAnalyses = result.filter(a => new Date(a.date) < dateLimit);

      // Supprimer les anciennes analyses
      for (const analyse of anciennesAnalyses) {
        await new AnalyseService().deleteAnalyse(analyse.id_analyse);
      }

      return {
        success: true,
        message: `${anciennesAnalyses.length} analyses anciennes supprimées (plus de ${nbJours} jours)`,
        data: {
          date_limite: dateLimit.toISOString().split('T')[0],
          analyses_supprimees: anciennesAnalyses.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors du nettoyage: ${error}`
      };
    }
  }
//CONGE
@Get("en-repos/{date}")
//@Security("jwt", ["admin", "RH", "superviseur"])
public async getEmployesEnRepos(@Path() date: string): Promise<AnalyseOutput[]> {
  return new AnalyseService().getEmployesEnRepos(date);
}
  // ===== EXPORTS =====

  @Get("export-csv/{date}")
  @Security("jwt", ["admin", "RH"])
  public async exportCsv(@Path() date: string): Promise<{
    success: boolean;
    csv_data?: string;
    filename?: string;
    message: string;
  }> {
    try {
      const analyses = await new AnalyseService().getAnalysesByDate(date);
      
      if (analyses.length === 0) {
        return {
          success: false,
          message: "Aucune analyse trouvée pour cette date"
        };
      }

      // Générer CSV
      const headers = [
        "Matricule", "Nom", "Prénom", "Équipe", "Date",
        "Heure Prévue Arrivée", "Heure Prévue Départ",
        "Heure Réelle Arrivée", "Heure Réelle Départ",
        "Retard (min)", "Sortie Anticipée (min)",
        "Statut", "Justifié", "Commentaire"
      ];

      const rows = analyses.map(a => [
        a.matricule,
        a.user?.nom || '',
        a.user?.prenom || '',
        a.user?.equipe?.equipe || '',
        a.date.toISOString().split('T')[0],
        a.heure_prevue_arrivee || '',
        a.heure_prevue_depart || '',
        a.heure_reelle_arrivee || '',
        a.heure_reelle_depart || '',
        a.retard_minutes.toString(),
        a.sortie_anticipee_minutes.toString(),
        a.statut_final,
        a.justifie ? 'Oui' : 'Non',
        a.commentaire || ''
      ]);

      const csvData = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return {
        success: true,
        csv_data: csvData,
        filename: `analyses_${date}.csv`,
        message: `Export CSV généré: ${analyses.length} lignes`
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur export CSV: ${error}`
      };
    }
  }

  // ===== ROUTE GET PAR ID (placée à la fin pour éviter les conflits de routing) =====
  @Get("{id}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalyse(@Path() id: number): Promise<AnalyseOutput | undefined> {
    return new AnalyseService().getAnalyseById(id);
  }
}
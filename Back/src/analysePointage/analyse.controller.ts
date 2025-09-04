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

  @Get("lieu-travail/{lieuTravail}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesByLieuTravail(
    @Path() lieuTravail: string,
    @Query() date?: string
  ): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAnalysesByLieuTravail(lieuTravail, date);
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
      const statistiques = analyseService.calculerStatistiques(analyses);

      return {
        date,
        statistiques
      };
    } catch (error) {
      throw new Error(`Erreur calcul statistiques: ${error}`);
    }
  }

  // ===== NOUVELLES FONCTIONNALITÉS D'ANALYSE ENTRE DEUX DATES =====

  @Get("analyse-periode/{dateDebut}/{dateFin}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesPeriode(
    @Path() dateDebut: string,
    @Path() dateFin: string,
    @Query() page?: number,
    @Query() limit?: number,
    @Query() includeRelations?: boolean
  ): Promise<{
    periode: string;
    analyses: AnalyseOutput[];
    pagination?: any;
    statistiques: any;
  }> {
    try {
      if (!dateDebut || !dateFin) {
        throw new Error("dateDebut et dateFin sont requis");
      }

      const analyseService = new AnalyseService();
      
      // Paramètres par défaut optimisés pour la performance
      const pageNum = page || 1;
      const limitNum = limit || 10000; // Limite élevée par défaut
      const includeRel = includeRelations || false; // Relations désactivées par défaut
      
      console.log(`📊 Récupération analyses période ${dateDebut} à ${dateFin} - Page ${pageNum}, Limit ${limitNum}, Relations: ${includeRel}`);

      // Utiliser la méthode optimisée
      const result = await analyseService.getAnalysesPeriode(dateDebut, dateFin, pageNum, limitNum, includeRel);
      
      if (result.analyses.length === 0) {
        return {
          periode: `${dateDebut} au ${dateFin}`,
          analyses: [],
          pagination: result.pagination,
          statistiques: {
            message: "Aucune analyse trouvée pour cette période",
            total_jours: 0,
            total_analyses: 0,
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

      // Calculer les statistiques sur les analyses récupérées
      const statistiques = analyseService.calculerStatistiquesPeriode(result.analyses, dateDebut, dateFin);

      console.log(`✅ ${result.analyses.length} analyses récupérées (${result.pagination.total} total) en ${result.pagination.totalPages} pages`);

      return {
        periode: `${dateDebut} au ${dateFin}`,
        analyses: result.analyses,
        pagination: result.pagination,
        statistiques
      };
    } catch (error) {
      throw new Error(`Erreur analyse période: ${error}`);
    }
  }




  @Get("employe/{matricule}/periode")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalyseEmployePeriode(
    @Path() matricule: string,
    @Query() dateDebut: string,
    @Query() dateFin: string
  ): Promise<{
    employe: any;
    periode: string;
    analyses: AnalyseOutput[];
    statistiques_employe: any;
  }> {
    try {
      if (!dateDebut || !dateFin) {
        throw new Error("dateDebut et dateFin sont requis");
      }

      const analyseService = new AnalyseService();
      const analyses = await analyseService.getAnalysesEmployePeriode(matricule, dateDebut, dateFin);
      
      if (analyses.length === 0) {
        return {
          employe: null,
          periode: `${dateDebut} au ${dateFin}`,
          analyses: [],
          statistiques_employe: {
            message: "Aucune analyse trouvée pour cet employé sur cette période",
            matricule,
            periode: `${dateDebut} au ${dateFin}`,
            total_jours: 0,
            jours_presents: 0,
            jours_absents: 0,
            jours_retards: 0,
            jours_sorties_anticipees: 0,
            jours_conge: 0,
            jours_repos: 0,
            total_retard_minutes: 0,
            total_sortie_anticipee_minutes: 0,
            retard_moyen_minutes: 0,
            taux_presence: 0,
            taux_absence: 0,
            // Statistiques d'heures de travail
            total_heures_travail: 0,
            total_minutes_travail: 0,
            moyenne_heures_travail: "0h00",
            moyenne_heures_par_jour: "0.0",
            jours_avec_heures_completes: 0,
            jours_pas_sortie: 0,
            jours_anomalies: 0,
            jours_court_travail: 0,
            jours_long_travail: 0,
            taux_heures_completes: 0,
            taux_pas_sortie: 0,
            taux_anomalies: 0
          }
        };
      }

      const statistiques = analyseService.calculerStatistiquesEmploye(analyses, dateDebut, dateFin);
      const employe = analyses[0]?.user;

      return {
        employe,
        periode: `${dateDebut} au ${dateFin}`,
        analyses,
        statistiques_employe: {
          matricule,
          periode: `${dateDebut} au ${dateFin}`,
          ...statistiques
        }
      };
    } catch (error) {
      throw new Error(`Erreur analyse employé période: ${error}`);
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

  @Get("en-repos/{date}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getEmployesEnRepos(@Path() date: string): Promise<AnalyseOutput[]> {
    return new AnalyseService().getEmployesEnRepos(date);
  }

  // ===== NOUVELLES ROUTES POUR LES HEURES DE TRAVAIL =====

  @Get("heures-travail/{date}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getAnalysesParHeuresTravail(
    @Path() date: string,
    @Query() filtre: 'normal' | 'pas_sortie' | 'anomalie' | 'court' | 'long' = 'normal'
  ): Promise<AnalyseOutput[]> {
    return new AnalyseService().getAnalysesParHeuresTravail(date, filtre);
  }

  @Get("statistiques-heures-travail/{date}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getStatistiquesHeuresTravail(@Path() date: string): Promise<{
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
            total_analyses: 0,
            analyses_avec_heures: 0,
            pas_sortie: 0,
            anomalies: 0,
            heures_completes: 0,
            total_heures_travail: 0,
            moyenne_heures_travail: "0h00",
            taux_heures_completes: 0,
            taux_pas_sortie: 0,
            taux_anomalies: 0
          }
        };
      }

      const analyseService = new AnalyseService();
      const statistiques = analyseService.calculerStatistiquesHeuresTravail(analyses);

      return {
        date,
        statistiques
      };
    } catch (error) {
      throw new Error(`Erreur calcul statistiques heures de travail: ${error}`);
    }
  }

  @Get("heures-travail-periode/{dateDebut}/{dateFin}")
  //@Security("jwt", ["admin", "RH", "superviseur"])
  public async getStatistiquesHeuresTravailPeriode(
    @Path() dateDebut: string,
    @Path() dateFin: string
  ): Promise<{
    periode: string;
    statistiques: any;
  }> {
    try {
      if (!dateDebut || !dateFin) {
        throw new Error("dateDebut et dateFin sont requis");
      }

      const analyseService = new AnalyseService();
      const analyses = await analyseService.getAnalysesPeriode(dateDebut, dateFin, 1, 100000, false);
      const statistiques = analyseService.calculerStatistiquesHeuresTravail(analyses.analyses);

      return {
        periode: `${dateDebut} au ${dateFin}`,
        statistiques
      };
    } catch (error) {
      throw new Error(`Erreur calcul statistiques heures de travail période: ${error}`);
    }
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
        "Heures de Travail", "Statut", "Justifié", "Commentaire"
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
        a.h_travail || '',
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
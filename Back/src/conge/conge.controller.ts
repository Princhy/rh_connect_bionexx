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
    Query,
    Security
} from "tsoa";
import { IConge, CongeOutput, CongeCreateParams, CongeUpdateParams } from "./conge.interface";
import { CongeService } from "./conge.service";
import { TypeConge } from "./conge.entity";

interface CongeValidationResult {
    success: boolean;
    message: string;
    data?: any;
}

interface SoldeValidationResult {
    valid: boolean;
    soldeActuel: number;
    message: string;
}

@Route("conges")
@Tags("Conge")
export class CongeController extends Controller {
    
    // Récupérer un congé par ID
    @Get("{id}")
    @Security("jwt")
    public async getConge(@Path() id: number): Promise<CongeOutput | undefined> {
        return new CongeService().getCongeById(id);
    }

    // Créer un nouveau congé
    @Post()
    //@Security("jwt", ["admin", "RH")
    public async createConge(@Body() requestBody: CongeCreateParams): Promise<CongeValidationResult> {
        try {
            const congeService = new CongeService();

            // Validation des dates
            const dateDepart = new Date(requestBody.date_depart);
            const dateReprise = new Date(requestBody.date_reprise);
            
            if (dateDepart >= dateReprise) {
                return {
                    success: false,
                    message: 'La date de départ doit être antérieure à la date de reprise'
                };
            }

            // Vérifier les conflits de dates
            const hasConflict = await congeService.checkConflitDates(
                requestBody.matricule,
                dateDepart,
                dateReprise
            );

            if (hasConflict) {
                return {
                    success: false,
                    message: 'Il existe déjà un congé pour cette période'
                };
            }

            // Valider le solde (sauf pour les congés sans solde)
           {/*  if (requestBody.type !== TypeConge.AUTRE) {
                const soldeValidation = await congeService.validateSoldeConge(
                    requestBody.matricule,
                    requestBody.nbr_jours_permis
                );

                if (!soldeValidation.valid) {
                    return {
                        success: false,
                        message: `Solde insuffisant. Solde actuel: ${soldeValidation.soldeActuel} jours, demandé: ${requestBody.nbr_jours_permis} jours`
                    };
                }
            }
            */}
            const conge = await congeService.createConge(requestBody);
            this.setStatus(201);
            
            return {
                success: true,
                message: 'Congé créé avec succès',
                data: conge
            };

        } catch (error) {
            return {
                success: false,
                message: `Erreur lors de la création du congé: ${error}`
            };
        }
    }

    // Récupérer tous les congés
    @Get()
    //@Security("jwt", ["admin", "RH", "superviseur"])
    public async getAllConges(): Promise<CongeOutput[]> {
        return new CongeService().getAllConges();
    }

    // Mettre à jour un congé
    @Put("{id}")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async updateConge(
        @Path() id: number,
        @Body() requestBody: CongeUpdateParams
    ): Promise<CongeValidationResult> {
        try {
            const congeService = new CongeService();

            // Si les dates sont modifiées, valider
            if (requestBody.date_depart && requestBody.date_reprise) {
                const dateDepart = new Date(requestBody.date_depart);
                const dateReprise = new Date(requestBody.date_reprise);
                
                if (dateDepart >= dateReprise) {
                    return {
                        success: false,
                        message: 'La date de départ doit être antérieure à la date de reprise'
                    };
                }

                // Vérifier les conflits (en excluant le congé actuel)
                if (requestBody.matricule) {
                    const hasConflict = await congeService.checkConflitDates(
                        requestBody.matricule,
                        dateDepart,
                        dateReprise,
                        id
                    );

                    if (hasConflict) {
                        return {
                            success: false,
                            message: 'Il existe déjà un congé pour cette période'
                        };
                    }
                }
            }

            const conge = await congeService.updateConge(id, requestBody);
            
            if (!conge) {
                this.setStatus(404);
                return {
                    success: false,
                    message: 'Congé non trouvé'
                };
            }

            return {
                success: true,
                message: 'Congé mis à jour avec succès',
                data: conge
            };

        } catch (error) {
            return {
                success: false,
                message: `Erreur lors de la mise à jour du congé: ${error}`
            };
        }
    }

    // Supprimer un congé
    @Delete("{id}")
    @Security("jwt", ["admin", "RH"])
    public async deleteConge(@Path() id: number): Promise<CongeValidationResult> {
        try {
            const conge = await new CongeService().deleteConge(id);
            
            if (!conge) {
                this.setStatus(404);
                return {
                    success: false,
                    message: 'Congé non trouvé'
                };
            }

            return {
                success: true,
                message: 'Congé supprimé avec succès'
            };

        } catch (error) {
            return {
                success: false,
                message: `Erreur lors de la suppression du congé: ${error}`
            };
        }
    }

    // Récupérer les congés par matricule
    @Get("matricule/{matricule}")
    @Security("jwt")
    public async getCongesByMatricule(@Path() matricule: string): Promise<CongeOutput[]> {
        return new CongeService().getCongesByMatricule(matricule);
    }

    // Récupérer les congés par type
    @Get("type/{type}")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesByType(@Path() type: TypeConge): Promise<CongeOutput[]> {
        return new CongeService().getCongesByType(type);
    }

    // Récupérer les congés par motif
    @Get("motif/{motif}")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesByMotif(@Path() motif: string): Promise<CongeOutput[]> {
        return new CongeService().getCongesByMotif(motif);
    }

    // Récupérer les congés par département
    @Get("departement/{departementId}")
    //@Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesByDepartement(@Path() departementId: number): Promise<CongeOutput[]> {
        return new CongeService().getCongesByDepartement(departementId);
    }

    // Récupérer les congés par département avec filtres
    @Get("departement-filtres")
    //@Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesByDepartementFiltres(
        @Query() departementId: number,
        @Query() statut?: string,
        @Query() type?: TypeConge,
        @Query() dateDebut?: string,
        @Query() dateFin?: string
    ): Promise<CongeOutput[]> {
        const congeService = new CongeService();
        
        const filters: any = {};
        if (statut) filters.statut = statut;
        if (type) filters.type = type;
        if (dateDebut && dateFin) {
            filters.dateDebut = new Date(dateDebut);
            filters.dateFin = new Date(dateFin);
        }
        
        return await congeService.getCongesByDepartementWithFilters(departementId, filters);
    }

    // Récupérer les statistiques des congés par département
    @Get("departement-stats/{departementId}")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesStatsByDepartement(
        @Path() departementId: number,
        @Query() annee?: number
    ): Promise<{
        departementId: number;
        totalConges: number;
        congesValides: number;
        congesEnAttente: number;
        congesRefuses: number;
        totalJours: number;
        repartitionParType: any;
        repartitionParMois: any;
    }> {
        const congeService = new CongeService();
        const conges = await congeService.getCongesByDepartement(departementId);
        
        // Filtrer par année si spécifiée
        let congesFiltres = conges;
        if (annee) {
            congesFiltres = conges.filter(conge => {
                const dateDepart = new Date(conge.date_depart);
                return dateDepart.getFullYear() === annee;
            });
        }
        
        // Calculer les statistiques
        const totalConges = congesFiltres.length;
        const congesValides = congesFiltres.filter(c => c.statut === 'VALIDE').length;
        const congesEnAttente = congesFiltres.filter(c => c.statut === 'ATTENTE').length;
        const congesRefuses = congesFiltres.filter(c => c.statut === 'REFUSE').length;
        const totalJours = congesFiltres.reduce((sum, conge) => sum + conge.nbr_jours_permis, 0);
        
        // Répartition par type
        const repartitionParType = congesFiltres.reduce((acc, conge) => {
            acc[conge.type] = (acc[conge.type] || 0) + 1;
            return acc;
        }, {} as any);
        
        // Répartition par mois
        const repartitionParMois = congesFiltres.reduce((acc, conge) => {
            const dateDepart = new Date(conge.date_depart);
            const mois = dateDepart.getMonth() + 1;
            acc[mois] = (acc[mois] || 0) + 1;
            return acc;
        }, {} as any);
        
        return {
            departementId,
            totalConges,
            congesValides,
            congesEnAttente,
            congesRefuses,
            totalJours,
            repartitionParType,
            repartitionParMois
        };
    }

    // Récupérer les congés en cours
    @Get("en-cours")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesEnCours(): Promise<CongeOutput[]> {
        return new CongeService().getCongesEnCours();
    }

    // Récupérer les congés à venir
    @Get("a-venir")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesAVenir(): Promise<CongeOutput[]> {
        return new CongeService().getCongesAVenir();
    }

    // Récupérer les congés par période
    @Get("periode")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getCongesByPeriode(
        @Query() dateDebut: string,
        @Query() dateFin: string
    ): Promise<CongeOutput[]> {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        return new CongeService().getCongesByDateRange(debut, fin);
    }

    // Obtenir le solde de congés d'un employé
    @Get("solde/{matricule}")
    @Security("jwt")
    public async getSoldeConge(@Path() matricule: string): Promise<{ solde: number }> {
        const solde = await new CongeService().getSoldeCongeByMatricule(matricule);
        return { solde };
    }

    // Valider le solde avant création d'un congé
    @Post("valider-solde")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async validerSoldeConge(
        @Body() requestBody: { matricule: string; joursDemanDes: number }
    ): Promise<SoldeValidationResult> {
        const validation = await new CongeService().validateSoldeConge(
            requestBody.matricule,
            requestBody.joursDemanDes
        );

        return {
            valid: validation.valid,
            soldeActuel: validation.soldeActuel,
            message: validation.valid 
                ? 'Solde suffisant' 
                : `Solde insuffisant. Solde actuel: ${validation.soldeActuel} jours, demandé: ${requestBody.joursDemanDes} jours`
        };
    }

    // Obtenir les statistiques de congés par employé
    @Get("statistiques/{matricule}")
    @Security("jwt", ["admin", "RH", "superviseur"])
    public async getStatistiquesConge(
        @Path() matricule: string,
        @Query() annee?: number
    ): Promise<{ totalJours: number; soldeActuel: number }> {
        const congeService = new CongeService();
        const totalJours = await congeService.getTotalJoursCongeByMatricule(matricule, annee);
        const soldeActuel = await congeService.getSoldeCongeByMatricule(matricule);

        return {
            totalJours,
            soldeActuel
        };
    }
}
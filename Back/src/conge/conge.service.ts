import { IConge, CongeOutput, CongeCreateParams, CongeUpdateParams } from "./conge.interface";
import { congeRepository } from "./conge.repository";
import { TypeConge} from "./conge.entity";
import { Between } from "typeorm";

export class CongeService {
    // Congé CRUD operations
    public async getCongeById(id: number): Promise<CongeOutput | undefined> {
        return await congeRepository().findOne({ 
            where: { id_conge: id },
            relations: ['user']
        });
    }

    public async createConge(params: CongeCreateParams): Promise<IConge> {
        // Récupérer le département de l'utilisateur si pas fourni
        if (!params.departement_id) {
            const user = await congeRepository()
                .createQueryBuilder("conge")
                .leftJoin("user", "user", "user.matricule = :matricule", { matricule: params.matricule })
                .select("user.id_departement", "id_departement")
                .getRawOne();
            
            if (user) {
                params.departement_id = user.id_departement;
            }
        }

        const conge = congeRepository().create(params);
        return await congeRepository().save(conge);
    }

    public async getAllConges(): Promise<CongeOutput[]> {
        return await congeRepository().find({
            relations: ['user'],
        });
    }

    public async updateConge(id: number, params: CongeUpdateParams): Promise<IConge | undefined> {
        await congeRepository().update(id, params);
        return await this.getCongeById(id);
    }

    public async deleteConge(id: number): Promise<IConge | undefined> {
        const conge = await this.getCongeById(id);
        if (conge) {
            await congeRepository().delete(id);
        }
        return conge;
    }

    // Search and filter methods
    public async getCongesByMatricule(matricule: string): Promise<CongeOutput[]> {
        return await congeRepository().find({
            where: { matricule },
            relations: ['user'],
        });
    }

    public async getCongesByType(type: TypeConge): Promise<CongeOutput[]> {
        return await congeRepository().find({
            where: { type },
            relations: ['user'],
        });
    }

    public async getCongesByMotif(motif: string): Promise<CongeOutput[]> {
        return await congeRepository().find({
            where: { motif },
            relations: ['user'],

        });
    }

    public async getCongesByDepartement(departementId: number): Promise<CongeOutput[]> {
        return await congeRepository().find({
            where: { departement_id: departementId },
            relations: ['user'],
            order: { date_depart: 'ASC' }
        });
    }

    public async getCongesByDepartementWithFilters(
        departementId: number, 
        filters?: {
            statut?: string;
            type?: TypeConge;
            dateDebut?: Date;
            dateFin?: Date;
        }
    ): Promise<CongeOutput[]> {
        let query = congeRepository().createQueryBuilder("conge")
            .leftJoinAndSelect("conge.user", "user")
            .where("conge.departement_id = :departementId", { departementId });

        if (filters?.statut) {
            query = query.andWhere("conge.statut = :statut", { statut: filters.statut });
        }

        if (filters?.type) {
            query = query.andWhere("conge.type = :type", { type: filters.type });
        }

        if (filters?.dateDebut && filters?.dateFin) {
            query = query.andWhere("conge.date_depart BETWEEN :dateDebut AND :dateFin", {
                dateDebut: filters.dateDebut,
                dateFin: filters.dateFin
            });
        }

        return await query
            .orderBy("conge.date_depart", "ASC")
            .getMany();
    }

    public async getCongesByDateRange(dateDebut: Date, dateFin: Date): Promise<CongeOutput[]> {
        return await congeRepository().find({
            where: {
                date_depart: Between(dateDebut, dateFin)
            },
            relations: ['user'],
            order: { date_depart: 'ASC' }
        });
    }

    public async getCongesEnCours(): Promise<CongeOutput[]> {
        const today = new Date();
        return await congeRepository().createQueryBuilder("conge")
            .leftJoinAndSelect("conge.user", "user")
            .leftJoinAndSelect("conge.userInterim", "userInterim")
            .where("conge.date_depart <= :today", { today })
            .andWhere("conge.date_reprise >= :today", { today })
            .orderBy("conge.date_depart", "ASC")
            .getMany();
    }

    public async getCongesAVenir(): Promise<CongeOutput[]> {
        const today = new Date();
        return await congeRepository().createQueryBuilder("conge")
            .leftJoinAndSelect("conge.user", "user")
            .leftJoinAndSelect("conge.userInterim", "userInterim")
            .where("conge.date_depart > :today", { today })
            .orderBy("conge.date_depart", "ASC")
            .getMany();
    }

    // Calculs et statistiques
    public async getTotalJoursCongeByMatricule(matricule: string, annee?: number): Promise<number> {
        let query = congeRepository().createQueryBuilder("conge")
            .select("SUM(conge.nbr_jours_permis)", "total")
            .where("conge.matricule = :matricule", { matricule });

        if (annee) {
            query = query.andWhere("YEAR(conge.date_depart) = :annee", { annee });
        }

        const result = await query.getRawOne();
        return result.total || 0;
    }

    public async getSoldeCongeByMatricule(matricule: string): Promise<number> {
        const conge = await congeRepository().findOne({
            where: { matricule },
        });
        
        return conge?.solde_conge || 0;
    }

    // Vérifications
    public async checkConflitDates(matricule: string, dateDepart: Date, dateReprise: Date, excludeId?: number): Promise<boolean> {
        let query = congeRepository().createQueryBuilder("conge")
            .where("conge.matricule = :matricule", { matricule })
            .andWhere(
                "(conge.date_depart <= :dateReprise AND conge.date_reprise >= :dateDepart)",
                { dateDepart, dateReprise }
            );

        if (excludeId) {
            query = query.andWhere("conge.id_conge != :excludeId", { excludeId });
        }

        const conflits = await query.getCount();
        return conflits > 0;
    }

    public async validateSoldeConge(matricule: string, joursDemanDes: number): Promise<{ valid: boolean; soldeActuel: number }> {
        const soldeActuel = await this.getSoldeCongeByMatricule(matricule);
        return {
            valid: soldeActuel >= joursDemanDes,
            soldeActuel
        };
    }
}
import { IJourFerie, JourFerieOutput, JourFerieCreateParams, JourFerieUpdateParams } from "./jourferie.interface";
import { jourFerieRepository } from "./jourferie.repository";
import { Between } from "typeorm";

export class JourFerieService {
    public async getJourFerieById(id: number): Promise<JourFerieOutput | undefined> {
        return await jourFerieRepository().findOne({ where: { id_jourferie: id } });
    }

    public async createJourFerie(params: JourFerieCreateParams): Promise<IJourFerie> {
        const jourFerie = jourFerieRepository().create(params);
        return await jourFerieRepository().save(jourFerie);
    }

    public async getAllJoursFeries(): Promise<JourFerieOutput[]> {
        return await jourFerieRepository().find();
    }

    public async updateJourFerie(id: number, params: JourFerieUpdateParams): Promise<IJourFerie | undefined> {
        await jourFerieRepository().update(id, params);
        return await this.getJourFerieById(id);
    }

    public async deleteJourFerie(id: number): Promise<IJourFerie | undefined> {
        const jourFerie = await this.getJourFerieById(id);
        if (jourFerie) {
            await jourFerieRepository().delete(id);
        }
        return jourFerie;
    }

    public async getJoursFeriesByDateRange(dateDebut: Date, dateFin: Date): Promise<JourFerieOutput[]> {
        return await jourFerieRepository().find({
            where: { date: Between(dateDebut, dateFin) },
            order: { date: "ASC" }
        });
    }
}

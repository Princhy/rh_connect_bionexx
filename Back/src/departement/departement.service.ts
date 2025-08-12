import { IDepartement } from "./departement.entity";
import { departementRepository } from "./departement.repository";

export type DepartementCreationParams = Pick<IDepartement, "departement">;
export type DepartementUpdateParams = Partial<DepartementCreationParams>;

export class DepartementService {
  public async getDepartementById(id: number): Promise<IDepartement | undefined> {
    return await departementRepository().findOne({ where: { id_departement: id } });
  }

  public async createDepartement(params: DepartementCreationParams): Promise<IDepartement> {
    const departement = departementRepository().create(params);
    return await departementRepository().save(departement);
  }

  public async getAllDepartements(): Promise<IDepartement[]> {
    return await departementRepository().find();
  }

  public async updateDepartement(id: number, params: DepartementUpdateParams): Promise<IDepartement | undefined> {
    await departementRepository().update(id, params);
    return await this.getDepartementById(id);
  }

  public async deleteDepartement(id: number): Promise<IDepartement | undefined> {
    const departement = await this.getDepartementById(id);
    if (departement) {
      await departementRepository().delete(id);
    }
    return departement;
  }
}
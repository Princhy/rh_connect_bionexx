import { IEquipe } from "./equipe.entity";
import { equipeRepository } from "./equipe.repository";

export type EquipeCreationParams = Pick<IEquipe, "equipe">;
export type EquipeUpdateParams = Partial<EquipeCreationParams>;

export class EquipeService {
  public async getEquipeById(id: number): Promise<IEquipe | undefined> {
    return await equipeRepository().findOne({ where: { id_equipe: id } });
  }

  public async createEquipe(params: EquipeCreationParams): Promise<IEquipe> {
    const equipe = equipeRepository().create(params);
    return await equipeRepository().save(equipe);
  }

  public async getAllEquipes(): Promise<IEquipe[]> {
    return await equipeRepository().find();
  }

  public async updateEquipe(id: number, params: EquipeUpdateParams): Promise<IEquipe | undefined> {
    await equipeRepository().update(id, params);
    return await this.getEquipeById(id);
  }

  public async deleteEquipe(id: number): Promise<IEquipe | undefined> {
    const equipe = await this.getEquipeById(id);
    if (equipe) {
      await equipeRepository().delete(id);
    }
    return equipe;
  }
}
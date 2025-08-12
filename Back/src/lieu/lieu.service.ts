import { ILieu } from "./lieu.entity";
import { lieuRepository } from "./lieu.repository";

export type LieuCreationParams = Pick<ILieu, "lieu">;
export type LieuUpdateParams = Partial<LieuCreationParams>;

export class LieuService {
  public async getLieuById(id: number): Promise<ILieu | undefined> {
    return await lieuRepository().findOne({ where: { id_lieu: id } });
  }

  public async createLieu(params: LieuCreationParams): Promise<ILieu> {
    const lieu = lieuRepository().create(params);
    return await lieuRepository().save(lieu);
  }

  public async getAllLieux(): Promise<ILieu[]> {
    return await lieuRepository().find();
  }

  public async updateLieu(id: number, params: LieuUpdateParams): Promise<ILieu | undefined> {
    await lieuRepository().update(id, params);
    return await this.getLieuById(id);
  }

  public async deleteLieu(id: number): Promise<ILieu | undefined> {
    const lieu = await this.getLieuById(id);
    if (lieu) {
      await lieuRepository().delete(id);
    }
    return lieu;
  }
}
import { IPointeuse } from "./pointeuse.interface";
import { pointeuseRepository } from "./pointeuse.repository";

export type PointeuseCreationParams = Pick<
  IPointeuse,
  "adresse_ip" | "id_lieu"| "pointeuse"
>;

export type PointeuseUpdateParams = Partial<PointeuseCreationParams>;

export class PointeuseService {
  // Pointeuse CRUD operations
  public async getPointeuseById(id: number): Promise<IPointeuse | undefined> {
    return await pointeuseRepository().findOne({
      where: { id_pointeuse: id },
      relations: ['lieu']
    });
  }

  public async createPointeuse(params: PointeuseCreationParams): Promise<IPointeuse> {
    const pointeuse = pointeuseRepository().create(params);
    return await pointeuseRepository().save(pointeuse);
  }

  public async getAllPointeuses(): Promise<IPointeuse[]> {
    return await pointeuseRepository().find({
      relations: ['lieu']
    });
  }

  public async updatePointeuse(id: number, params: PointeuseUpdateParams): Promise<IPointeuse | undefined> {
    await pointeuseRepository().update(id, params);
    return await this.getPointeuseById(id);
  }

  public async deletePointeuse(id: number): Promise<IPointeuse | undefined> {
    const pointeuse = await this.getPointeuseById(id);
    if (pointeuse) {
      await pointeuseRepository().delete(id);
    }
    return pointeuse;
  }

  // Search and filter methods
  public async getPointeuseByIp(adresse_ip: string): Promise<IPointeuse | undefined> {
    return await pointeuseRepository().findOne({
      where: { adresse_ip },
      relations: ['lieu']
    });
  }

  public async getPointeusesByLieu(id_lieu: number): Promise<IPointeuse[]> {
    return await pointeuseRepository().find({
      where: { id_lieu },
      relations: ['lieu']
    });
  }
}
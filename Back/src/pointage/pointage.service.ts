import { Between } from "typeorm";
import { IPointage, PointageOutput } from "./pointage.interface";
import { pointageRepository } from "./pointage.repository";
import { Pointage } from "./pointage.entity";
import { TypePointage, StatutPointage, ModePointage} from "../enum"

export type PointageCreationParams = Pick<
  IPointage,
  "type" | "date" | "mode" | "statut" | "id_pointeuse" | "matricule" | "serialNo"
>;

export type PointageUpdateParams = Partial<PointageCreationParams>;

export class PointageService {

  // Pointage CRUD operations
  public async getPointageById(id: number): Promise<PointageOutput | undefined> {
    return await pointageRepository().findOne({
      where: { id_pointage: id },
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu']
    });
  }

  public async createPointage(params: PointageCreationParams): Promise<Pointage> {
    const pointage = pointageRepository().create(params);
    return await pointageRepository().save(pointage);
  }

  public async getAllPointages(): Promise<PointageOutput[]> {
    return await pointageRepository().find({
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu'],
      order: { date: 'DESC' },
      select:{
        user:{
          id_user:true,
          matricule: true,
          nom: true,
          prenom: true,
          poste: true,
          role: true
        }
      }
    });
  }

  public async updatePointage(id: number, params: PointageUpdateParams): Promise<PointageOutput | undefined> {
    await pointageRepository().update(id, params);
    return await this.getPointageById(id);
  }

  public async deletePointage(id: number): Promise<Pointage | undefined> {
    const pointage = await pointageRepository().findOne({ where: { id_pointage: id } });
    if (pointage) {
      await pointageRepository().delete(id);
    }
    return pointage;
  }

  // Search and filter methods
  public async getPointagesByMatricule(matricule: string): Promise<PointageOutput[]> {
    return await pointageRepository().find({
      where: { matricule },
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu'],
      order: { date: 'DESC' }
    });
  }

  public async getPointagesByDate(date: string): Promise<PointageOutput[]> {
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);
    
    return await pointageRepository().find({
      where: { 
        date: Between(startOfDay, endOfDay)
      },
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu'],
      order: { date: 'DESC' }
    });
  }

  public async getPointagesByMatriculeAndDate(matricule: string, date: string): Promise<PointageOutput[]> {
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);
    
    return await pointageRepository().find({
      where: { 
        matricule,
        date: Between(startOfDay, endOfDay)
      },
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu'],
      order: { date: 'ASC' }
    });
  }

  public async getPointagesByPointeuse(id_pointeuse: number): Promise<PointageOutput[]> {
    return await pointageRepository().find({
      where: { id_pointeuse },
      relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu'],
      order: { date: 'DESC' }
    });
  }

  public async getPointageBySerialNo(serialNo: number): Promise<PointageOutput | undefined> {
  return await pointageRepository().findOne({
    where: { serialNo },
    relations: ['pointeuse', 'user', 'user.lieu', 'user.equipe', 'user.departement','pointeuse.lieu']
  });
}
}
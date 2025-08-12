import { IUser,UserOutput} from "./user.interface";
import { userRepository, lieuRepository, equipeRepository, departementRepository } from "./user.repository";
import { TypeContrat, Role } from "../enum";

export type UserCreationParams = Pick<
  IUser, 
  "matricule" | "nom" | "prenom" | "email" | "phone" | "badge" | "empreinte" | 
  "poste" | "type_contrat" | "date_embauche" | "date_fin_contrat" | 
  "id_lieu" | "id_equipe" | "id_departement" | "role" | "password"
>;

export type UserUpdateParams = Partial<UserCreationParams>;

export class UserService {
  // User CRUD operations
  public async getUserById(id: number): Promise<IUser | undefined> {
    return await userRepository().findOne({ 
      where: { id_user: id },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async createUser(params: UserCreationParams): Promise<IUser> {
    const user = userRepository().create(params);
    return await userRepository().save(user);
  }

  public async getAllUsers(): Promise<UserOutput[]> {
    return await userRepository().find({
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async updateUser(id: number, params: UserUpdateParams): Promise<IUser | undefined> {
    await userRepository().update(id, params);
    return await this.getUserById(id);
  }

  public async deleteUser(id: number): Promise<IUser | undefined> {
    const user = await this.getUserById(id);
    if (user) {
      await userRepository().delete(id);
    }
    return user;
  }

  // Search and filter methods
  public async findByEmail(email:string): Promise<IUser>{
    return await userRepository().findOne({where: {email}})
  }


  public async getUserByMatricule(matricule: string): Promise<UserOutput | undefined> {
    return await userRepository().findOne({ 
      where: { matricule },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async getUsersByDepartement(id_departement: number): Promise<UserOutput[]> {
    return await userRepository().find({
      where: { id_departement },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async getUsersByEquipe(id_equipe: number): Promise<UserOutput[]> {
    return await userRepository().find({
      where: { id_equipe },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async getUsersByLieu(id_lieu: number): Promise<UserOutput[]> {
    return await userRepository().find({
      where: { id_lieu },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  public async getUsersByRole(role: Role): Promise<UserOutput[]> {
    return await userRepository().find({
      where: { role },
      relations: ['lieu', 'equipe', 'departement']
    });
  }

  // Authentication
  public async authenticateUser(matricule: string, password: string): Promise<IUser | undefined> {
    const user = await userRepository().findOne({
      where: { matricule, password },
      relations: ['lieu', 'equipe', 'departement']
    });
    return user;
  }

  // Lieu operations
  public async getAllLieux(): Promise<any[]> {
    return await lieuRepository().find();
  }

  public async createLieu(lieu: string): Promise<any> {
    const newLieu = lieuRepository().create({ lieu });
    return await lieuRepository().save(newLieu);
  }

  // Equipe operations
  public async getAllEquipes(): Promise<any[]> {
    return await equipeRepository().find();
  }

  public async createEquipe(equipeData: { equipe: string; deb_heure: string; fin_heure: string; jour_travail: number}): Promise<any> {
    const newEquipe = equipeRepository().create(equipeData);
    return await equipeRepository().save(newEquipe);
  }

  // Departement operations
  public async getAllDepartements(): Promise<any[]> {
    return await departementRepository().find();
  }

  public async createDepartement(departement: string): Promise<any> {
    const newDepartement = departementRepository().create({ departement });
    return await departementRepository().save(newDepartement);
  }
}
import myDataSource from "../app-data-source";
import { User } from "./user.entity";
import { Lieu } from "../lieu/lieu.entity";
import { Equipe } from "../equipe/equipe.entity";
import { Departement } from "../departement/departement.entity";

export const userRepository = () => myDataSource.getRepository(User);
export const lieuRepository = () => myDataSource.getRepository(Lieu);
export const equipeRepository = () => myDataSource.getRepository(Equipe);
export const departementRepository = () => myDataSource.getRepository(Departement);
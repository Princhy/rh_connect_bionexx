import myDataSource from "../app-data-source";
import { Departement } from "./departement.entity";

export const departementRepository = () => myDataSource.getRepository(Departement);
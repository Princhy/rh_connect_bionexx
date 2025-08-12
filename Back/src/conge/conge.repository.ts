import myDataSource from "../app-data-source";
import { Conge } from "./conge.entity";

export const congeRepository = () => myDataSource.getRepository(Conge);
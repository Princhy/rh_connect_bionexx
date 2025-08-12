import myDataSource from "../app-data-source";
import { Pointage } from "./pointage.entity";

export const pointageRepository = () => myDataSource.getRepository(Pointage);
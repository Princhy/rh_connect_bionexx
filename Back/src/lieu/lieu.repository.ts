import  myDataSource  from "../app-data-source";
import { Lieu } from "./lieu.entity";

export const lieuRepository = () => myDataSource.getRepository(Lieu);
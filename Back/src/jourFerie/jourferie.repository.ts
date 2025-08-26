import myDataSource from "../app-data-source";
import { JourFerie } from "./jourferie.entity";

export const jourFerieRepository =()=> myDataSource.getRepository(JourFerie);
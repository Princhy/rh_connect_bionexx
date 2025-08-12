import  myDataSource from ".././app-data-source";
import { Analyse } from "./analyse.entity";

export const analyseRepository = () => myDataSource.getRepository(Analyse);
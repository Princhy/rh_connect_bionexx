import myDataSource from "../app-data-source";
import { Equipe } from "./equipe.entity";

export const equipeRepository = () => myDataSource.getRepository(Equipe);
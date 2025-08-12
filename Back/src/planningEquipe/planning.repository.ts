import myDataSource from "../app-data-source";
import { PlanningEquipe } from "./planning.entity";

export const planningRepository = () => myDataSource.getRepository(PlanningEquipe);
import myDataSource from "../app-data-source";
import { Pointeuse } from "./pointeuse.entity";

export const pointeuseRepository = () => myDataSource.getRepository(Pointeuse);
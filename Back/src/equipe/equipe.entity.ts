import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../user/user.entity";
import { PlanningEquipe } from "../planningEquipe/planning.entity";

@Entity()
export class Equipe {
  @PrimaryGeneratedColumn()
  id_equipe: number;

  @Column()
  equipe: string;

  @OneToMany(() => PlanningEquipe, planning => planning.equipe)
  plannings: PlanningEquipe[];

  @OneToMany(() => User, user => user.equipe)
  users: User[];
}

export interface IEquipe {
    id_equipe: number;
    equipe: string;
}
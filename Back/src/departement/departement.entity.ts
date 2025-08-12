import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Departement {
    @PrimaryGeneratedColumn()
    id_departement: number;

    @Column({ length: 150 })
    departement: string;

    // Relations
    @OneToMany(() => User, user => user.departement)
    users: User[];
}

export interface IDepartement {
    id_departement: number;
    departement: string;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Lieu {
    @PrimaryGeneratedColumn()
    id_lieu: number;

    @Column({ length: 150 })
    lieu: string;

    // Relations
    @OneToMany(() => User, user => user.lieu)
    users: User[];
}

export interface ILieu {
    id_lieu: number;
    lieu: string;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Lieu } from "../lieu/lieu.entity";

@Entity()
export class Pointeuse {
    @PrimaryGeneratedColumn()
    id_pointeuse: number;

    @Column({ length: 50 })
    adresse_ip: string;

    @Column({ length: 20})
    pointeuse: string

    @Column()
    id_lieu: number;

    // Relations
    @ManyToOne(() => Lieu)
    @JoinColumn({ name: "id_lieu" })
    lieu: Lieu;
}
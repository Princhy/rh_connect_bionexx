import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";

export enum TypeConge {
    ANNUEL = "ANNUEL",
    MALADIE = "MALADIE",
    MATERNITE = "MATERNITE",
    PATERNITE = "PATERNITE",
    EXCEPTIONNEL = "EXCEPTIONNEL",
    AUTRE ="AUTRE"
}


@Entity()
export class Conge {
    @PrimaryGeneratedColumn()
    id_conge: number;

    @Column({ length: 20 })
    matricule: string;

    @Column({ length:100
    })
    motif: string

    @Column({
        type: "enum",
        enum: TypeConge
    })
    type: TypeConge;

    @Column({ type: "int" })
    nbr_jours_permis: number;

    @Column({ type: "int"})
    solde_conge: number;

    @Column({ type: "date" })
    date_depart: Date;

    @Column({ type: "date" })
    date_reprise: Date;

    @Column({ length: 20, nullable: true })
    personne_interim?: string;

    // Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: "matricule", referencedColumnName: "matricule" })
    user: User;
}
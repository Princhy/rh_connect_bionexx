import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TypeContrat, Role } from "../enum";
import { Lieu } from "../lieu/lieu.entity";
import { Equipe } from "../equipe/equipe.entity"
import { Departement } from "../departement/departement.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ length: 20 ,unique: true })
    matricule: string;

    @Column({ length: 100 })
    nom: string;

    @Column({ length: 100 , nullable:true})
    prenom: string;

    @Column({ length: 150 })
    email: string;

    @Column({ type: "varchar", length: 20 })
    phone: string;

    @Column({ length: 100 })
    badge: string;

    @Column({ nullable: true })
    empreinte: string;

    @Column({ length: 100 })
    poste: string;

    @Column({
        type: "enum",
        enum: TypeContrat
    })
    type_contrat: TypeContrat;

    @Column({ type: "date" })
    date_embauche: Date;

    @Column({ type: "date", nullable: true })
    date_fin_contrat: Date;

    @Column()
    id_lieu: number;

    @Column()
    id_equipe: number;

    @Column()
    id_departement: number;

    @Column({
        type: "enum",
        enum: Role
    })
    role: Role;

    @Column()
    password: string;

    // Relations
    @ManyToOne(() => Lieu)
    @JoinColumn({ name: "id_lieu" })
    lieu: Lieu;

    @ManyToOne(() => Equipe)
    @JoinColumn({ name: "id_equipe" })
    equipe: Equipe;

    @ManyToOne(() => Departement)
    @JoinColumn({ name: "id_departement" })
    departement: Departement;
}

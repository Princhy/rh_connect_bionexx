import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class JourFerie {
    @PrimaryGeneratedColumn()
    id_jourferie: number;

    @Column({ length: 100 })
    nom: string;

    @Column({ type: "date" })
    date: Date;

    @Column({ default: false })
    recurrent: boolean; // True si c’est un jour férié qui revient chaque année
}

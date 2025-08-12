import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pointeuse } from "../pointeuse/pointeuse.entity";
import { User } from "../user/user.entity";
import { ModePointage, StatutPointage,TypePointage} from "../enum";


@Entity()
export class Pointage {
    @PrimaryGeneratedColumn()
    id_pointage: number;

    @Column({
        type: "enum",
        enum: TypePointage
    })
    type: TypePointage;

    @Column({ type: "bigint", unique: true })
    serialNo: number;


    @Column({ type: "datetime", precision: 3 })
    date: Date;

    @Column({type:"enum",
        enum:ModePointage}
    )
    mode: ModePointage

    @Column({
        type: "enum",
        enum: StatutPointage,
        default: StatutPointage.NORMAL
    })
    statut: StatutPointage;

    @Column()
    id_pointeuse: number;

    @Column({ length: 20 })
    matricule: string; // Référence au matricule de l'utilisateur

    // Relations
    @ManyToOne(() => Pointeuse)
    @JoinColumn({ name: "id_pointeuse" })
    pointeuse: Pointeuse;

    @ManyToOne(() => User)
    @JoinColumn({ name: "matricule", referencedColumnName: "matricule" })
    user: User;
}

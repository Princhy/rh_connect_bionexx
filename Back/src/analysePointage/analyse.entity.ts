import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../user/user.entity";
import { ModePointage } from "../enum";

export enum StatutAnalyse {
  PRESENT = "present",
  RETARD = "retard",
  ABSENT = "absent",
  SORTIE_ANTICIPEE = "sortie_anticipee",
  PRESENT_AVEC_RETARD = "present_avec_retard",
  EN_CONGE = "en_conge",
  EN_REPOS = 'EN_REPOS' 
}

@Entity()
export class Analyse {
  @PrimaryGeneratedColumn()
  id_analyse: number;

  @Column({ length: 20 })
  matricule: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  heure_prevue_arrivee: string;

  @Column({ type: 'time', nullable: true })
  heure_prevue_depart: string;

  @Column({ type: 'time', nullable: true })
  heure_reelle_arrivee: string;

  @Column({ type: 'time', nullable: true })
  heure_reelle_depart: string;

  @Column({ type: 'int', default: 0 })
  retard_minutes: number;

  @Column({ type: 'int', default: 0 })
  sortie_anticipee_minutes: number;

  @Column({
    type: 'enum',
    enum: StatutAnalyse,
    default: StatutAnalyse.ABSENT
  })
  statut_final: StatutAnalyse;

  @Column({ type: 'boolean', default: true })
  travaille_aujourd_hui: boolean;

  @Column({ type: 'boolean', default: false })
  justifie: boolean;

  @Column({ type: 'text', nullable: true })
  commentaire: string;

  @Column({
    type: 'enum',
    enum: ModePointage,
    nullable: true
  })
  mode_pointage: ModePointage;

  @Column({ length: 100, nullable: true })
  lieu_pointage: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date_analyse: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: "matricule", referencedColumnName: "matricule" })
  user: User;
}

export interface IAnalyse {
  id_analyse: number;
  matricule: string;
  date: Date;
  heure_prevue_arrivee?: string;
  heure_prevue_depart?: string;
  heure_reelle_arrivee?: string;
  heure_reelle_depart?: string;
  retard_minutes: number;
  sortie_anticipee_minutes: number;
  statut_final: StatutAnalyse;
  travaille_aujourd_hui: boolean;
  justifie: boolean;
  commentaire?: string;
  mode_pointage?: ModePointage;
  lieu_pointage?: string;
  date_analyse: Date;
   cycle_travail_debut?: Date;
  cycle_travail_fin?: Date;
    est_equipe_nuit?: boolean;
}

export interface AnalyseOutput extends IAnalyse {
  user?: {
    id_user: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    equipe?: {
      id_equipe: number;
      equipe: string;
    };
    departement?: {
      id_departement: number;
      departement: string;
    };
    lieu?: {
      id_lieu: number;
      lieu: string;
    };
  };
}
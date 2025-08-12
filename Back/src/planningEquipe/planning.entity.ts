import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Equipe } from '../equipe/equipe.entity';
import { horaire } from '../enum';

@Entity()
export class PlanningEquipe {
  @PrimaryGeneratedColumn()
  id_planning: number;

  @Column({ type: 'date', nullable: true })
  debut_semaine: Date; // Utilisé pour équipe normale uniquement

  @Column({ type: 'simple-array', nullable: true })
  jours_travail: string[]; // Utilisé pour équipe normale uniquement

  @Column({ type: 'enum', enum: horaire, nullable: true })
  horaire: horaire; // Utilisé pour équipe normale uniquement

  @Column({ type: 'time', nullable: true })
  deb_heure: string; // Utilisé pour équipe normale uniquement

  @Column({ type: 'time', nullable: true })
  fin_heure: string; // Utilisé pour équipe normale uniquement

  // Nouveaux champs pour gestion cyclique
  @Column({ type: 'enum', enum: ['fixe', 'cyclique'], default: 'fixe' })
  type_planning: 'fixe' | 'cyclique';

  @Column({ type: 'date', nullable: true })
  date_debut_cycle: Date; // Date de démarrage du cycle pour équipes A,B,C

  @Column({ type: 'json', nullable: true })
  cycle_pattern: CycleDay[]; // Pattern du cycle pour équipes A,B,C

  @Column()
  id_equipe: number;

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: "id_equipe" })
  equipe: Equipe;
}

export interface CycleDay {
  jour: number; // 1 à 6
  shift: 'jour' | 'nuit' | 'repos';
  deb_heure?: string;
  fin_heure?: string;
}

export interface IPlanningEquipe {
  id_planning: number;
  debut_semaine?: Date;
  jours_travail?: string[];
  horaire?: horaire;
  deb_heure?: string;
  fin_heure?: string;
  type_planning: 'fixe' | 'cyclique';
  date_debut_cycle?: Date;
  cycle_pattern?: CycleDay[];
  id_equipe: number;

  equipe?:any
}
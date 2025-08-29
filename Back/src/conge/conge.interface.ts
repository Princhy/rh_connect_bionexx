import { TypeConge, StatutConge } from "./conge.entity";

export interface IConge {
    id_conge: number;
    matricule: string;
    motif: string;
    type: TypeConge;
    nbr_jours_permis: number;
    solde_conge: number;
    date_depart: Date | string;
    date_reprise: Date | string;
    personne_interim?: string;
    statut?: StatutConge;
    departement_id?: number;
}

export interface CongeOutput {
    id_conge: number;
    matricule: string;
    motif:string;
    type: TypeConge;
    nbr_jours_permis: number;
    solde_conge: number;
    date_depart: Date | string;
    date_reprise: Date | string;
    personne_interim?: string;
    statut?: StatutConge;
    departement_id?: number;
    user?: {
        nom: string;
        prenom: string;
        email: string;
    };
    userInterim?: {
        nom: string;
        prenom: string;
        matricule:string;
    };
}

export interface CongeCreateParams {
    matricule: string;
    motif: string;
    type: TypeConge;
    nbr_jours_permis: number;
    solde_conge: number;
    date_depart: Date | string;
    date_reprise: Date | string;
    personne_interim?: string;
    statut?: StatutConge;
    departement_id?: number;
}

export interface CongeUpdateParams extends Partial<CongeCreateParams> {}
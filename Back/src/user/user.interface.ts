import { TypeContrat, Role } from "../enum";
export interface IUser {
    id_user: number;
    matricule: string;
    nom: string;
    prenom?: string;
    email: string;
    phone: string;
    badge: string;
    empreinte?: string;
    poste: string;
    type_contrat: TypeContrat;
    date_embauche: Date | string;
    date_fin_contrat?: Date | string;
    id_lieu: number;
    id_equipe: number;
    id_departement: number;
    role: Role;
    password?: string;
}

export interface UserOutput{
     id_user: number;
    matricule: string;
    nom: string;
    prenom?: string;
    email: string;
    phone: string;
    badge: string;
    empreinte?: string;
    poste: string;
    type_contrat: TypeContrat;
    date_embauche: Date | string;
    date_fin_contrat?: Date | string;
    id_lieu: number;
    id_equipe: number;
    id_departement: number;
    role: Role;
}

export interface OUser {
    id_user: number;
    matricule: string;
    nom: string;
    prenom?: string;
    email: string;
    role: Role;
}
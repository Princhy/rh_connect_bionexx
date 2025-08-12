import { Role } from "../enum";

export interface IAuthUser {
    id_user: number;
    matricule: string;
    email:string;
    nom: string;
    prenom: string;
    role: Role;
    mdp?: string;
}

export interface IAuthResponse {
    success: boolean;
    user?: Omit<IAuthUser, 'mdp'>;
    message: string;
    token?: string;
}
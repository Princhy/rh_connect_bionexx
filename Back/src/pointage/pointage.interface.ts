import { TypePointage, StatutPointage, ModePointage } from "../enum";

// Interface complète (pour usage interne)
export interface IPointage {
    id_pointage: number;
    type: TypePointage;
    date: Date;
    mode: ModePointage;
    statut: StatutPointage;
    id_pointeuse: number;
    matricule: string;
    serialNo:number;
    // Relations
    pointeuse?: any;
    user?: any;
}

// Interface pour la sortie API (user sans password)
export interface PointageOutput {
    id_pointage: number;
    type: TypePointage;
    date: Date;
    mode: ModePointage;
    statut: StatutPointage;
    id_pointeuse: number;
    matricule: string;
    serialNo:number;
    
    // Relations
    pointeuse?: {
        id_pointeuse: number;
        adresse_ip: string;
        pointeuse?: string;
        id_lieu: number;

        lieu:any;
    };
    user?: {
        id_user: number;
        matricule: string;
        nom: string;
        prenom?: string;
        email: string;
        phone: string;
        badge: string;
        empreinte?: string;
        poste: string;
        type_contrat: string;
        date_embauche: Date | string;
        date_fin_contrat?: Date | string;
        id_lieu: number;
        id_equipe: number;
        id_departement: number;
        role: string;
        // ❌ PAS de password dans PointageOutput
        
        // Relations utilisateur
        lieu?: any;
        equipe?: any;
        departement?: any;
    };
}
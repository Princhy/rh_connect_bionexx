export interface IPointeuse {
    id_pointeuse: number;
    adresse_ip: string;
    pointeuse:string;
    id_lieu: number;
    lieu?: any; // Relation avec Lieu
}
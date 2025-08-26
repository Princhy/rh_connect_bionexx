export interface IJourFerie {
    id_jourferie: number;
    nom: string;
    date: Date | string;
    recurrent: boolean;
}

export interface JourFerieOutput {
    id_jourferie: number;
    nom: string;
    date: Date | string;
    recurrent: boolean;
}

export interface JourFerieCreateParams {
    nom: string;
    date: Date | string;
    recurrent?: boolean;
}

export interface JourFerieUpdateParams extends Partial<JourFerieCreateParams> {}

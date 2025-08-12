export interface IUser{
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
    phone: string;
    badge: string;
    empreinte: string;
    poste: string;
    type_contrat: string;
    date_embauche: string;
    date_fin_contrat: string;
    id_lieu: number;
    id_equipe: number;
    id_departement: number;
    role: string;
  };


  export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}
import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Container,
  MenuItem,
  Autocomplete
} from '@mui/material';
import axiosInstance from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Types pour les données de référence (mêmes que dans ListeEmployes)
type Lieu = { id?: number; id_lieu?: number; nom?: string; lieu?: string };
type Equipe = { id?: number; id_equipe?: number; nom?: string; equipe?: string };
type Departement = { id?: number; id_departement?: number; nom?: string; departement?: string };

export default function CreateEmployeePage() {

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);

  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    badge: '',
    empreinte: '',
    poste: '',
    type_contrat: 'CDI',
    date_embauche: new Date().toISOString().slice(0, 16),
    date_fin_contrat: new Date().toISOString().slice(0, 16) || null,
    id_lieu: 1,
    id_equipe: 1,
    id_departement: 1,
    role: 'Employe',
    password: ''
  });

  const posteOptions = ['Développeur', 'Ouvrier', 'Responsable', 'Analyste', 'Consultant'];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fonctions utilitaires pour obtenir les IDs (mêmes que dans ListeEmployes)
  const getLieuId = (lieu: Lieu) => lieu.id || lieu.id_lieu || 0;
  const getEquipeId = (equipe: Equipe) => equipe.id || equipe.id_equipe || 0;
  const getDepartementId = (departement: Departement) => departement.id || departement.id_departement || 0;

  // Fonctions utilitaires pour obtenir les noms (mêmes que dans ListeEmployes)
  const getLieuName = (lieu: Lieu) => lieu.nom || lieu.lieu || 'Lieu inconnu';
  const getEquipeName = (equipe: Equipe) => equipe.nom || equipe.equipe || 'Équipe inconnue';
  const getDepartementName = (departement: Departement) => departement.nom || departement.departement || 'Département inconnu';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/users', formData);
      toast.success('Employé créé avec succès');
      navigate('/employe'); // Redirige après création
    } catch (error) {
      console.error('Erreur création employé:', error);
      toast.error('Verifiez les données saisies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipesRes, lieuxRes, departementsRes] = await Promise.all([
          axiosInstance.get('/equipes'),
          axiosInstance.get('/lieux'),
          axiosInstance.get('/departements')
        ]);
        setEquipes(equipesRes.data);
        setLieux(lieuxRes.data);
        setDepartements(departementsRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" className='pt-20 '>
      <Box sx={{ textAlign: 'center', padding:0 }}>
        <Typography variant="h5" gutterBottom>
          Créer un nouvel employé ou    
            <Button
              variant="text"
              color='secondary'
              onClick={async () => {
                const loadingToast = toast.loading("Importation en cours...");
                try {
                  const res = await axiosInstance.post("/users/import-api");
                  toast.success(`Import terminé : ${res.data.count} utilisateurs ajoutés`)
                } catch (err) {
                  toast.error("Erreur lors de l'import");
                }finally {
                toast.dismiss(loadingToast);
              }
              }}
              >
              Importer depuis le pointeuse
            </Button>
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit}>
      
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            name="nom"
            label="Nom"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            color='secondary'
          />
          <TextField
            name="prenom"
            label="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            color='secondary'
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            
        <TextField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          color='secondary'
        />
        
        <TextField
          name="phone"
          label="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          color='secondary'
        />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                name="matricule"
                label="Matricule"
                value={formData.matricule}
                onChange={handleChange}
                fullWidth
                margin="normal"
                color='secondary'
            />
            <TextField
                name="badge"
                label="Badge"
                value={formData.badge}
                onChange={handleChange}
                fullWidth
                margin="normal"
                color='secondary'
            />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Autocomplete
            fullWidth
            options={posteOptions}
            value={formData.poste}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, poste: newValue || '' }));
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Poste" 
                fullWidth 
                margin="normal"
                color="secondary"
              />
            )}
            freeSolo
          />

          <TextField
            name="type_contrat"
            label="Type de contrat"
            value={formData.type_contrat}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            color='secondary'
          >
            <MenuItem value="CDI">CDI</MenuItem>
            <MenuItem value="CDD">CDD</MenuItem>
            <MenuItem value="Stage">Stage</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            name="date_embauche"
            label="Date d'embauche"
            type="date"
            value={formData.date_embauche}
            onChange={handleChange}
            fullWidth
            margin="normal"
            color='secondary'
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="date_fin_contrat"
            label="Date fin de contrat"
            type="date"
            value={formData.date_fin_contrat}
            onChange={handleChange}
            fullWidth
            margin="normal"
            color='secondary'
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Champ Lieu */}
          <Autocomplete
            options={lieux}
            getOptionLabel={(option) => getLieuName(option)}
            value={lieux.find(lieu => getLieuId(lieu) === formData.id_lieu) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, id_lieu: newValue ? getLieuId(newValue) : 1 }));
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Lieu" 
                fullWidth 
                margin="normal"
                color="secondary"
              />
            )}
            sx={{ flex: 1 }}
          />

          {/* Champ Équipe */}
          <Autocomplete
            options={equipes}
            getOptionLabel={(option) => getEquipeName(option)}
            value={equipes.find(equipe => getEquipeId(equipe) === formData.id_equipe) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, id_equipe: newValue ? getEquipeId(newValue) : 1 }));
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Équipe" 
                fullWidth 
                margin="normal"
                color="secondary"
              />
            )}
            sx={{ flex: 1 }}
          />

          {/* Champ Département */}
          <Autocomplete
            options={departements}
            getOptionLabel={(option) => getDepartementName(option)}
            value={departements.find(dep => getDepartementId(dep) === formData.id_departement) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, id_departement: newValue ? getDepartementId(newValue) : 1 }));
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Département" 
                fullWidth 
                margin="normal"
                color="secondary"
              />
            )}
            sx={{ flex: 1 }}
          />
        </Box>
        
        <TextField
          name="password"
          label="Mot de passe"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          color='secondary'
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color='secondary'
            disabled={loading}
            size="large"
          >
            {loading ? 'Création...' : 'Créer Employé'}
          </Button>
        </Box>
      </Box>
   
    </Container>
  );
}
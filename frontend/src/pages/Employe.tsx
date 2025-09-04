import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { 
  Container, 
  Typography, 
  LinearProgress,
  Modal, 
  Box, 
  Backdrop, 
  Fade,
  Button,
  TextField,
  Autocomplete,
  DialogActions,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme, alpha } from '@mui/material/styles';
import axiosInstance from '../config/axiosConfig';
import {toast} from 'react-toastify';
import { useAuth } from '../config/authConfig';
// Type basé sur votre structure de données
type Employe = {
  id_user: number;
  matricule: string;
  nom: string;
  prenom?: string;
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

// Types pour les données de référence
type Lieu = { id?: number; id_lieu?: number; nom?: string; lieu?: string };
type Equipe = { id?: number; id_equipe?: number; nom?: string; equipe?: string };
type Departement = { id?: number; id_departement?: number; nom?: string; departement?: string };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: 2,
  '@media (max-width: 600px)': {
    width: '98%',
    top: '40%',
    transform: 'translate(-50%, -40%)',
    maxHeight: '95vh'
  }
};

const deleteStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 2,
  '@media (max-width: 600px)': {
    width: '95%',
    top: '40%',
    transform: 'translate(-50%, -40%)'
  }
};

const ListeEmployes = () => {
  const [data, setData] = useState<Employe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const green = theme.palette.success.main;
  const {hasRole,hasAnyRole,user} = useAuth();

  // États pour les modals
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Données de référence pour les autocompletes
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);

  // Options pour les autocompletes
  const typeContratOptions = ['CDI', 'CDD', 'Stage'];
  const roleOptions = ['Superviseur', 'Employe', 'RH'];
  const posteOptions = ['Développeur', 'Ouvrier', 'Responsable', 'Analyste', 'Consultant'];

  // État pour le formulaire d'édition
  const [editForm, setEditForm] = useState<Partial<Employe>>({});

  const handleOpenDelete = (employee: Employe) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedEmployee(null);
  };

  const handleOpenEdit = (employee: Employe) => {
    setSelectedEmployee(employee);
    // S'assurer que toutes les propriétés sont définies
    setEditForm({
      ...employee,
      matricule: employee.matricule || '',
      nom: employee.nom || '',
      prenom: employee.prenom || '',
      email: employee.email || '',
      phone: employee.phone || '',
      badge: employee.badge || '',
      empreinte: employee.empreinte || '',
      poste: employee.poste || '',
      type_contrat: employee.type_contrat || '',
      date_embauche: employee.date_embauche || '',
      date_fin_contrat: employee.date_fin_contrat || '',
      role: employee.role || '',
      id_lieu: employee.id_lieu || 0,
      id_equipe: employee.id_equipe || 0,
      id_departement: employee.id_departement || 0
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedEmployee(null);
    setEditForm({});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(hasAnyRole(['Admin','RH'])){
        // Récupérer les employés
        const response = await axiosInstance.get('/users');
        setData(response.data);
        }
        if(hasRole('Superviseur')){
          const response = await axiosInstance.get(`/users/departement/${user?.id_departement}`);
          setData(response.data);
        }
        // Récupérer les données de référence pour les autocompletes
        const [lieuxRes, equipesRes, departementsRes] = await Promise.all([
          axiosInstance.get('/lieux'),
          axiosInstance.get('/equipes'),
          axiosInstance.get('/departements')
        ]);

        setLieux(lieuxRes.data);
        setEquipes(equipesRes.data);
        setDepartements(departementsRes.data);
      } catch (err) {
        console.error('Error fetching employee data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour supprimer un employé
  const handleDelete = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/users/${selectedEmployee.id_user}`);
      
      // Mettre à jour la liste locale
      setData(prevData => prevData.filter(emp => emp.id_user !== selectedEmployee.id_user));
      toast.success('Employé supprimé avec success')
      handleCloseDelete();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'employé');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour modifier un employé
  const handleUpdate = async () => {
    if (!selectedEmployee || !editForm) return;

    setIsUpdating(true);
    try {
      // Préparer les données dans le bon format pour l'API
      const formattedData = {
        matricule: editForm.matricule || '',
        nom: editForm.nom || '',
        prenom: editForm.prenom || '',
        email: editForm.email || '',
        phone: editForm.phone || '',
        badge: editForm.badge || '',
        empreinte: editForm.empreinte || '',
        poste: editForm.poste || '',
        type_contrat: editForm.type_contrat || '',
        date_embauche: editForm.date_embauche || '',
        date_fin_contrat: editForm.date_fin_contrat || '',
        id_lieu: editForm.id_lieu || 0,
        id_equipe: editForm.id_equipe || 0,
        id_departement: editForm.id_departement || 0,
        role: editForm.role || ''
      };
       await axiosInstance.patch(`/users/${selectedEmployee.id_user}`, formattedData);
      
      const response = await axiosInstance.get('/users');
    setData(response.data);
      
      toast.success('Employé modifié avec succès');
      handleCloseEdit();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      console.error('Données qui ont causé l\'erreur:', editForm); // Pour debug
    } finally {
      setIsUpdating(false);
    }
  };

  // Formatage des dates pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Fonction pour obtenir le nom du lieu
  const getLieuName = (id: number) => {
    const lieu = lieux.find(l => (l.id || l.id_lieu) === id);
    return lieu ? (lieu.nom || lieu.lieu || id.toString()) : id.toString();
  };

  // Fonction pour obtenir le nom de l'équipe
  const getEquipeName = (id: number) => {
    const equipe = equipes.find(e => (e.id || e.id_equipe) === id);
    return equipe ? (equipe.nom || equipe.equipe || id.toString()) : id.toString();
  };

  // Fonction pour obtenir le nom du département
  const getDepartementName = (id: number) => {
    const departement = departements.find(d => (d.id || d.id_departement) === id);
    return departement ? (departement.nom || departement.departement || id.toString()) : id.toString();
  };

  // Colonnes de la table
  const columns = useMemo<MRT_ColumnDef<Employe>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => handleOpenEdit(row.original)}
                sx={{
                  color: green,
                  bgcolor: alpha(green, 0.14),
                  '&:hover': { 
                    bgcolor: alpha(green, 0.22),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                onClick={() => handleOpenDelete(row.original)}
                sx={{
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.12),
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
      {
        accessorKey: 'matricule',
        header: 'Matricule',
        size: 120,
      },
      {
        accessorKey: 'nom',
        header: 'Nom',
        size: 150,
      },
      {
        accessorKey: 'prenom',
        header: 'Prénom',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        size: 150,
      },
      {
        accessorKey: 'poste',
        header: 'Poste',
        size: 180,
      },
      {
        accessorKey: 'role',
        header: 'Rôle',
        size: 150,
      },
      // Département
{
  accessorKey: 'id_departement',
  header: 'Département',
  size: 150,
  Cell: ({ cell }) => getDepartementName(cell.getValue<number>()),
  filterFn: (row, columnId, filterValue) => {
    const deptId = row.getValue(columnId) as number;
    const deptName = getDepartementName(deptId);
    return deptName.toLowerCase().includes(filterValue.toLowerCase());
  }
},

// Lieu  
{
  accessorKey: 'id_lieu',
  header: 'Lieu',
  size: 150,
  Cell: ({ cell }) => getLieuName(cell.getValue<number>()),
  filterFn: (row, columnId, filterValue) => {
    const lieuId = row.getValue(columnId) as number;
    const lieuName = getLieuName(lieuId);
    return lieuName.toLowerCase().includes(filterValue.toLowerCase());
  }
},

// Équipe
{
  accessorKey: 'id_equipe',
  header: 'Équipe',
  size: 150,
  Cell: ({ cell }) => getEquipeName(cell.getValue<number>()),
  filterFn: (row, columnId, filterValue) => {
    const equipeId = row.getValue(columnId) as number;
    const equipeName = getEquipeName(equipeId);
    return equipeName.toLowerCase().includes(filterValue.toLowerCase());
  }
},
      {
        accessorKey: 'type_contrat',
        header: 'Type de contrat',
        size: 150,
      },
      {
        accessorKey: 'date_embauche',
        header: 'Date embauche',
        size: 150,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'date_fin_contrat',
        header: 'Date fin du contrat',
        size: 150,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      }
    ],
    [lieux, equipes, departements]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
    },
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
  });


  return (
    <Box className="pt-20" sx={{ 
      maxWidth: '100%',
      width: '100%',
      px: 2,
      '@media (min-width: 1200px)': {
        maxWidth: '1620px',
        width: '100%',
        margin: '0 auto',
        px: 3
      },
      '@media (min-width: 1536px)': {
        maxWidth: '1536px',
        width: '100%',
        px: 4
      },
      '@media (min-width: 1920px)': {
        maxWidth: '2000px',
        width: '100%',
        margin: '0 auto',
        px: 6
      }
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 3,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ flex: '1 1 auto', minWidth: '200px' }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem', lg: '2.5rem' }
            }}
          >
            👥 Liste des employés
          </Typography>
        </Box>
        <Box sx={{ flex: '0 0 auto' }}>
          <Button 
            variant='contained' 
            color='success' 
            onClick={()=> navigate('register')}
            sx={{
              whiteSpace: 'nowrap',
              minWidth: { xs: '120px', sm: '140px', md: '160px' }
            }}
          >
            Nouveau Employé
          </Button>
        </Box>
      </Box>
      
      {isLoading ? (
          <LinearProgress color='secondary' />
        ) : (
          <MaterialReactTable table={table} />
        )}


      {/* Modal pour la suppression */}
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDelete}>
          <Box sx={deleteStyle}>
            <Typography variant="h6" component="h2" gutterBottom>
              Confirmer la suppression
            </Typography>
            <Typography sx={{ mt: 2, mb: 3 }}>
              Êtes-vous sûr de vouloir supprimer l'employé{' '}
              <strong>
                {selectedEmployee?.prenom} {selectedEmployee?.nom}
              </strong>{' '}
              ? Cette action est irréversible.
            </Typography>
            <DialogActions>
              <Button 
                onClick={handleCloseDelete} 
                variant="outlined"
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="contained" 
                color="error"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>

      {/* Modal pour l'édition */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEdit}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
              Modifier l'employé
            </Typography>
            
            <Box sx={{ mt: 1 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
                gap: { xs: 2, sm: 2, md: 3 }
              }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Matricule"
                    value={editForm.matricule || ''}
                    onChange={(e) => setEditForm({...editForm, matricule: e.target.value})}
                    size="small"
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Badge"
                    value={editForm.badge || ''}
                    onChange={(e) => setEditForm({...editForm, badge: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={editForm.nom || ''}
                    onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Prénom"
                    value={editForm.prenom || ''}
                    onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / -1' } }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={posteOptions}
                    value={editForm.poste || ''}
                    onChange={(_, newValue) => setEditForm({...editForm, poste: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Poste" size="small" />}
                    freeSolo
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={typeContratOptions}
                    value={editForm.type_contrat || ''}
                    onChange={(_, newValue) => setEditForm({...editForm, type_contrat: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Type de contrat" size="small" />}
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={roleOptions}
                    value={editForm.role || ''}
                    onChange={(_, newValue) => setEditForm({...editForm, role: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Rôle" size="small" />}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Date d'embauche"
                    type="date"
                    value={editForm.date_embauche ? editForm.date_embauche.split('T')[0] : ''}
                    onChange={(e) => setEditForm({...editForm, date_embauche: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Date fin de contrat"
                    type="date"
                    value={editForm.date_fin_contrat ? editForm.date_fin_contrat.split('T')[0] : ''}
                    onChange={(e) => setEditForm({...editForm, date_fin_contrat: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={lieux}
                    getOptionLabel={(option) => option.nom || option.lieu || 'Lieu inconnu'}
                    value={departements.find(d => (d.id || d.id_departement) === editForm.id_departement) || null}
                    onChange={(_, newValue) => setEditForm({...editForm, id_lieu: (newValue?.id || newValue?.id_lieu) || 0})}
                    renderInput={(params) => <TextField {...params} label="Lieu" size="small" />}
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={equipes}
                    getOptionLabel={(option) => option.nom || option.equipe || 'Équipe inconnue'}
                    value={equipes.find(e => (e.id || e.id_equipe) === editForm.id_equipe) || null}
                    onChange={(_, newValue) => setEditForm({...editForm, id_equipe: (newValue?.id || newValue?.id_equipe) || 0})}
                    renderInput={(params) => <TextField {...params} label="Équipe" size="small" />}
                  />
                </Box>

                <Box>
                  <Autocomplete
                    options={departements}
                    getOptionLabel={(option) => option.nom || option.departement || 'Département inconnu'}
                    value={departements.find(d => (d.id || d.id_departement) === editForm.id_departement) || null}
                    onChange={(_, newValue) => setEditForm({...editForm, id_departement: (newValue?.id || newValue?.id_departement) || 0})}
                    renderInput={(params) => <TextField {...params} label="Département" size="small" />}
                  />
                </Box>
              </Box>
            </Box>

            <DialogActions sx={{ mt: 3 }}>
              <Button 
                onClick={handleCloseEdit} 
                variant="outlined"
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleUpdate} 
                variant="contained"
                disabled={isUpdating}
                color='secondary'
              >
                {isUpdating ? 'Modification...' : 'Modifier'}
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ListeEmployes;
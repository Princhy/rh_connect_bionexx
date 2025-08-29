import { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
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
  Alert,
  Chip,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useTheme, alpha } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../config/authConfig';

// Types basés sur votre structure de congé
const TypeConge = {
  ANNUEL : "ANNUEL",
  MALADIE : "MALADIE",
  MATERNITE : "MATERNITE",
  PATERNITE : "PATERNITE",
  EXCEPTIONNEL : "EXCEPTIONNEL",
  AUTRE : "AUTRE"
} as const;

type TypeCongeValue = typeof TypeConge[keyof typeof TypeConge];

// Enum pour le statut de congé
const StatutConge = {
  ATTENTE: "ATTENTE",
  VALIDE: "VALIDE",
  REFUSE: "REFUSE"
} as const;

type StatutCongeValue = typeof StatutConge[keyof typeof StatutConge];

type Conge = {
  id_conge: number;
  matricule: string;
  motif: string;
  type: TypeCongeValue;
  nbr_jours_permis: number;
  solde_conge: number;
  date_depart: string;
  date_reprise: string;
  personne_interim?: string;
  statut: StatutCongeValue;
  // Relations
  user?: {
    id_user: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    role: string;
    id_departement: number;
    departement?: {
      id_departement: number;
      departement: string;
    };
  };
};

type CongeFormData = {
  matricule: string;
  motif: string;
  type: TypeCongeValue;
  solde_conge:number;
  nbr_jours_permis: number;
  date_depart: string;
  date_reprise: string;
  personne_interim?: string;
  statut?: StatutCongeValue;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: 2,
};

const deleteStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Conges = () => {
  const theme = useTheme();
  const green = theme.palette.success.main;
  const { user, hasRole } = useAuth();
  const [data, setData] = useState<Conge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les modals
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedConge, setSelectedConge] = useState<Conge | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Options pour les autocompletes
  const typeOptions = Object.values(TypeConge);
  const [employeeOptions, setEmployeeOptions] = useState<string[]>([]);

  // État pour le formulaire
  const [formData, setFormData] = useState<CongeFormData>({
    matricule: '',
    motif: '',
    type: TypeConge.ANNUEL,
    solde_conge:0,
    nbr_jours_permis: 0,
    date_depart: '',
    date_reprise: '',
    personne_interim: '',
          statut: hasRole('Admin') || hasRole('RH') || hasRole('Superviseur') ? StatutConge.VALIDE : StatutConge.ATTENTE
  });

  const handleOpenDelete = (conge: Conge) => {
    setSelectedConge(conge);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedConge(null);
  };

  const handleOpenEdit = (conge: Conge) => {
    setSelectedConge(conge);
    setFormData({
      matricule: conge.matricule,
      motif: conge.motif,
      type: conge.type,
      solde_conge: 20,
      nbr_jours_permis: conge.nbr_jours_permis,
      date_depart: conge.date_depart.split('T')[0],
      date_reprise: conge.date_reprise.split('T')[0],
      personne_interim: conge.personne_interim || '',
      statut: conge.statut
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedConge(null);
    resetForm();
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      matricule: hasRole('Employe') ? (user?.matricule || '') : '',
      motif: '',
      type: TypeConge.ANNUEL,
      solde_conge:0,
      nbr_jours_permis: 0,
      date_depart: '',
      date_reprise: '',
      personne_interim: '',
      statut: hasRole('Admin') || hasRole('RH') || hasRole('Superviseur') ? StatutConge.VALIDE : StatutConge.ATTENTE
    });
  };

  // Fonctions de permissions simplifiées
  const canCreate = () => {
    return hasRole('Admin') || hasRole('RH') || hasRole('Superviseur') || hasRole('Employe');
  };

  const canEdit = (conge: Conge) => {
    return hasRole('Admin') || hasRole('RH') || hasRole('Superviseur');
  };

  const canDelete = (conge: Conge) => {
    return hasRole('Admin') || hasRole('RH') || hasRole('Superviseur');
  };

  const canValidate = () => {
    return hasRole('Admin') || hasRole('RH') || hasRole('Superviseur');
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut: StatutCongeValue): "success" | "error" | "warning" => {
    switch (statut) {
      case StatutConge.VALIDE: return "success";
      case StatutConge.REFUSE: return "error";
      case StatutConge.ATTENTE: return "warning";
      default: return "warning";
    }
  };

  // Fonction pour obtenir le label du statut
  const getStatutLabel = (statut: StatutCongeValue): string => {
    switch (statut) {
      case StatutConge.VALIDE: return "Validé";
      case StatutConge.REFUSE: return "Refusé";
      case StatutConge.ATTENTE: return "En attente";
      default: return "En attente";
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let url = '/conges';
      
      // Les employés ne voient que leurs propres congés
      if (hasRole('Employe') && user?.matricule) {
        url = `/conges/matricule/${user.matricule}`;
      }
      // Les superviseurs voient les congés de leur département
      else if (hasRole('Superviseur') && user?.id_departement) {
        url = `/conges/departement/${user.id_departement}`;
      }
      // Admin et RH voient tous les congés (url par défaut)
      
      const response = await axiosInstance.get(url);
      setData(response.data);
      console.log(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des données de congé');
      console.error('Error fetching conge data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      let url = '/users';
      
      // Les employés ne peuvent créer des congés que pour eux-mêmes
      if (hasRole('Employe') && user?.matricule) {
        setEmployeeOptions([user.matricule]);
        return;
      }
      // Les superviseurs ne voient que les employés de leur département
      else if (hasRole('Superviseur') && user?.id_departement) {
        url = `/users/departement/${user.id_departement}`;
      }
      // Admin et RH voient tous les employés (url par défaut)
      
      const response = await axiosInstance.get(url);
      const matricules = response.data.map((user: any) => user.matricule);
      setEmployeeOptions(matricules);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Fonction pour supprimer un congé
  const handleDelete = async () => {
    if (!selectedConge) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/conges/${selectedConge.id_conge}`);
      
      setData(prevData => prevData.filter(c => c.id_conge !== selectedConge.id_conge));
      toast.success('Congé supprimé avec succès');
      handleCloseDelete();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du congé');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour créer un congé
  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const response = await axiosInstance.post('/conges', formData);
      
      if (response.data.success) {
        toast.success('Congé créé avec succès');
        fetchData();
        handleCloseCreate();
      } else {
        toast.error(response.data.message || 'Erreur lors de la création');
      }
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la création du congé');
    } finally {
      setIsCreating(false);
    }
  };

  // Fonction pour modifier un congé
  const handleUpdate = async () => {
    if (!selectedConge) return;

    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(`/conges/${selectedConge.id_conge}`, formData);
      
      if (response.data.success) {
        toast.success('Congé modifié avec succès');
        fetchData();
        handleCloseEdit();
      } else {
        toast.error(response.data.message || 'Erreur lors de la modification');
      }
    } catch (err: any) {
      console.error('Erreur lors de la modification:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la modification du congé');
    } finally {
      setIsUpdating(false);
    }
  };

  // Formatage des dates pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Formatage du type de congé avec couleurs
  const formatType = (type: TypeCongeValue) => {
    const typeConfig = {
      [TypeConge.ANNUEL]: { label: 'Congé Annuel', color: '#1976d2', bg: '#e3f2fd' },
      [TypeConge.MALADIE]: { label: 'Maladie', color: '#d32f2f', bg: '#ffebee' },
      [TypeConge.MATERNITE]: { label: 'Maternité', color: '#7b1fa2', bg: '#f3e5f5' },
      [TypeConge.PATERNITE]: { label: 'Paternité', color: '#388e3c', bg: '#e8f5e9' },
      [TypeConge.EXCEPTIONNEL]: { label: 'Exceptionnel', color: '#f57c00', bg: '#fff3e0' },
      [TypeConge.AUTRE]: { label: 'Autre', color: '#616161', bg: '#f5f5f5' }
    } as const;

    const config = typeConfig[type] || typeConfig[TypeConge.AUTRE];
    
    return (
      <Chip 
        label={config.label}
        sx={{ 
          backgroundColor: config.bg, 
          color: config.color,
          fontWeight: 'bold'
        }} 
      />
    );
  };

  // Calcul du nombre de jours
  const calculateDays = (dateDepart: string, dateReprise: string) => {
    const start = new Date(dateDepart);
    const end = new Date(dateReprise);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fonction d'export PDF
  const handleExportRows = (rows: MRT_Row<Conge>[]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport des Congés', 14, 22);
    doc.setFontSize(11);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 30);

    const tableData = rows.map((row) => [
      row.original.matricule,
      `${row.original.user?.prenom || ''} ${row.original.user?.nom || ''}`,
      row.original.type,
      row.original.motif,
      row.original.nbr_jours_permis.toString(),
      formatDate(row.original.date_depart),
      formatDate(row.original.date_reprise),
      row.original.personne_interim || '',
      row.original.solde_conge.toString()
    ]);

    const tableHeaders = [
      'Matricule', 
      'Employé', 
      'Type', 
      'Motif',
      'Jours',
      'Date Départ', 
      'Date Reprise', 
      'Intérim',
      'Solde'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`conges-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Validation des dates
  const validateDates = () => {
    if (formData.date_depart && formData.date_reprise) {
      return new Date(formData.date_depart) < new Date(formData.date_reprise);
    }
    return true;
  };

  // Colonnes de la table
  const columns = useMemo<MRT_ColumnDef<Conge>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canEdit(row.original) && (
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
            )}
            {canDelete(row.original) && (
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
            )}
          </Box>
        )
      },
      {
        accessorKey: 'matricule',
        header: 'Matricule',
        size: 120,
      },
      {
        accessorKey: 'user.nom',
        header: 'Employé',
        size: 200,
        Cell: ({ row }) => `${row.original.user?.prenom || ''} ${row.original.user?.nom || ''}`,
      },
      {
        accessorKey: 'statut',
        header: 'Statut',
        size: 120,
        Cell: ({ cell }) => {
          const statut = cell.getValue<StatutCongeValue>();
          return (
            <Chip
              label={getStatutLabel(statut)}
              color={getStatutColor(statut)}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 150,
        Cell: ({ cell }) => formatType(cell.getValue<TypeCongeValue>()),
      },
      {
        accessorKey: 'motif',
        header: 'Motif',
        size: 200,
      },
      {
        accessorKey: 'nbr_jours_permis',
        header: 'Jours Demandés',
        size: 120,
        Cell: ({ cell }) => `${cell.getValue<number>()} jours`,
      },
      {
        accessorKey: 'date_depart',
        header: 'Date Départ',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'date_reprise',
        header: 'Date Reprise',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'personne_interim',
        header: 'Personne Intérim',
        size: 150,
        Cell: ({ cell }) => cell.getValue<string>() || 'N/A',
      },
      {
        accessorKey: 'solde_conge',
        header: 'Solde',
        size: 100,
        Cell: ({ cell }) => `${cell.getValue<number>()} jours`,
      },
      {
        accessorKey: 'user.poste',
        header: 'Poste',
        size: 150,
      }
    ],
    []
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
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        {canCreate() && (
          <Button
            onClick={handleOpenCreate}
            startIcon={<AddIcon />}
            variant="contained"
            color='success'
          >
            Nouveau Congé
          </Button>
        )}
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
        >
          Export Tout
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
        >
          Export Page
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
        >
          Export Sélection
        </Button>
      </Box>
    ),
  });

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" className='pt-20'>
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ margin: 0 }}>
            Gestion des Congés
          </Typography>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchData}
            startIcon={<RefreshIcon />}
            sx={{ minWidth: 130 }}
          >
            Actualiser
          </Button>
        </Box>

        {/* Indicateur de contexte de filtrage */}
        {data.length > 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography>
              {hasRole('Employe') && (
                <>👤 Affichage de vos congés personnels ({data.length} congé{data.length > 1 ? 's' : ''})</>
              )}
              {hasRole('Superviseur') && (
                <>🏢 Affichage des congés de votre département ({data.length} congé{data.length > 1 ? 's' : ''})</>
              )}
              {(hasRole('Admin') || hasRole('RH')) && (
                <>🏢 Affichage de tous les congés ({data.length} congé{data.length > 1 ? 's' : ''})</>
              )}
            </Typography>
          </Alert>
        )}
      </Container>

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
              Êtes-vous sûr de vouloir supprimer ce congé de{' '}
              <strong>
                {selectedConge?.user?.prenom} {selectedConge?.user?.nom} ({selectedConge?.matricule})
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

      {/* Modal pour la création */}
      <Modal
        open={openCreate}
        onClose={handleCloseCreate}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openCreate}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
              Créer un nouveau congé
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {hasRole('Employe') ? (
                  <TextField
                    fullWidth
                    label="Matricule"
                    value={formData.matricule}
                    disabled
                  />
                ) : (
                  <Autocomplete
                    options={employeeOptions}
                    value={formData.matricule}
                    onChange={(_, newValue) => setFormData({...formData, matricule: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Matricule Employé" required />}
                  />
                )}

                <Autocomplete
                  options={typeOptions}
                  value={formData.type}
                  onChange={(_, newValue) => setFormData({...formData, type: newValue || TypeConge.ANNUEL})}
                  renderInput={(params) => <TextField {...params} label="Type de Congé" required />}
                />

                <TextField
                  fullWidth
                  label="Motif"
                  value={formData.motif}
                  onChange={(e) => setFormData({...formData, motif: e.target.value})}
                  required
                />

                <TextField
                  fullWidth
                  label="Nombre de jours"
                  type="number"
                  value={formData.nbr_jours_permis}
                  onChange={(e) => setFormData({...formData, nbr_jours_permis: parseInt(e.target.value) || 0})}
                  required
                />

                <TextField
                  fullWidth
                  label="Date de départ"
                  type="date"
                  value={formData.date_depart}
                  onChange={(e) => setFormData({...formData, date_depart: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Date de reprise"
                  type="date"
                  value={formData.date_reprise}
                  onChange={(e) => setFormData({...formData, date_reprise: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Personne d'intérim (optionnel)"
                  value={formData.personne_interim}
                  onChange={(e) => setFormData({...formData, personne_interim: e.target.value})}
                />

                {canValidate() && (
                  <Autocomplete
                    options={Object.values(StatutConge)}
                    value={formData.statut || StatutConge.ATTENTE}
                    onChange={(_, newValue) => setFormData({...formData, statut: newValue || StatutConge.ATTENTE})}
                    renderInput={(params) => <TextField {...params} label="Statut du congé" required />}
                    getOptionLabel={(option) => getStatutLabel(option)}
                  />
                )}

                {!validateDates() && (
                  <Alert severity="error">
                    La date de départ doit être antérieure à la date de reprise
                  </Alert>
                )}
              </Box>
            </Box>

            <DialogActions sx={{ mt: 3 }}>
              <Button 
                onClick={handleCloseCreate} 
                variant="outlined"
                disabled={isCreating}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCreate} 
                variant="contained"
                disabled={isCreating || !validateDates() || !formData.matricule || !formData.motif}
                color='success'
              >
                {isCreating ? 'Création...' : 'Créer'}
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
              Modifier le congé
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Matricule"
                  value={formData.matricule}
                  disabled
                />

                <Autocomplete
                  options={typeOptions}
                  value={formData.type}
                  onChange={(_, newValue) => setFormData({...formData, type: newValue || TypeConge.ANNUEL})}
                  renderInput={(params) => <TextField {...params} label="Type de Congé" required />}
                />

                <TextField
                  fullWidth
                  label="Motif"
                  value={formData.motif}
                  onChange={(e) => setFormData({...formData, motif: e.target.value})}
                  required
                />

                <TextField
                  fullWidth
                  label="Nombre de jours"
                  type="number"
                  value={formData.nbr_jours_permis}
                  onChange={(e) => setFormData({...formData, nbr_jours_permis: parseInt(e.target.value) || 0})}
                  required
                />

                <TextField
                  fullWidth
                  label="Date de départ"
                  type="date"
                  value={formData.date_depart}
                  onChange={(e) => setFormData({...formData, date_depart: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Date de reprise"
                  type="date"
                  value={formData.date_reprise}
                  onChange={(e) => setFormData({...formData, date_reprise: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <TextField
                  fullWidth
                  label="Personne d'intérim"
                  value={formData.personne_interim}
                  onChange={(e) => setFormData({...formData, personne_interim: e.target.value})}
                />

                {canValidate() && (
                  <Autocomplete
                    options={Object.values(StatutConge)}
                    value={formData.statut || StatutConge.ATTENTE}
                    onChange={(_, newValue) => setFormData({...formData, statut: newValue || StatutConge.ATTENTE})}
                    renderInput={(params) => <TextField {...params} label="Statut du congé" required />}
                    getOptionLabel={(option) => getStatutLabel(option)}
                  />
                )}

                {!validateDates() && (
                  <Alert severity="error">
                    La date de départ doit être antérieure à la date de reprise
                  </Alert>
                )}
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
                disabled={isUpdating || !validateDates() || !formData.motif}
                color='secondary'
              >
                {isUpdating ? 'Modification...' : 'Modifier'}
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Conges;
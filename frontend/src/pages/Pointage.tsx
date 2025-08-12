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
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

// Type basé sur votre structure de pointage
type Pointage = {
  id_pointage: number;
  matricule: string;
  type: string;
  date: string;
  mode: string;
  statut: string;
  id_pointeuse: number;
  serialNo: number;
  // Relations
  user?: {
    id_user: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    role: string;
  };
  pointeuse?: {
    id_pointeuse: number;
    nom: string;
    lieu:{
      lieu:string;
    }
  };
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
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

const Pointage = () => {
  const [data, setData] = useState<Pointage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // États pour les modals
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState<Pointage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Options pour les autocompletes
  const typeOptions = ['entree', 'sortie'];
  const statutOptions = ['normal', 'retard','avance'];

  // État pour le formulaire d'édition
  const [editForm, setEditForm] = useState<Partial<Pointage>>({});

  const handleOpenDelete = (pointage: Pointage) => {
    setSelectedPointage(pointage);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedPointage(null);
  };

  const handleOpenEdit = (pointage: Pointage) => {
    setSelectedPointage(pointage);
    setEditForm({
      ...pointage,
      type: pointage.type || '',
      date: pointage.date || '',
      mode: pointage.mode || '',
      statut: pointage.statut || '',
      id_pointeuse: pointage.id_pointeuse || 1,
      serialNo: pointage.serialNo || 0
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedPointage(null);
    setEditForm({});
  };

  // États à ajouter dans votre composant
const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
const [importLoading, setImportLoading] = useState(false);




  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/pointages');
      setData(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des données de pointage');
      console.error('Error fetching pointage data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un pointage
  const handleDelete = async () => {
    if (!selectedPointage) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/pointages/${selectedPointage.id_pointage}`);
      
      // Mettre à jour la liste locale
      setData(prevData => prevData.filter(pt => pt.id_pointage !== selectedPointage.id_pointage));
      toast.success('Pointage supprimé avec succès');
      handleCloseDelete();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du pointage');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour modifier un pointage
  const handleUpdate = async () => {
    if (!selectedPointage || !editForm) return;

    setIsUpdating(true);
    try {
      const formattedData = {
        matricule: selectedPointage.matricule,
        type: editForm.type || '',
        date: editForm.date || '',
        mode: 'manuel',
        statut: editForm.statut || '',
        id_pointeuse: selectedPointage.id_pointeuse || 1,
        serialNo: selectedPointage.serialNo|| 0
      };

      await axiosInstance.put(`/pointages/${selectedPointage.id_pointage}`, formattedData);
      
      // Recharger les données
      const response = await axiosInstance.get('/pointages');
      setData(response.data);
      
      toast.success('Pointage modifié manuel avec succès');
      handleCloseEdit();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      toast.error('Erreur lors de la modification du pointage');
    } finally {
      setIsUpdating(false);
    }
  };

//Fonction pour importer mise a jour via pointeuse
const importPointage = async () => {
  const loadingToast = toast.loading("Importation en cours...");
  
  try {
    const res = await axiosInstance.post("/pointages/import-pointages-api");
    toast.dismiss(loadingToast); // On ferme le loading
    toast.success(`Import terminé : ${res.data.count} pointage(s) ajoutés`);
    fetchData();
  } catch (err) {
    toast.dismiss(loadingToast); // On ferme aussi en cas d'erreur
    toast.error("Erreur lors de l'importation des pointages");
  }
};
// Fonction pour l'import par date spécifique
const handleImportPointagesByDate = async () => {
  if (!importDate) {
    toast.error('Veuillez sélectionner une date');
    return;
  }

  setImportLoading(true);
  try {
   const toastLoading = toast.loading('importation en cours ...')
    const response = await axiosInstance.post('/pointages/import-pointages-api-date', {
      date: importDate
    });

    if (response.data.success) {
      toast.success(
        `Import réussi! ${response.data.count} pointages importés sur ${response.data.totalPointages} trouvés`
      );
      fetchData();
      toast.dismiss(toastLoading)
      // Afficher les erreurs s'il y en a
      if (response.data.errors && response.data.errors.length > 0) {
        console.warn('Erreurs lors de l\'import:', response.data.errors);
        toast.warning(`${response.data.errors.length} erreurs détectées (voir console)`);
      }
    } else {
      toast.error('Échec de l\'import');
      toast.dismiss(toastLoading)
      if (response.data.errors) {
        console.error('Erreurs:', response.data.errors);
      }
    }
  } catch (error: any) {
    console.error('Erreur import pointages:', error);
    toast.error(
      error.response?.data?.message || 'Erreur lors de l\'import des pointages'
    );
  } finally {
    toast.dismiss()
    setImportLoading(false);
  }
};



  // Formatage des dates pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  // Formatage du type de pointage
  const formatType = (type: string) => {
    return type === 'entree' ? '🟢 Entrée' : '🔴 Sortie';
  };

  // Formatage du statut
  const formatStatut = (statut: string) => {
  switch (statut.toLowerCase()) {
    case 'normal':
      return (
        <Chip 
          label="✅ Normal" 
          sx={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32',
            fontWeight: 'bold'
          }} 
        />
      );
    case 'retard':
      return (
        <Chip 
          label="⚠️ Retard" 
          sx={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828',
            fontWeight: 'bold'
          }} 
        />
      );
    case 'avance':
      return (
        <Chip 
          label="⏭️ Avance" 
          sx={{ 
            backgroundColor: '#e3f2fd', 
            color: '#1565c0',
            fontWeight: 'bold'
          }} 
        />
      );
    default:
      return (
        <Chip 
          label={statut} 
          sx={{ 
            backgroundColor: '#f5f5f5', 
            color: '#616161',
            fontWeight: 'bold'
          }} 
        />
      );
  }
};

  // Fonction d'export PDF
  const handleExportRows = (rows: MRT_Row<Pointage>[]) => {
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(18);
    doc.text('Rapport de Pointages', 14, 22);
    doc.setFontSize(11);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 30);

    const tableData = rows.map((row) => [
      row.original.matricule,
      `${row.original.user?.prenom || ''} ${row.original.user?.nom || ''}`,
      row.original.type === 'entree' ? 'Entrée' : 'Sortie',
      formatDate(row.original.date),
      row.original.mode,
      row.original.statut,
      row.original.id_pointeuse.toString(),
      row.original.pointeuse?.lieu.lieu || '' //hovaina lieu pointeuse
    ]);

    const tableHeaders = [
      'Matricule', 
      'Employé', 
      'Type', 
      'Date/Heure', 
      'Mode', 
      'Statut', 
      'Pointeuse',
      'Lieu'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`pointages-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Colonnes de la table
  const columns = useMemo<MRT_ColumnDef<Pointage>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              className='mx-1' 
              onClick={() => handleOpenEdit(row.original)}
            >
              <EditIcon sx={{ color: 'green' }} />
            </button>
            <button 
              className='mx-1' 
              onClick={() => handleOpenDelete(row.original)}
            >
              <DeleteIcon sx={{ color: 'red' }} />
            </button>
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
        accessorKey: 'type',
        header: 'Type',
        size: 120,
        Cell: ({ cell }) => formatType(cell.getValue<string>()),
      },
      {
        accessorKey: 'date',
        header: 'Date/Heure',
        size: 180,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'mode',
        header: 'Mode',
  size: 120,
  Cell: ({ cell }) => {
    const mode = cell.getValue<string>();
    let label = "";
    let styles = {};

    switch (mode) {
      case "bio":
        label = "Empreinte";
        styles = {
          borderColor: "#4CAF50", // vert
          color: "#4CAF50",
          backgroundColor: "#E8F5E9",
        };
        break;

      case "manuel":
        label = "Manuel";
        styles = {
          borderColor: "#f4f436ff", // rouge
          color: "#fac812ff",
          backgroundColor: "#ffebee",
        };
        break;

      default:
        label = mode;
    }

    return (
      <Chip
        label={`${label}`}
        sx={{
          fontWeight: "bold",
          ...styles,
         }}
        />
       );
     },
    },
      {
        accessorKey: 'statut',
        header: 'Statut',
        size: 120,
        Cell: ({ cell }) => formatStatut(cell.getValue<string>()),
      },
      {
        accessorKey: 'user.poste',
        header: 'Poste',
        size: 150,
      },
      {
        accessorKey: 'id_pointeuse',
        header: 'Pointeuse',
        size: 120,
        Cell: ({ cell }) => `Pointeuse ${cell.getValue<number>()}`,
      },
      {
        accessorKey: 'pointeuse.lieu.lieu',
        header: 'Lieu',
        size: 100,
        Cell: ({ cell }) => cell.getValue<string>() || 'N/A',
      },
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
  {/* Header avec titre et boutons alignés */}
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
      Gestion des Pointages
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        label="Date d'import"
        type="date"
        value={importDate}
        onChange={(e) => setImportDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        size="small"
        sx={{ minWidth: 180 }}
      />
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleImportPointagesByDate}
        disabled={importLoading}
        startIcon={importLoading ? <RefreshIcon className="animate-spin" /> : <RefreshIcon />}
        sx={{ minWidth: 130 }}
      >
        {importLoading ? 'Import...' : 'Importer'}
      </Button>
      
      <Button
        variant="contained"
        color="secondary"
        onClick={importPointage}
        startIcon={<RefreshIcon />}
        sx={{ minWidth: 130 }}
      >
        Actualiser
      </Button>
    </Box>
  </Box>
</Container>

        {isLoading ? (
          <LinearProgress color='secondary' />
        ) : (
          <MaterialReactTable table={table} />
        )}

          {/* date specifique*/}
          

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
                Êtes-vous sûr de vouloir supprimer ce pointage{' '}
                <strong>
                  {selectedPointage?.matricule} - {formatDate(selectedPointage?.date || '')}
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
                Modifier le pointage
              </Typography>
              
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Autocomplete
                    options={typeOptions}
                    value={editForm.type || ''}
                    onChange={(_, newValue) => setEditForm({...editForm, type: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Type" />}
                  />

                  <TextField
                    fullWidth
                    label="Date/Heure"
                    type="datetime-local"
                    value={editForm.date ? new Date(editForm.date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Autocomplete
                    options={statutOptions}
                    value={editForm.statut || ''}
                    onChange={(_, newValue) => setEditForm({...editForm, statut: newValue || ''})}
                    renderInput={(params) => <TextField {...params} label="Statut" />}
                  />

                  <TextField
                    fullWidth
                    label="ID Pointeuse"
                    type="number"
                    value={editForm.id_pointeuse || ''}
                    onChange={(e) => setEditForm({...editForm, id_pointeuse: parseInt(e.target.value) || 1})}
                  />
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
      </Container>
  );
};

export default Pointage;
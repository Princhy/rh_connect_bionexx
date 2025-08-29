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
  DialogActions,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  alpha,
  darken,
  Skeleton
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  ExitToApp as ExitIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  AccessTime as AccessTimeIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Fingerprint as FingerprintIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  FileDownload as FileDownloadIcon,
  Hotel as HotelIcon 
} from '@mui/icons-material';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types basés sur backend
const StatutAnalyse = {
  PRESENT: "present",
  RETARD: "retard", 
  ABSENT: "absent",
  SORTIE_ANTICIPEE: "sortie_anticipee",
  PRESENT_AVEC_RETARD: "present_avec_retard",
  EN_CONGE: "en_conge",
  EN_REPOS: "EN_REPOS"
} as const;

type StatutAnalyse = typeof StatutAnalyse[keyof typeof StatutAnalyse];

interface AnalyseOutput {
  id_analyse: number;
  matricule: string;
  date: Date;
  heure_prevue_arrivee?: string;
  heure_prevue_depart?: string;
  heure_reelle_arrivee?: string;
  heure_reelle_depart?: string;
  retard_minutes: number;
  sortie_anticipee_minutes: number;
  statut_final: StatutAnalyse;
  travaille_aujourd_hui: boolean;
  justifie: boolean;
  commentaire?: string;
  mode_pointage: string;
  lieu_pointage: string;
  lieu_travail?: string;
  date_analyse: Date;
  user?: {
    id_user: number;
    matricule: string;
    nom: string;
    prenom: string;
    poste: string;
    equipe?: {
      id_equipe: number;
      equipe: string;
    };
    departement?: {
      id_departement: number;
      departement: string;
    };
    lieu?: {
      id_lieu: number;
      lieu: string;
    };
  };
}

interface DashboardStats {
  total_employes: number;
  presents: number;
  absents: number;
  retards: number;
  sorties_anticipees: number;
  presents_avec_retard: number;
  en_conge:number;
  en_repos: number;
  taux_presence: number;
  retard_moyen_minutes: number;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Analyse = () => {
  
  // États principaux
  const [analyses, setAnalyses] = useState<AnalyseOutput[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<AnalyseOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedLieuTravail, setSelectedLieuTravail] = useState<string>('all');
  
  // États pour les statistiques et dashboard
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // États pour les modals
  const [openJustification, setOpenJustification] = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState<AnalyseOutput | null>(null);
  const [justificationForm, setJustificationForm] = useState({
    justifie: false,
    commentaire: '',
    statut_final: StatutAnalyse.PRESENT as StatutAnalyse,
    mode_pointage: ''
  });

  // Obtenir la liste unique des lieux de travail
  const getLieuxTravail = (analysesData: AnalyseOutput[]): string[] => {
    const lieux = analysesData
      .map(analyse => analyse.lieu_travail)
      .filter((lieu): lieu is string => lieu !== undefined && lieu !== null && lieu !== '');
    return [...new Set(lieux)].sort();
  };

  // Appliquer le filtre par lieu de travail
  const applyLieuTravailFilter = (analysesData: AnalyseOutput[], lieuFilter: string) => {
    if (lieuFilter === 'all') {
      return analysesData;
    }
    return analysesData.filter(analyse => analyse.lieu_travail === lieuFilter);
  };

  // Charger les analyses pour la date sélectionnée
  const loadAnalyses = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/analyses/date/"${date}"`);
      setAnalyses(response.data);
      //console.log(response)
      
      // Appliquer le filtre par lieu de travail
      const filteredData = applyLieuTravailFilter(response.data, selectedLieuTravail);
      setFilteredAnalyses(filteredData);
      
      // Calculer les statistiques si des analyses existent
      if (response.data.length > 0) {
        // Appliquer le filtre par lieu de travail pour les statistiques
        const filteredData = applyLieuTravailFilter(response.data, selectedLieuTravail);
        calculateStats(filteredData);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
      toast.error('Erreur lors du chargement des analyses');
      setAnalyses([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (analysesData: AnalyseOutput[]) => {
    const total = analysesData.length;
    const presents = analysesData.filter(a => a.statut_final === StatutAnalyse.PRESENT).length;
    const absents = analysesData.filter(a => a.statut_final === StatutAnalyse.ABSENT).length;
    const retards = analysesData.filter(a => a.statut_final === StatutAnalyse.RETARD).length;
    const sortiesAnticipees = analysesData.filter(a => a.statut_final === StatutAnalyse.SORTIE_ANTICIPEE).length;
    const presentsAvecRetard = analysesData.filter(a => a.statut_final === StatutAnalyse.PRESENT_AVEC_RETARD).length;
    const en_conge = analysesData.filter(a => a.statut_final === StatutAnalyse.EN_CONGE).length;
    const EN_REPOS =analysesData.filter(a=> a.statut_final === StatutAnalyse.EN_REPOS).length;
    const totalRetardMinutes = analysesData.reduce((sum, a) => sum + a.retard_minutes, 0);
    const employesAvecRetard = retards + presentsAvecRetard;
    const retardMoyen = employesAvecRetard > 0 ? Math.round(totalRetardMinutes / employesAvecRetard) : 0;

    setStats({
      total_employes: total,
      presents,
      absents,
      retards,
      sorties_anticipees: sortiesAnticipees,
      en_conge,
      en_repos:EN_REPOS,
      presents_avec_retard: presentsAvecRetard,
      taux_presence: total > 0 ? Math.round(((presents + retards + sortiesAnticipees + presentsAvecRetard ) / (total -EN_REPOS- en_conge)) * 100) : 0,
      retard_moyen_minutes: retardMoyen
    });
  };

  // Analyser une journée
  const analyserJournee = async (date: string) => {
    setIsAnalyzing(true);
    const loadingToast = toast.loading("Analyse en cours...");
    try {
      const response = await axiosInstance.post('/analyses/analyser-journee', { date });
      
      if (response.data.success) {
        toast.dismiss(loadingToast)
        toast.success(response.data.message);
        await loadAnalyses(date);
      } else {
        toast.dismiss(loadingToast)
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse de la journée');
    } finally {
      setIsAnalyzing(false);
      toast.dismiss(loadingToast)
    }
  };

  // Gérer la justification
  const handleOpenJustification = (analyse: AnalyseOutput) => {
    setSelectedAnalyse(analyse);
    setJustificationForm({
      justifie: analyse.justifie,
      commentaire: analyse.commentaire || '',
       statut_final: analyse.statut_final,
      mode_pointage: analyse.mode_pointage || 'bio'
    });
    setOpenJustification(true);
  };

  const handleSaveJustification = async () => {
    if (!selectedAnalyse) return;
    
    try {
      const payload = {
      statut_final: justificationForm.statut_final,
      commentaire: justificationForm.commentaire,
      mode_pointage: 'manuel',
      justifie: true
    };

      const response = await axiosInstance.put(`/analyses/${selectedAnalyse.id_analyse}`, payload);
      
      if (response.data.success) {
        toast.success(response.data.message);
        await loadAnalyses(selectedDate);
        setOpenJustification(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la justification:', error);
      toast.error('Erreur lors de la justification');
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatutColor = (statut: StatutAnalyse): "success" | "error" | "warning" | "info" | "default" | "primary" => {
    switch (statut) {
      case StatutAnalyse.PRESENT: return "success";
      case StatutAnalyse.ABSENT: return "error";
      case StatutAnalyse.RETARD: return "warning";
      case StatutAnalyse.SORTIE_ANTICIPEE: return "info";
      case StatutAnalyse.PRESENT_AVEC_RETARD: return "warning";
      case StatutAnalyse.EN_CONGE: return "primary";
      default: return "default";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatutIcon = (statut: StatutAnalyse): React.ReactElement => {
    switch (statut) {
      case StatutAnalyse.PRESENT: return <CheckIcon />;
      case StatutAnalyse.ABSENT: return <CancelIcon />;
      case StatutAnalyse.RETARD: return <ScheduleIcon />;
      case StatutAnalyse.SORTIE_ANTICIPEE: return <ExitIcon />;
      case StatutAnalyse.PRESENT_AVEC_RETARD: return <ScheduleIcon />;
      case StatutAnalyse.EN_CONGE: return <EventBusyIcon />;
      case StatutAnalyse.EN_REPOS: return <HotelIcon/>
      default: return <PersonIcon />;
    }
  };

  // Formatage du mode de pointage
  const formatModePointage = (mode: string) => {
    const modeConfig = {
      'bio': { label: 'Empreinte', color: 'success', icon: <FingerprintIcon /> },
      'manuel': { label: 'Manuel', color: 'warning', icon: <EditIcon /> },
      'badge': { label: 'Badge', color: 'info', icon: <PersonIcon /> }
    } as const;

    const config = modeConfig[mode as keyof typeof modeConfig] || { 
      label: mode, 
      color: 'default' as const, 
      icon: <PersonIcon /> 
    };

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };
  // Formatage du statut avec icône
  const formatStatut = (statut: StatutAnalyse) => {
    const statutLabels = {
      [StatutAnalyse.PRESENT]: 'Présent',
      [StatutAnalyse.ABSENT]: 'Absent',
      [StatutAnalyse.RETARD]: 'Retard',
      [StatutAnalyse.SORTIE_ANTICIPEE]: 'Sortie Anticipée',
      [StatutAnalyse.PRESENT_AVEC_RETARD]: 'Présent avec Retard',
      [StatutAnalyse.EN_CONGE]:'Congé',
      [StatutAnalyse.EN_REPOS]:'En repos'
    };

    return (
      <Chip
        icon={getStatutIcon(statut)}
        label={statutLabels[statut]}
        color={getStatutColor(statut)}
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  // Fonction d'export PDF pour les données filtrées
  const handleExportFilteredData = (data: AnalyseOutput[]) => {
    const doc = new jsPDF('landscape'); // Mode paysage pour plus d'espace
    
    // Titre du document
    doc.setFontSize(18);
    doc.text('Rapport d\'Analyse des Présences', 14, 22);
    doc.setFontSize(11);
    doc.text(`Date analysée: ${new Date(selectedDate).toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 36);
    if (selectedLieuTravail !== 'all') {
      doc.text(`Lieu de travail filtré: ${selectedLieuTravail}`, 14, 42);
      doc.text(`Données filtrées: ${filteredAnalyses.length} employés sur ${analyses.length} total`, 14, 48);
    }

    const tableData = data.map((row) => [
      row.matricule,
      `${row.user?.prenom || ''} ${row.user?.nom || ''}`,
      row.user?.equipe?.equipe || 'N/A',
      row.statut_final.replace('_', ' ').toUpperCase(),
      row.heure_prevue_arrivee || '-',
      row.heure_reelle_arrivee || '-',
      row.retard_minutes > 0 ? `${row.retard_minutes} min` : '-',
      row.heure_prevue_depart || '-',
      row.heure_reelle_depart || '-',
      row.sortie_anticipee_minutes > 0 ? `${row.sortie_anticipee_minutes} min` : '-',
      row.justifie ? 'Oui' : 'Non',
      row.mode_pointage || '-',
      row.lieu_pointage || '-',
      row.lieu_travail || '-',
      row.commentaire || '-'
    ]);

    const tableHeaders = [
      'Matricule', 
      'Employé', 
      'Équipe',
      'Statut', 
      'Arr. Prévue',
      'Arr. Réelle',
      'Retard',
      'Dép. Prévu',
      'Dép. Réel',
      'Sortie Ant.',
      'Justifié',
      'Mode',
      'Lieu Pointage',
      'Lieu Travail',
      'Commentaire'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: selectedLieuTravail !== 'all' ? 54 : 42,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [71, 85, 105] },
      columnStyles: {
        14: { cellWidth: 25 } // Commentaire plus large
      },
      margin: { left: 10, right: 10 }
    });

    doc.save(`analyse-presences-${selectedDate}.pdf`);
  };

  // Fonction d'export PDF pour les lignes du tableau
  const handleExportRows = (rows: MRT_Row<AnalyseOutput>[]) => {
    const data = rows.map(row => row.original);
    handleExportFilteredData(data);
  };
  // Composant Skeleton pour les statistiques
  const StatsSkeleton = () => (
    <Box sx={{ mb: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Box key={index} sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
              <Card sx={{ height: 120 }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Skeleton variant="circular" width={28} height={28} sx={{ mb: 1, mx: 'auto' }} />
                  <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1, mx: 'auto' }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  // Formatage des heures
  const formatHeure = (heure?: string) => {
    if (!heure) return <Typography variant="body2" color="text.secondary">-</Typography>;
    return (
      <Chip 
        label={heure}
        size="small" 
        variant="outlined"
        sx={{ fontFamily: 'monospace' }}
      />
    );
  };

  // Colonnes de la table
  const columns = useMemo<MRT_ColumnDef<AnalyseOutput>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        size: 80,
        Cell: ({ row }) => (
          <IconButton 
            onClick={() => handleOpenJustification(row.original)}
            color={row.original.justifie ? "success" : "primary"}
            size="small"
          >
            <AssignmentIcon />
          </IconButton>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'matricule',
        header: 'Matricule',
        size: 100,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue<string>()}
            variant="filled"
            size="small"
          />
        ),
      },
      {
        accessorKey: 'user.nom',
        header: 'Nom',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight="bold">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'user.prenom', 
        header: 'Prénom',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'user.equipe.equipe',
        header: 'Équipe',
        size: 120,
        Cell: ({ cell }) => {
          const equipe = cell.getValue<string>();
          return equipe ? (
            <Chip 
              label={equipe}
              color="secondary"
              size="small"
              variant="outlined"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">N/A</Typography>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const equipeName = row.original.user?.equipe?.equipe || 'N/A';
          return equipeName.toLowerCase().includes(filterValue.toLowerCase());
        }
      },
      {
        accessorKey: 'statut_final',
        header: 'Statut',
        size: 180,
        Cell: ({ cell }) => formatStatut(cell.getValue<StatutAnalyse>()),
        filterVariant: 'select',
        filterSelectOptions: Object.values(StatutAnalyse).map(statut => ({
          value: statut,
          label: statut.replace('_', ' ').toUpperCase()
        }))
      },
      {
        accessorKey: 'heure_prevue_arrivee',
        header: 'Arrivée Prévue',
        size: 120,
        Cell: ({ cell }) => formatHeure(cell.getValue<string>()),
      },
      {
        accessorKey: 'heure_reelle_arrivee',
        header: 'Arrivée Réelle',
        size: 120,
        Cell: ({ cell }) => formatHeure(cell.getValue<string>()),
      },
      {
        accessorKey: 'retard_minutes',
        header: 'Retard',
        size: 100,
        Cell: ({ cell }) => {
          const retard = cell.getValue<number>();
          if (retard > 0) {
            return (
              <Chip 
                icon={<WarningIcon />}
                label={`${retard} min`} 
                color="warning" 
                size="small" 
                sx={{ fontWeight: 'bold' }}
              />
            );
          }
          return <Typography variant="body2" color="text.secondary">-</Typography>;
        }
      },
      {
        accessorKey: 'heure_prevue_depart',
        header: 'Départ Prévu',
        size: 120,
        Cell: ({ cell }) => formatHeure(cell.getValue<string>()),
      },
      {
        accessorKey: 'heure_reelle_depart',
        header: 'Départ Réel',
        size: 120,
        Cell: ({ cell }) => formatHeure(cell.getValue<string>()),
      },
      {
        accessorKey: 'sortie_anticipee_minutes',
        header: 'Sortie Anticipée',
        size: 140,
        Cell: ({ cell }) => {
          const sortie = cell.getValue<number>();
          if (sortie > 0) {
            return (
              <Chip 
                icon={<InfoIcon />}
                label={`${sortie} min`} 
                color="info" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            );
          }
          return <Typography variant="body2" color="text.secondary">-</Typography>;
        }
      },
      {
        accessorKey: 'justifie',
        header: 'Justifié',
        size: 100,
        Cell: ({ cell }) => {
          const justifie = cell.getValue<boolean>();
          return (
            <Chip
              icon={justifie ? <CheckIcon /> : <CancelIcon />}
              label={justifie ? 'Oui' : 'Non'}
              color={justifie ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          );
        },
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: 'Justifié' },
          { value: 'false', label: 'Non justifié' }
        ]
      },
      {
  accessorKey: 'commentaire',
  header: 'Commentaire',
  size: 200,
  Cell: ({ cell }) => {
    const commentaire = cell.getValue<string>();
    return commentaire ? (
      <Typography variant="body2" sx={{ 
        maxWidth: 180, 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {commentaire}
      </Typography>
    ) : (
      <Typography variant="body2" color="text.secondary">-</Typography>
    );
  }
},
{
  accessorKey: 'user.poste',
  header: 'Poste',
  size: 150,
  Cell: ({ cell }) => {
    const poste = cell.getValue<string>();
    return poste ? (
      <Chip 
        label={poste}
        color="default"
        size="small"
        variant="outlined"
      />
    ) : (
      <Typography variant="body2" color="text.secondary">N/A</Typography>
    );
  },
},
      {
        accessorKey: 'mode_pointage',
        header: 'Mode Pointage',
        size: 130,
        Cell: ({ cell }) => formatModePointage(cell.getValue<string>()),
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'bio', label: 'Empreinte' },
          { value: 'manuel', label: 'Manuel' },
          { value: 'badge', label: 'Badge' }
        ]
      },
      {
        accessorKey: 'lieu_pointage',
        header: 'Lieu Pointage',
        size: 140,
        Cell: ({ cell }) => {
          const lieu = cell.getValue<string>();
          return lieu ? (
            <Chip 
              icon={<LocationIcon />}
              label={lieu}
              color="secondary"
              size="small"
              variant="outlined"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">N/A</Typography>
          );
        },
      },
      {
        accessorKey: 'lieu_travail',
        header: 'Lieu de Travail',
        size: 140,
        Cell: ({ cell }) => {
          const lieuTravail = cell.getValue<string>();
          return lieuTravail ? (
            <Chip 
              icon={<LocationIcon />}
              label={lieuTravail}
              color="primary"
              size="small"
              variant="outlined"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">N/A</Typography>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredAnalyses,
    state: {
      isLoading,
    },
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 25, pageIndex: 0 },
      sorting: [{ id: 'matricule', desc: false }]
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Button
          disabled={filteredAnalyses.length === 0}
          onClick={() => handleExportFilteredData(filteredAnalyses)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
          size="small"
        >
          Export Filtre
        </Button>
        <Button
          disabled={analyses.length === 0}
          onClick={() => handleExportFilteredData(analyses)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
          size="small"
        >
          Export Tout
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
          size="small"
        >
          Export Page
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color='info'
          size="small"
        >
          Export Sélection
        </Button>
      </Box>
    ),
  });

  // Effect pour charger les données au montage et changement de date
  useEffect(() => {
    loadAnalyses(selectedDate);
  }, [selectedDate]);

  // Effect pour appliquer le filtre quand il change
  useEffect(() => {
    if (analyses.length > 0) {
      setIsFiltering(true);
      
      // Délai court pour montrer le skeleton
      setTimeout(() => {
        const filteredData = applyLieuTravailFilter(analyses, selectedLieuTravail);
        setFilteredAnalyses(filteredData);
        calculateStats(filteredData);
        setIsFiltering(false);
      }, 50);
    }
  }, [selectedLieuTravail, analyses]);

  return (
    <Container maxWidth="xl" className="pt-20">
      {/* En-tête avec titre et actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
          <Typography variant="h4" gutterBottom>
            📊 Analyse des Présences
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <TextField
              type="date"
              label="Date d'analyse"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Lieu de travail</InputLabel>
              <Select
                value={selectedLieuTravail}
                onChange={(e) => setSelectedLieuTravail(e.target.value)}
                label="Lieu de travail"
              >
                <MenuItem value="all">Tous les lieux</MenuItem>
                {getLieuxTravail(analyses).map((lieu) => (
                  <MenuItem key={lieu} value={lieu}>
                    {lieu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => analyserJournee(selectedDate)}
              disabled={isAnalyzing}
              startIcon={isAnalyzing ? <AccessTimeIcon className="animate-spin" /> : <PlayIcon />}
            >
              {isAnalyzing ? 'Analyse...' : 'Analyser'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => loadAnalyses(selectedDate)}
              disabled={isLoading}
              startIcon={<RefreshIcon />}
            >
              Actualiser
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Statistiques Dashboard */}
      {isFiltering ? (
        <StatsSkeleton />
      ) : stats ? (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📈 Statistiques du {new Date(selectedDate).toLocaleDateString('fr-FR')}
              {selectedLieuTravail !== 'all' && (
                <Chip 
                  label={`Filtré: ${selectedLieuTravail}`}
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Carte Présents */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#4CAF50', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#4CAF50', 0.8)} 0%, ${alpha('#2E7D32', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <EventAvailableIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.presents}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Présents</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte Absents */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#F44336', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#F44336', 0.8)} 0%, ${alpha('#C62828', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(244, 67, 54, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <EventBusyIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.absents}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Absents</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte Retards */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#FF9800', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#FF9800', 0.8)} 0%, ${alpha('#E65100', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(255, 152, 0, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <ScheduleIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.retards + stats.presents_avec_retard}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Retards</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte Sorties Anticipées */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#2196F3', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#2196F3', 0.8)} 0%, ${alpha('#1565C0', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <ExitIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.sorties_anticipees}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Sorties Anticipées</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte Taux Présence */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#9C27B0', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#9C27B0', 0.8)} 0%, ${alpha('#6A1B9A', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(156, 39, 176, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <PersonIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.taux_presence}%
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Taux Présence</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte En Repos */}
              <Box sx={{ flex: '1 1 calc(16.66% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#795548', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#795548', 0.8)} 0%, ${alpha('#4E342E', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(121, 85, 72, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(121, 85, 72, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <HotelIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.en_repos}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>En Repos</Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Carte Congés */}
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ 
                  backgroundColor: 'transparent',
                  backgroundImage: `
                    repeating-linear-gradient(45deg, ${alpha('#9E9E9E', 0.1)} 0 2px, transparent 2px 4px),
                    linear-gradient(135deg, ${alpha('#9E9E9E', 0.8)} 0%, ${alpha('#616161', 0.9)} 100%)
                  `,
                  backgroundBlendMode: 'overlay, normal',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(158, 158, 158, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(158, 158, 158, 0.4)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <EventBusyIcon sx={{ fontSize: 28, mb: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {stats.en_conge}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Congés</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Paper>
        </Box>
      ) : null}

      {/* Message si aucune analyse */}
      {analyses.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography>
            Aucune analyse trouvée pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}. 
            Cliquez sur "Analyser" pour lancer l'analyse de cette journée.
          </Typography>
        </Alert>
      )}

              {/* Indicateur de filtrage */}
        {analyses.length > 0 && selectedLieuTravail !== 'all' && (
          isFiltering ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography>
                📍 Filtrage par lieu de travail : <strong>{selectedLieuTravail}</strong> 
                ({filteredAnalyses.length} analyse{filteredAnalyses.length > 1 ? 's' : ''} sur {analyses.length} total)
              </Typography>
            </Alert>
          )
        )}

      {/* Tableau des analyses */}
      {isLoading ? (
        <LinearProgress color="secondary" />
      ) : isFiltering ? (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Paper>
        </Box>
      ) : (
        <MaterialReactTable table={table} />
      )}

      {/* Modal de justification */}
      <Modal
        open={openJustification}
        onClose={() => setOpenJustification(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={openJustification}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2" gutterBottom>
              📝 Justification - {selectedAnalyse?.user?.nom} {selectedAnalyse?.user?.prenom}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut actuel:
              </Typography>
              {selectedAnalyse && formatStatut(selectedAnalyse.statut_final)}
              
              {/* Dans le modal de justification */}
<FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel>Statut final</InputLabel>
  <Select
    value={justificationForm.statut_final}
    onChange={(e) => setJustificationForm({
      ...justificationForm,
      statut_final: e.target.value as StatutAnalyse
    })}
    label="Statut final"
  >
    {Object.values(StatutAnalyse).map((statut) => (
      <MenuItem key={statut} value={statut}>
        {statut.replace('_', ' ').toUpperCase()}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaire de justification"
                value={justificationForm.commentaire}
                onChange={(e) => setJustificationForm({
                  ...justificationForm,
                  commentaire: e.target.value
                })}
                sx={{ mt: 2 }}
                placeholder="Ajouter un commentaire sur cette justification..."
              />
            </Box>

            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button onClick={() => setOpenJustification(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSaveJustification}
                variant="contained"
                color="secondary"
                startIcon={<CheckIcon />}
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Analyse;
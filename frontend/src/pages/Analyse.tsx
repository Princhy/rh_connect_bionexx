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
  Paper
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
  FileDownload as FileDownloadIcon
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
  EN_CONGE: "en_conge"
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // États pour les statistiques et dashboard
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // États pour les modals
  const [openJustification, setOpenJustification] = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState<AnalyseOutput | null>(null);
  const [justificationForm, setJustificationForm] = useState({
    justifie: false,
    commentaire: ''
  });

  // Charger les analyses pour la date sélectionnée
  const loadAnalyses = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/analyses/date/"${date}"`);
      setAnalyses(response.data);
      console.log(response)
      
      // Calculer les statistiques si des analyses existent
      if (response.data.length > 0) {
        calculateStats(response.data);
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
      presents_avec_retard: presentsAvecRetard,
      taux_presence: total > 0 ? Math.round(((presents + retards + sortiesAnticipees + presentsAvecRetard) / total) * 100) : 0,
      retard_moyen_minutes: retardMoyen
    });
  };

  // Analyser une journée
  const analyserJournee = async (date: string) => {
    setIsAnalyzing(true);
    try {
      const response = await axiosInstance.post('/analyses/analyser-journee', { date });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await loadAnalyses(date);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse de la journée');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Gérer la justification
  const handleOpenJustification = (analyse: AnalyseOutput) => {
    setSelectedAnalyse(analyse);
    setJustificationForm({
      justifie: analyse.justifie,
      commentaire: analyse.commentaire || ''
    });
    setOpenJustification(true);
  };

  const handleSaveJustification = async () => {
    if (!selectedAnalyse) return;
    
    try {
      const response = await axiosInstance.put(`/analyses/justifier/${selectedAnalyse.id_analyse}`, justificationForm);
      
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
      [StatutAnalyse.EN_CONGE]:'Congé'
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

  // Fonction d'export PDF
  const handleExportRows = (rows: MRT_Row<AnalyseOutput>[]) => {
    const doc = new jsPDF('landscape'); // Mode paysage pour plus d'espace
    
    // Titre du document
    doc.setFontSize(18);
    doc.text('Rapport d\'Analyse des Présences', 14, 22);
    doc.setFontSize(11);
    doc.text(`Date analysée: ${new Date(selectedDate).toLocaleDateString('fr-FR')}`, 14, 30);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 36);

    const tableData = rows.map((row) => [
      row.original.matricule,
      `${row.original.user?.prenom || ''} ${row.original.user?.nom || ''}`,
      row.original.user?.equipe?.equipe || 'N/A',
      row.original.statut_final.replace('_', ' ').toUpperCase(),
      row.original.heure_prevue_arrivee || '-',
      row.original.heure_reelle_arrivee || '-',
      row.original.retard_minutes > 0 ? `${row.original.retard_minutes} min` : '-',
      row.original.heure_prevue_depart || '-',
      row.original.heure_reelle_depart || '-',
      row.original.sortie_anticipee_minutes > 0 ? `${row.original.sortie_anticipee_minutes} min` : '-',
      row.original.justifie ? 'Oui' : 'Non',
      row.original.mode_pointage || '-',
      row.original.lieu_pointage || '-',
      row.original.commentaire || '-'
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
      'Lieu',
      'Commentaire'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 42,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [71, 85, 105] },
      columnStyles: {
        13: { cellWidth: 25 } // Commentaire plus large
      },
      margin: { left: 10, right: 10 }
    });

    doc.save(`analyse-presences-${selectedDate}.pdf`);
  };
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: analyses,
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
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
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
            <Button
              variant="contained"
              color="primary"
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
      {stats && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              📈 Statistiques du {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <EventAvailableIcon sx={{ fontSize: 24, mb: 0.5 }} />
                    <Typography variant="h4">{stats.presents}</Typography>
                    <Typography variant="body2">Présents</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <EventBusyIcon sx={{ fontSize: 24, mb: 0.5 }} />
                    <Typography variant="h4">{stats.absents}</Typography>
                    <Typography variant="body2">Absents</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 24, mb: 0.5 }} />
                    <Typography variant="h4">{stats.retards + stats.presents_avec_retard}</Typography>
                    <Typography variant="body2">Retards</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <ExitIcon sx={{ fontSize: 24, mb: 0.5 }} />
                    <Typography variant="h4">{stats.sorties_anticipees}</Typography>
                    <Typography variant="body2">Sorties Anticipées</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <PersonIcon sx={{ fontSize: 24, mb: 0.5 }} />
                    <Typography variant="h4">{stats.taux_presence}%</Typography>
                    <Typography variant="body2">Taux Présence</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(20% - 8px)', minWidth: '140px' }}>
  <Card sx={{ bgcolor: '#9E9E9E', color: 'white' }}>
    <CardContent sx={{ textAlign: 'center', py: 1 }}>
      <EventBusyIcon sx={{ fontSize: 24, mb: 0.5 }} />
      <Typography variant="h4">{stats.en_conge}</Typography>
      <Typography variant="body2">Congés</Typography>
    </CardContent>
  </Card>
</Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Message si aucune analyse */}
      {analyses.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography>
            Aucune analyse trouvée pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}. 
            Cliquez sur "Analyser" pour lancer l'analyse de cette journée.
          </Typography>
        </Alert>
      )}

      {/* Tableau des analyses */}
      {isLoading ? (
        <LinearProgress color="secondary" />
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
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Statut de justification</InputLabel>
                <Select
                  value={justificationForm.justifie ? 'true' : 'false'}
                  onChange={(e) => setJustificationForm({
                    ...justificationForm,
                    justifie: e.target.value === 'true'
                  })}
                  label="Statut de justification"
                >
                  <MenuItem value="false">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CancelIcon color="error" />
                      Non justifié
                    </Box>
                  </MenuItem>
                  <MenuItem value="true">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckIcon color="success" />
                      Justifié
                    </Box>
                  </MenuItem>
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
                color="primary"
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
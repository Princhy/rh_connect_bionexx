import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Button,
  TextField,
  Chip,
  Avatar,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Skeleton,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  DateRange as DateRangeIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../config/authConfig';

// Types
interface Analyse {
  id_analyse: number;
  matricule: string;
  date: string;
  heure_prevue_arrivee: string | null;
  heure_prevue_depart: string | null;
  heure_reelle_arrivee: string | null;
  heure_reelle_depart: string | null;
  retard_minutes: number;
  sortie_anticipee_minutes: number;
  statut_final: 'present' | 'absent' | 'retard' | 'EN_REPOS';
  travaille_aujourd_hui: boolean;
  justifie: boolean;
  commentaire: string;
  mode_pointage: string | null;
  lieu_pointage: string | null;
  lieu_travail: string | null;
  date_analyse: string;
}

interface Statistiques {
  total_employes: number;
  presents: number;
  absents: number;
  retards: number;
  sorties_anticipees: number;
  presents_avec_retard: number;
  en_conge: number;
  taux_presence: number;
  taux_absence: number;
  retard_moyen_minutes: number;
  en_repos: number;
  total_jours: number;
  total_analyses: number;
  moyenne_analyses_par_jour: string;
}

interface AnalysisData {
  periode: string;
  analyses: Analyse[];
  statistiques: Statistiques;
}

const PeriodeAnalysis: React.FC = () => {
  const theme = useTheme();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [dateDebut, setDateDebut] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  
  const [dateFin, setDateFin] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchAnalysisData();
  }, [dateDebut, dateFin]);

  const fetchAnalysisData = async () => {
    if (!dateDebut || !dateFin) return;

    setIsLoading(true);
    setError(null);
    try {
      // Validation des dates
      if (new Date(dateDebut) > new Date(dateFin)) {
        throw new Error('La date de début ne peut pas être postérieure à la date de fin');
      }
      
      const url = `/analyses/analyse-periode/${dateDebut}/${dateFin}`;
      console.log('URL de requête:', url);
      
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des analyses';
      setError(errorMessage);
      console.error('Error fetching analysis data:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const formatMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'present': return 'success';
      case 'retard': return 'warning';
      case 'absent': return 'error';
      case 'EN_REPOS': return 'info';
      default: return 'default';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'present': return <CheckCircleIcon />;
      case 'retard': return <AccessTimeIcon />;
      case 'absent': return <CancelIcon />;
      case 'EN_REPOS': return <EventIcon />;
      default: return <WarningIcon />;
    }
  };

  // Table columns
  const columns = useMemo<MRT_ColumnDef<Analyse>[]>(
    () => [
      {
        accessorKey: 'matricule',
        header: 'Matricule',
        size: 120,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'statut_final',
        header: 'Statut',
        size: 120,
        Cell: ({ cell, row }) => {
          const statut = cell.getValue<string>();
          return (
            <Chip
              icon={getStatutIcon(statut)}
              label={statut.replace('_', ' ')}
              color={getStatutColor(statut) as any}
              size="small"
              sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        accessorKey: 'heure_prevue_arrivee',
        header: 'Arrivée Prévue',
        size: 130,
        Cell: ({ cell }) => formatTime(cell.getValue<string>()),
      },
      {
        accessorKey: 'heure_reelle_arrivee',
        header: 'Arrivée Réelle',
        size: 130,
        Cell: ({ cell }) => formatTime(cell.getValue<string>()),
      },
      {
        accessorKey: 'heure_prevue_depart',
        header: 'Départ Prévu',
        size: 130,
        Cell: ({ cell }) => formatTime(cell.getValue<string>()),
      },
      {
        accessorKey: 'heure_reelle_depart',
        header: 'Départ Réel',
        size: 130,
        Cell: ({ cell }) => formatTime(cell.getValue<string>()),
      },
      {
        accessorKey: 'retard_minutes',
        header: 'Retard',
        size: 100,
        Cell: ({ cell }) => {
          const minutes = cell.getValue<number>();
          return minutes > 0 ? (
            <Chip 
              label={formatMinutesToHours(minutes)} 
              color="warning" 
              size="small" 
            />
          ) : '-';
        },
      },
      {
        accessorKey: 'sortie_anticipee_minutes',
        header: 'Sortie Anticipée',
        size: 130,
        Cell: ({ cell }) => {
          const minutes = cell.getValue<number>();
          return minutes > 0 ? (
            <Chip 
              label={formatMinutesToHours(minutes)} 
              color="error" 
              size="small" 
            />
          ) : '-';
        },
      },
      {
        accessorKey: 'lieu_pointage',
        header: 'Lieu Pointage',
        size: 120,
        Cell: ({ cell }) => cell.getValue<string>() || 'N/A',
      },
      {
        accessorKey: 'lieu_travail',
        header: 'Lieu Travail',
        size: 120,
        Cell: ({ cell }) => cell.getValue<string>() || 'N/A',
      },
      {
        accessorKey: 'mode_pointage',
        header: 'Mode',
        size: 80,
        Cell: ({ cell }) => {
          const mode = cell.getValue<string>();
          return mode ? (
            <Chip 
              label={mode.toUpperCase()} 
              variant="outlined" 
              size="small" 
            />
          ) : 'N/A';
        },
      },
      {
        accessorKey: 'commentaire',
        header: 'Commentaire',
        size: 200,
        Cell: ({ cell }) => {
          const commentaire = cell.getValue<string>();
          return commentaire ? (
            <Tooltip title={commentaire} arrow>
              <Typography 
                variant="body2" 
                sx={{ 
                  maxWidth: 180, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {commentaire}
              </Typography>
            </Tooltip>
          ) : '-';
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.analyses || [],
    state: { isLoading },
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Button
          disabled={!data || data.analyses.length === 0}
          onClick={() => handleExportPDF()}
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color="primary"
        >
          Export PDF
        </Button>
      </Box>
    ),
  });

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Rapport d\'Analyse par Période', 14, 22);
    doc.setFontSize(12);
    doc.text(`Période: ${data.periode}`, 14, 32);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 40);

    // Statistics
    doc.setFontSize(14);
    doc.text('Statistiques:', 14, 52);
    doc.setFontSize(10);
    const stats = data.statistiques;
    doc.text(`Total employés: ${stats.total_employes}`, 14, 62);
    doc.text(`Taux de présence: ${stats.taux_presence.toFixed(1)}%`, 14, 70);
    doc.text(`Présents: ${stats.presents}`, 14, 78);
    doc.text(`Absents: ${stats.absents}`, 14, 86);
    doc.text(`Retards: ${stats.retards}`, 14, 94);
    doc.text(`Retard moyen: ${formatMinutesToHours(stats.retard_moyen_minutes)}`, 14, 102);

    // Table data
    const tableData = data.analyses.map((analyse) => [
      analyse.matricule,
      formatDate(analyse.date),
      analyse.statut_final.replace('_', ' '),
      formatTime(analyse.heure_prevue_arrivee),
      formatTime(analyse.heure_reelle_arrivee),
      formatTime(analyse.heure_prevue_depart),
      formatTime(analyse.heure_reelle_depart),
      analyse.retard_minutes > 0 ? formatMinutesToHours(analyse.retard_minutes) : '-',
      analyse.sortie_anticipee_minutes > 0 ? formatMinutesToHours(analyse.sortie_anticipee_minutes) : '-',
      analyse.lieu_pointage || 'N/A',
      analyse.mode_pointage || 'N/A',
      analyse.commentaire || '-'
    ]);

    const tableHeaders = [
      'Matricule', 'Date', 'Statut', 'Arrivée Prévue', 'Arrivée Réelle', 
      'Départ Prévu', 'Départ Réel', 'Retard', 'Sortie Anticipée', 'Lieu Pointage', 'Mode', 'Commentaire'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 110,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`analyse-periode-${dateDebut}-${dateFin}.pdf`);
  };

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Card sx={{ height: '100%', minWidth: 250 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ backgroundColor: alpha(color, 0.1), color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const StatCardSkeleton = () => (
    <Card sx={{ height: '100%', minWidth: 250 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </CardContent>
    </Card>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" className="pt-20">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analyse par Période
        </Typography>
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ minWidth: 200 }}>
              <TextField
                fullWidth
                label="Date Début"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <TextField
                fullWidth
                label="Date Fin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={fetchAnalysisData}
                startIcon={<RefreshIcon />}
                sx={{ minWidth: 140 }}
              >
                Analyser
              </Button>
            </Box>
          </Box>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 3 }} />}

        {isLoading ? (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              {[...Array(6)].map((_, index) => (
                <StatCardSkeleton key={index} />
              ))}
            </Box>
            <Paper sx={{ overflow: 'hidden' }}>
              <Typography variant="h6" sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                Détail des Analyses
              </Typography>
              <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={400} />
              </Box>
            </Paper>
          </>
        ) : data ? (
          <>
            {/* Period Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.main }}>
                  <DateRangeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    Analyse de la Période
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.periode}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.analyses.length} analyses effectuées
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Statistics Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              <StatCard
                title="Total Employés"
                value={data.statistiques.total_employes}
                icon={<GroupIcon />}
                color={theme.palette.primary.main}
                subtitle="Employés analysés"
              />
              <StatCard
                title="Taux de Présence"
                value={`${data.statistiques.taux_presence.toFixed(1)}%`}
                icon={<TrendingUpIcon />}
                color={theme.palette.success.main}
                subtitle={`${data.statistiques.presents} présents`}
              />
              <StatCard
                title="Absents"
                value={data.statistiques.absents}
                icon={<CancelIcon />}
                color={theme.palette.error.main}
                subtitle={`${data.statistiques.taux_absence.toFixed(1)}% d'absence`}
              />
              <StatCard
                title="Retards"
                value={data.statistiques.retards}
                icon={<AccessTimeIcon />}
                color={theme.palette.warning.main}
                subtitle={`Moyenne: ${formatMinutesToHours(data.statistiques.retard_moyen_minutes)}`}
              />
              <StatCard
                title="Sorties Anticipées"
                value={data.statistiques.sorties_anticipees}
                icon={<ScheduleIcon />}
                color={theme.palette.info.main}
                subtitle="Départs précoces"
              />
              <StatCard
                title="En Congé"
                value={data.statistiques.en_conge}
                icon={<EventIcon />}
                color={theme.palette.secondary.main}
                subtitle="Congés"
              />
            </Box>

            {/* Detailed Table */}
            <Paper sx={{ overflow: 'hidden' }}>
              <Typography variant="h6" sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                Détail des Analyses - Période: {data.periode}
              </Typography>
              <MaterialReactTable table={table} />
            </Paper>
          </>
        ) : !isLoading && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Aucune donnée disponible
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Veuillez sélectionner une période pour afficher les analyses.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default PeriodeAnalysis;

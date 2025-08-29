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
} from '@mui/icons-material';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../config/authConfig';

// Types
interface User {
  id_user: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  poste: string;
  type_contrat: string;
  date_embauche: string;
  role: string;
  equipe: {
    id_equipe: number;
    equipe: string;
  };
  departement: {
    id_departement: number;
    departement: string;
  };
  lieu: {
    id_lieu: number;
    lieu: string;
  };
}

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
  user: User;
}

interface Statistics {
  matricule: string;
  periode: string;
  total_jours: number;
  jours_presents: number;
  jours_absents: number;
  jours_retards: number;
  jours_sorties_anticipees: number;
  jours_conge: number;
  jours_repos: number;
  total_retard_minutes: number;
  total_sortie_anticipee_minutes: number;
  retard_moyen_minutes: number;
  taux_presence: number;
  taux_absence: number;
}

interface AnalysisData {
  employe: User;
  periode: string;
  analyses: Analyse[];
  statistiques_employe: Statistics;
}

const EmployeeAnalysis: React.FC = () => {
  const theme = useTheme();
  const { user, hasRole } = useAuth();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<{ matricule: string; nom: string; prenom: string }[]>([]);

  // Form states
  const [selectedMatricule, setSelectedMatricule] = useState<string>('');
  
  // Fonction pour créer une date au format YYYY-MM-DD sans problème de timezone
  const createDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const [dateDebut, setDateDebut] = useState<string>(() => {
    const now = new Date();
    return createDateString(now.getFullYear(), now.getMonth(), 1);
  });
  
  const [dateFin, setDateFin] = useState<string>(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return createDateString(now.getFullYear(), now.getMonth(), lastDay.getDate());
  });

  useEffect(() => {
    fetchEmployees();
    // Set default matricule for employees
    if (hasRole('Employe') && user?.matricule) {
      setSelectedMatricule(user.matricule);
    }
  }, []);

  useEffect(() => {
    if (selectedMatricule) {
      fetchAnalysisData();
    }
  }, [selectedMatricule, dateDebut, dateFin]);

  const fetchEmployees = async () => {
    try {
      let url = '/users';
      
      if (hasRole('Employe') && user?.matricule) {
        setEmployeeOptions([{
          matricule: user.matricule,
          nom: user.nom || '',
          prenom: user.prenom || ''
        }]);
        return;
      } else if (hasRole('Superviseur') && user?.id_departement) {
        url = `/users/departement/${user.id_departement}`;
      }
      
      const response = await axiosInstance.get(url);
      const employees = response.data.map((user: any) => ({
        matricule: user.matricule,
        nom: user.nom,
        prenom: user.prenom
      }));
      setEmployeeOptions(employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast.error('Erreur lors du chargement des employés');
    }
  };

  const fetchAnalysisData = async () => {
    if (!selectedMatricule) return;

    setIsLoading(true);
    setError(null);
    try {
      // Validation des dates
      if (!dateDebut || !dateFin) {
        throw new Error('Les dates de début et de fin sont requises');
      }
      
      if (new Date(dateDebut) > new Date(dateFin)) {
        throw new Error('La date de début ne peut pas être postérieure à la date de fin');
      }
      
      // Encoder les paramètres de date pour éviter les problèmes d'URL
      const params = new URLSearchParams({
        dateDebut: dateDebut,
        dateFin: dateFin
      });
      
      const url = `/analyses/employe/${selectedMatricule}/periode?${params.toString()}`;
      console.log('URL de requête:', url); // Debug log
      console.log('Paramètres de date:', { dateDebut, dateFin }); // Debug log
      console.log('Paramètres encodés:', params.toString()); // Debug log
      
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
  
  // Fonction pour normaliser le format de date
  const normalizeDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
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

  // Charts data
  const presenceData = useMemo(() => {
    if (!data) return [];
    const stats = data.statistiques_employe;
    return [
      { name: 'Présent', value: stats.jours_presents, color: '#4caf50' },
      { name: 'Retard', value: stats.jours_retards, color: '#ff9800' },
      { name: 'Absent', value: stats.jours_absents, color: '#f44336' },
      { name: 'En repos', value: stats.jours_repos, color: '#2196f3' },
    ];
  }, [data]);

  const weeklyData = useMemo(() => {
    if (!data) return [];
    
    const weeklyStats: { [week: string]: { presents: number; absents: number; retards: number } } = {};
    
    data.analyses.forEach(analyse => {
      const date = new Date(analyse.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = `Sem ${Math.ceil(weekStart.getDate() / 7)}`;
      
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = { presents: 0, absents: 0, retards: 0 };
      }
      
      if (analyse.statut_final === 'present') weeklyStats[weekKey].presents++;
      else if (analyse.statut_final === 'absent') weeklyStats[weekKey].absents++;
      else if (analyse.statut_final === 'retard') weeklyStats[weekKey].retards++;
    });
    
    return Object.entries(weeklyStats).map(([week, stats]) => ({
      week,
      ...stats
    }));
  }, [data]);

  // Table columns
  const columns = useMemo<MRT_ColumnDef<Analyse>[]>(
    () => [
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
        accessorKey: 'lieu_pointage',
        header: 'Lieu',
        size: 100,
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
    doc.text('Rapport d\'Analyse Employé', 14, 22);
    doc.setFontSize(12);
    doc.text(`Employé: ${data.employe.prenom} ${data.employe.nom} (${data.employe.matricule})`, 14, 32);
    doc.text(`Période: ${data.periode}`, 14, 40);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 48);

    // Statistics
    doc.setFontSize(14);
    doc.text('Statistiques:', 14, 60);
    doc.setFontSize(10);
    const stats = data.statistiques_employe;
    doc.text(`Taux de présence: ${stats.taux_presence.toFixed(1)}%`, 14, 70);
    doc.text(`Jours présents: ${stats.jours_presents}`, 14, 78);
    doc.text(`Jours absents: ${stats.jours_absents}`, 14, 86);
    doc.text(`Jours en retard: ${stats.jours_retards}`, 14, 94);
    doc.text(`Retard total: ${formatMinutesToHours(stats.total_retard_minutes)}`, 14, 102);

         // Table data
     const tableData = data.analyses.map((analyse) => [
       formatDate(analyse.date),
       analyse.statut_final.replace('_', ' '),
       formatTime(analyse.heure_prevue_arrivee),
       formatTime(analyse.heure_reelle_arrivee),
       formatTime(analyse.heure_prevue_depart),
       formatTime(analyse.heure_reelle_depart),
       analyse.retard_minutes > 0 ? formatMinutesToHours(analyse.retard_minutes) : '-',
       analyse.lieu_pointage || 'N/A',
       analyse.mode_pointage || 'N/A',
       analyse.commentaire || '-'
     ]);

     const tableHeaders = [
       'Date', 'Statut', 'Arrivée Prévue', 'Arrivée Réelle', 
       'Départ Prévu', 'Départ Réel', 'Retard', 'Lieu', 'Mode', 'Commentaire'
     ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 110,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`analyse-${data.employe.matricule}-${dateDebut}-${dateFin}.pdf`);
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

  const EmployeeInfoSkeleton = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 400 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="text" width={180} height={20} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={180} height={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={160} height={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={140} height={20} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" className="pt-20">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analyse Individuelle des Employés
        </Typography>
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ minWidth: 300 }}>
              {hasRole('Employe') ? (
                <TextField
                  fullWidth
                  label="Matricule"
                  value={selectedMatricule}
                  disabled
                />
              ) : (
                                 <Autocomplete
                   options={employeeOptions}
                   value={selectedMatricule}
                   onChange={(_, newValue) => {
                     if (typeof newValue === 'string') {
                       setSelectedMatricule(newValue);
                     } else if (newValue) {
                       setSelectedMatricule(newValue.matricule);
                     } else {
                       setSelectedMatricule('');
                     }
                   }}
                   getOptionLabel={(option) => {
                     if (typeof option === 'string') return option;
                     return `${option.matricule} - ${option.prenom} ${option.nom}`;
                   }}
                   renderInput={(params) => <TextField {...params} label="Matricule Employé" required />}
                   freeSolo
                 />
              )}
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <TextField
                fullWidth
                label="Date Début"
                type="date"
                value={dateDebut}
                onChange={(e) => {
                  const normalizedDate = normalizeDate(e.target.value);
                  setDateDebut(normalizedDate);
                  console.log('Date début changée:', normalizedDate); // Debug log
                }}
                InputLabelProps={{ shrink: true }}

              />
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <TextField
                fullWidth
                label="Date Fin"
                type="date"
                value={dateFin}
                onChange={(e) => {
                  const normalizedDate = normalizeDate(e.target.value);
                  setDateFin(normalizedDate);
                  console.log('Date fin changée:', normalizedDate); // Debug log
                }}
                InputLabelProps={{ shrink: true }}

              />
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={fetchAnalysisData}
                startIcon={<RefreshIcon />}
                disabled={!selectedMatricule}
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
            <EmployeeInfoSkeleton />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              {[...Array(5)].map((_, index) => (
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
                ) : data && data.employe ? (
          <>
            {/* Employee Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 400 }}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.main }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5">
                      {data.employe.prenom} {data.employe.nom}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Matricule: {data.employe.matricule}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {data.employe.poste} - {data.employe.role}
                    </Typography>
                  </Box>
                </Box>
                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 300 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <PersonIcon fontSize="small" />
                     <Typography variant="body2">
                       {data.employe.departement?.departement} - {data.employe.equipe?.equipe}
                     </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <BusinessIcon fontSize="small" />
                     <Typography variant="body2">
                       Lieu de travail: {data.employe.lieu?.lieu || 'Non défini'}
                     </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <DateRangeIcon fontSize="small" />
                     <Typography variant="body2">
                       Embauché le: {formatDate(data.employe.date_embauche)}
                     </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <ScheduleIcon fontSize="small" />
                     <Typography variant="body2">
                       Contrat: {data.employe.type_contrat}
                     </Typography>
                   </Box>
                 </Box>
              </Box>
            </Paper>

            {/* Statistics Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              <StatCard
                title="Taux de Présence"
                value={`${data.statistiques_employe.taux_presence.toFixed(1)}%`}
                icon={<TrendingUpIcon />}
                color={theme.palette.success.main}
                subtitle={`${data.statistiques_employe.jours_presents} jours présents`}
              />
              <StatCard
                title="Jours Absents"
                value={data.statistiques_employe.jours_absents}
                icon={<CancelIcon />}
                color={theme.palette.error.main}
                subtitle={`${data.statistiques_employe.taux_absence.toFixed(1)}% d'absence`}
              />
              <StatCard
                title="Total Retards"
                value={data.statistiques_employe.jours_retards}
                icon={<AccessTimeIcon />}
                color={theme.palette.warning.main}
                subtitle={formatMinutesToHours(data.statistiques_employe.total_retard_minutes)}
              />
                              <StatCard
                  title="Jours en Repos"
                  value={data.statistiques_employe.jours_repos}
                  icon={<EventIcon />}
                  color={theme.palette.info.main}
                  subtitle="Week-ends/Tour de repos/Feriés"
                />
                <StatCard
                  title="Jours de Congés"
                  value={data.statistiques_employe.jours_conge}
                  icon={<EventIcon />}
                  color={theme.palette.secondary.main}
                  subtitle="Congés"
                />
            </Box>

            {/* Charts - Temporarily disabled due to Recharts compatibility issues */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              <Card sx={{ minWidth: 400, flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Répartition des Présences
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Graphique temporairement désactivé
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 400, flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Évolution Hebdomadaire
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Graphique temporairement désactivé
                  </Typography>
                </CardContent>
              </Card>
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
              Veuillez sélectionner un employé et une période pour afficher les analyses.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default EmployeeAnalysis;
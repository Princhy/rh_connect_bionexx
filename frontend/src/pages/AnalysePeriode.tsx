import React, { useState, useEffect, useMemo } from 'react';
import {
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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  DateRange as DateRangeIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';


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
  statut_final: 'present' | 'absent' | 'retard' | 'EN_REPOS' | 'en_conge';
  travaille_aujourd_hui: boolean;
  justifie: boolean;
  commentaire: string;
  mode_pointage: string | null;
  lieu_pointage: string | null;
  lieu_travail: string | null;
  h_travail: string | null;
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
  total_heures_travail: string;
}

interface AnalysisData {
  periode: string;
  analyses: Analyse[];
  statistiques: Statistiques;
}

const PeriodeAnalysis: React.FC = () => {
  const theme = useTheme();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [filteredData, setFilteredData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [dateDebut, setDateDebut] = useState<string>(() => {
    const now = new Date();
    // Date de début = il y a un mois
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return `${oneMonthAgo.getFullYear()}-${String(oneMonthAgo.getMonth() + 1).padStart(2, '0')}-${String(oneMonthAgo.getDate()).padStart(2, '0')}`;
  });
  
  const [dateFin, setDateFin] = useState<string>(() => {
    const now = new Date();
    // Date de fin = aujourd'hui
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // Filtre par lieu de travail
  const [selectedLieuTravail, setSelectedLieuTravail] = useState<string>('all');
  const [availableLieux, setAvailableLieux] = useState<string[]>([]);

  // Obtenir la liste unique des lieux de travail
  const getLieuxTravail = (analysesData: Analyse[]): string[] => {
    const lieux = analysesData
      .map(analyse => analyse.lieu_travail)
      .filter((lieu): lieu is string => lieu !== undefined && lieu !== null && lieu !== '');
    return [...new Set(lieux)].sort();
  };

  // Appliquer le filtre par lieu de travail
  const applyLieuTravailFilter = (analysesData: Analyse[], lieuFilter: string) => {
    if (lieuFilter === 'all') {
      return analysesData;
    }
    return analysesData.filter(analyse => analyse.lieu_travail === lieuFilter);
  };

  // Recalculer les statistiques basées sur les données filtrées
  const recalculateStats = (analysesData: Analyse[]): Statistiques => {
    const total = analysesData.length;
    const presents = analysesData.filter(a => a.statut_final === 'present').length;
    const absents = analysesData.filter(a => a.statut_final === 'absent').length;
    const retards = analysesData.filter(a => a.statut_final === 'retard').length;
    const sortiesAnticipees = analysesData.filter(a => a.sortie_anticipee_minutes > 0).length;
    const presentsAvecRetard = analysesData.filter(a => a.statut_final === 'present' && a.retard_minutes > 0).length;
    const en_conge = analysesData.filter(a => a.statut_final === 'en_conge').length;
    const en_repos = analysesData.filter(a => a.statut_final === 'EN_REPOS').length;
    const totalRetardMinutes = analysesData.reduce((sum, a) => sum + a.retard_minutes, 0);
    const employesAvecRetard = retards + presentsAvecRetard;
    const retardMoyen = employesAvecRetard > 0 ? Math.round(totalRetardMinutes / employesAvecRetard) : 0;

    // Calculer le total des heures de travail
    const totalHeuresTravail = analysesData
      .filter(a => a.h_travail && a.h_travail !== 'pas_sortie' && a.h_travail !== 'anomalie')
      .reduce((total, a) => {
        const heures = a.h_travail;
        if (heures && heures.includes('h')) {
          const [h, m] = heures.split('h');
          const heuresNum = parseInt(h) || 0;
          const minutesNum = parseInt(m) || 0;
          return total + heuresNum + (minutesNum / 60);
        }
        return total;
      }, 0);

    const totalHeuresFormatted = `${Math.floor(totalHeuresTravail)}h${Math.round((totalHeuresTravail % 1) * 60)}`;

    return {
      total_employes: total,
      presents,
      absents,
      retards,
      sorties_anticipees: sortiesAnticipees,
      presents_avec_retard: presentsAvecRetard,
      en_conge,
      taux_presence: total > 0 ? Math.round(((presents + retards + sortiesAnticipees + presentsAvecRetard) / (total - en_repos - en_conge)) * 100) : 0,
      taux_absence: total > 0 ? Math.round((absents / (total - en_repos - en_conge)) * 100) : 0,
      retard_moyen_minutes: retardMoyen,
      en_repos,
      total_jours: data?.statistiques.total_jours || 0,
      total_analyses: total,
      moyenne_analyses_par_jour: total > 0 ? (total / (data?.statistiques.total_jours || 1)).toFixed(1) : '0',
      total_heures_travail: totalHeuresFormatted
    };
  };

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
  
      
      const response = await axiosInstance.get(url);
      setData(response.data);
      
      // Mettre à jour les lieux disponibles
      const lieux = getLieuxTravail(response.data.analyses);
      setAvailableLieux(lieux);
      
      // Appliquer le filtre par lieu de travail immédiatement
      const filteredAnalyses = applyLieuTravailFilter(response.data.analyses, selectedLieuTravail);
      const recalculatedStats = recalculateStats(filteredAnalyses);
      
      setFilteredData({
        ...response.data,
        analyses: filteredAnalyses,
        statistiques: recalculatedStats
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des analyses';
      setError(errorMessage);
      console.error('Error fetching analysis data:', err);
      toast.error(errorMessage);
      // En cas d'erreur, réinitialiser les données
      setData(null);
      setFilteredData(null);
      setAvailableLieux([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect pour appliquer le filtre quand il change
  useEffect(() => {
    if (data && data.analyses.length > 0) {
      setIsFiltering(true);
      
      // Délai court pour montrer le skeleton
      setTimeout(() => {
        const filteredAnalyses = applyLieuTravailFilter(data.analyses, selectedLieuTravail);
        const recalculatedStats = recalculateStats(filteredAnalyses);
        
        setFilteredData({
          ...data,
          analyses: filteredAnalyses,
          statistiques: recalculatedStats
        });
        setIsFiltering(false);
      }, 50);
    }
  }, [selectedLieuTravail, data]);

  // Effect pour charger les données quand les dates changent
  useEffect(() => {
    fetchAnalysisData();
  }, [dateDebut, dateFin]);



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
        Cell: ({ cell }) => {
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
        accessorKey: 'h_travail',
        header: 'Heures Travail',
        size: 130,
        Cell: ({ cell }) => {
          const hTravail = cell.getValue<string>();
          if (!hTravail) {
            return (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1,
                borderRadius: 2,
                bgcolor: 'grey.100',
                border: '1px dashed grey.300'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Non défini
                </Typography>
              </Box>
            );
          }
          
          // Styles différents selon le type de valeur
          if (hTravail === "pas_sortie") {
            return (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'orange.50',
                border: '2px solid orange.200',
                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                  zIndex: -1,
                  opacity: 0.3
                }
              }}>
                <WarningIcon sx={{ color: 'orange.600', fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'orange.800',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {hTravail}
                </Typography>
              </Box>
            );
          } 
          
          if (hTravail === "anomalie") {
            return (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'red.50',
                border: '2px solid red.200',
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                  zIndex: -1,
                  opacity: 0.3
                }
              }}>
                <CancelIcon sx={{ color: 'red.600', fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'red.800',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {hTravail}
                </Typography>
              </Box>
            );
          }
          
          // Pour les heures normales (format "8h30")
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              p: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease-in-out'
              },
              '&:hover::before': {
                transform: 'translateX(100%)'
              }
            }}>
              <AccessTimeIcon sx={{ fontSize: 18, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  letterSpacing: '0.5px'
                }}
              >
                {hTravail}
              </Typography>
            </Box>
          );
        },
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
    data: filteredData?.analyses || [],
    state: { isLoading },
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    initialState: {
      pagination: { pageSize: 25, pageIndex: 0 },
      sorting: [{ id: 'date', desc: true }]
    },
    muiTableContainerProps: {
      sx: {
        maxWidth: '100%',
        overflowX: 'auto'
      }
    },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
        minWidth: { xs: '600px', sm: '700px', md: '800px' }
      }
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Button
          disabled={!filteredData || filteredData.analyses.length === 0}
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
    if (!filteredData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Rapport d\'Analyse par Période', 14, 22);
    doc.setFontSize(12);
    doc.text(`Période: ${filteredData.periode}`, 14, 32);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 40);
    if (selectedLieuTravail !== 'all') {
      doc.text(`Lieu de travail filtré: ${selectedLieuTravail}`, 14, 48);
      doc.text(`Données filtrées: ${filteredData.analyses.length} analyses sur ${data?.analyses.length || 0} total`, 14, 56);
    }

    // Statistics
    doc.setFontSize(14);
    doc.text('Statistiques:', 14, selectedLieuTravail !== 'all' ? 68 : 52);
    doc.setFontSize(10);
    const stats = filteredData.statistiques;
    doc.text(`Total employés: ${stats.total_employes}`, 14, selectedLieuTravail !== 'all' ? 78 : 62);
    doc.text(`Taux de présence: ${stats.taux_presence.toFixed(1)}%`, 14, selectedLieuTravail !== 'all' ? 86 : 70);
    doc.text(`Présents: ${stats.presents}`, 14, selectedLieuTravail !== 'all' ? 94 : 78);
    doc.text(`Absents: ${stats.absents}`, 14, selectedLieuTravail !== 'all' ? 102 : 86);
    doc.text(`Retards: ${stats.retards}`, 14, selectedLieuTravail !== 'all' ? 110 : 94);
    doc.text(`Retard moyen: ${formatMinutesToHours(stats.retard_moyen_minutes)}`, 14, selectedLieuTravail !== 'all' ? 118 : 102);
    doc.text(`Total heures travail: ${stats.total_heures_travail || '0h'}`, 14, selectedLieuTravail !== 'all' ? 126 : 110);

    // Table data
    const tableData = filteredData.analyses.map((analyse) => [
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
      analyse.lieu_travail || 'N/A',
      analyse.h_travail || 'N/A',
      analyse.mode_pointage || 'N/A',
      analyse.commentaire || '-'
    ]);

    const tableHeaders = [
      'Matricule', 'Date', 'Statut', 'Arrivée Prévue', 'Arrivée Réelle', 
      'Départ Prévu', 'Départ Réel', 'Retard', 'Sortie Anticipée', 'Lieu Pointage', 'Lieu Travail', 'Heures Travail', 'Mode', 'Commentaire'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: selectedLieuTravail !== 'all' ? 134 : 118,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`analyse-periode-${dateDebut}-${dateFin}.pdf`);
  };

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Card sx={{ 
      height: '100%', 
      minWidth: 0,
      width: '100%'
    }}>
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2, md: 2.5 },
        '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography 
              color="textSecondary" 
              variant="overline"
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color, 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.2
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ 
            backgroundColor: alpha(color, 0.1), 
            color,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            flexShrink: 0
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const StatCardSkeleton = () => (
    <Card sx={{ 
      height: '100%', 
      minWidth: 0,
      width: '100%'
    }}>
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2, md: 2.5 },
        '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
          </Box>
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40}
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              flexShrink: 0
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

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
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem', lg: '2.5rem' }
          }}
        >
          📊 Analyse par Période
        </Typography>
        
        {/* Filters */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 2, sm: 2, md: 3 },
            alignItems: 'end'
          }}>
            <Box>
              <TextField
                fullWidth
                label="Date Début"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Date Fin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>Rattachement</InputLabel>
                <Select
                  value={selectedLieuTravail}
                  onChange={(e) => setSelectedLieuTravail(e.target.value)}
                  label="Lieu de travail"
                  startAdornment={<LocationIcon sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">Tous les lieux</MenuItem>
                  {availableLieux.length > 0 ? (
                    availableLieux.map((lieu) => (
                      <MenuItem key={lieu} value={lieu}>
                        {lieu}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Aucun lieu disponible</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={fetchAnalysisData}
                startIcon={<RefreshIcon />}
                sx={{ 
                  minWidth: { xs: '120px', sm: '140px' },
                  height: '40px'
                }}
              >
                Analyser
              </Button>
            </Box>
          </Box>
        </Paper>

        {isLoading && <LinearProgress sx={{ mb: 3 }} />}

        {/* Indicateur de filtrage */}
        {data && data.analyses.length > 0 && selectedLieuTravail !== 'all' && (
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
                📍 Filtrage par rattachement : <strong>{selectedLieuTravail}</strong> 
                ({filteredData?.analyses.length || 0} analyse{(filteredData?.analyses.length || 0) > 1 ? 's' : ''} sur {data.analyses.length} total)
              </Typography>
            </Alert>
          )
        )}

        {isLoading ? (
          <>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(6, 1fr)' 
              },
              gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
              mb: 3,
              width: '100%',
              minWidth: 0
            }}>
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
        ) : isFiltering ? (
          <>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(6, 1fr)' 
              },
              gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
              mb: 3,
              width: '100%',
              minWidth: 0
            }}>
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
        ) : filteredData ? (
          <>
            {/* Period Info */}
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, sm: 2, md: 3 }
              }}>
                <Avatar sx={{ 
                  width: { xs: 50, sm: 60 }, 
                  height: { xs: 50, sm: 60 }, 
                  bgcolor: theme.palette.primary.main 
                }}>
                  <DateRangeIcon />
                </Avatar>
                <Box>
                  <Typography 
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                    }}
                  >
                    Analyse de la Période
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {filteredData.periode}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {filteredData.analyses.length} analyse{filteredData.analyses.length > 1 ? 's' : ''} effectuée{filteredData.analyses.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Statistics Cards */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(6, 1fr)' 
              },
              gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
              mb: 3,
              width: '100%',
              minWidth: 0
            }}>
              <StatCard
                title="Total Employés"
                value={filteredData.statistiques.total_employes}
                icon={<GroupIcon />}
                color={theme.palette.primary.main}
                subtitle="Employés analysés"
              />
              <StatCard
                title="Taux de Présence"
                value={`${filteredData.statistiques.taux_presence.toFixed(1)}%`}
                icon={<TrendingUpIcon />}
                color={theme.palette.success.main}
                subtitle={`${filteredData.statistiques.presents} présents`}
              />
              <StatCard
                title="Absents"
                value={filteredData.statistiques.absents}
                icon={<CancelIcon />}
                color={theme.palette.error.main}
                subtitle={`${filteredData.statistiques.taux_absence.toFixed(1)}% d'absence`}
              />
              <StatCard
                title="Retards"
                value={filteredData.statistiques.retards}
                icon={<AccessTimeIcon />}
                color={theme.palette.warning.main}
                subtitle={`Moyenne: ${formatMinutesToHours(filteredData.statistiques.retard_moyen_minutes)}`}
              />
              <StatCard
                title="Sorties Anticipées"
                value={filteredData.statistiques.sorties_anticipees}
                icon={<ScheduleIcon />}
                color={theme.palette.info.main}
                subtitle="Départs précoces"
              />
              <StatCard
                title="En Congé"
                value={filteredData.statistiques.en_conge}
                icon={<EventIcon />}
                color={theme.palette.secondary.main}
                subtitle="Congés"
              />
            </Box>

            {/* Detailed Table */}
            <Paper sx={{ overflow: 'hidden' }}>
              <Typography variant="h6" sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                Détail des Analyses - Période: {filteredData.periode}
                {selectedLieuTravail !== 'all' && (
                  <Chip 
                    label={`Filtré: ${selectedLieuTravail}`}
                    color="primary"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              {filteredData.analyses.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucune analyse trouvée pour cette période
                    {selectedLieuTravail !== 'all' && ` et ce lieu de travail`}.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <MaterialReactTable table={table} />
                </Box>
              )}
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
    </Box>
  );
};

export default PeriodeAnalysis;

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Divider,
  alpha,
  IconButton,
  Skeleton
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HotelIcon from '@mui/icons-material/Hotel';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

// Types basés sur Analyse.tsx
interface DashboardStats {
  total_employes: number;
  presents: number;
  absents: number;
  retards: number;
  sorties_anticipees: number;
  presents_avec_retard: number;
  en_conge: number;
  en_repos: number;
  taux_presence: number;
  retard_moyen_minutes: number;
  lieu_pointage_stats: { [key: string]: number };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topData, setTopData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [selectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Charger les données du jour et de la semaine
  const loadDashboardData = async (date: string) => {
    setIsLoading(true);
    try {
      // Charger les données du jour actuel
      const response = await axiosInstance.get(`/analyses/date/"${date}"`);
      
      if (response.data.length > 0) {
        calculateStats(response.data);
      } else {
        setStats(null);
      }

      // Charger les données des 7 derniers jours pour l'évolution hebdomadaire
      const weeklyPromises = [];
      for (let i = 6; i >= 0; i--) {
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() - i);
        const dateStr = dateObj.toISOString().split('T')[0];
        weeklyPromises.push(
          axiosInstance.get(`/analyses/date/"${dateStr}"`)
            .then(res => ({ date: dateStr, data: res.data }))
            .catch(() => ({ date: dateStr, data: [] }))
        );
      }
      
      const weeklyResults = await Promise.all(weeklyPromises);
      setWeeklyData(weeklyResults);

      // Charger les top retardataires et absents pour les 30 derniers jours
      try {
        const currentDate = new Date(date);
        const endDate = currentDate.toISOString().split('T')[0];
        
        // Calculer la date de début (30 jours en arrière)
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 30);
        const startDateStr = startDate.toISOString().split('T')[0];
        
        const topResponse = await axiosInstance.get(`/analyses/top-retardataires-absents/${startDateStr}/${endDate}`);
        setTopData(topResponse.data);

      } catch (topError) {
        console.error('Erreur lors du chargement des top données:', topError);
        // Ne pas bloquer le chargement principal si cette requête échoue
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données du dashboard');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer les statistiques (même logique que Analyse.tsx)
  const calculateStats = (analysesData: any[]) => {
    const total = analysesData.length;
    const presents = analysesData.filter(a => a.statut_final === 'present').length;
    const absents = analysesData.filter(a => a.statut_final === 'absent').length;
    const retards = analysesData.filter(a => a.statut_final === 'retard').length;
    const sortiesAnticipees = analysesData.filter(a => a.statut_final === 'sortie_anticipee').length;
    const presentsAvecRetard = analysesData.filter(a => a.statut_final === 'present_avec_retard').length;
    const en_conge = analysesData.filter(a => a.statut_final === 'en_conge').length;
    const en_repos = analysesData.filter(a => a.statut_final === 'EN_REPOS').length;
    const totalRetardMinutes = analysesData.reduce((sum, a) => sum + a.retard_minutes, 0);
    const employesAvecRetard = retards + presentsAvecRetard;
    const retardMoyen = employesAvecRetard > 0 ? Math.round(totalRetardMinutes / employesAvecRetard) : 0;

    // Calculer les présents par lieu de pointage
    const presentsData = analysesData.filter(a => 
      a.statut_final === 'present' || 
      a.statut_final === 'present_avec_retard' || 
      a.statut_final === 'retard'
    );
    
    const lieuPointageStats = presentsData.reduce((acc: any, analyse) => {
      const lieu = analyse.lieu_pointage || 'Non défini';
      acc[lieu] = (acc[lieu] || 0) + 1;
      return acc;
    }, {});

    setStats({
      total_employes: total,
      presents,
      absents,
      retards,
      sorties_anticipees: sortiesAnticipees,
      en_conge,
      en_repos: en_repos,
      presents_avec_retard: presentsAvecRetard,
      taux_presence: total > 0 ? Math.round(((presents + retards + sortiesAnticipees + presentsAvecRetard) / (total - en_repos - en_conge)) * 100) : 0,
      retard_moyen_minutes: retardMoyen,
      lieu_pointage_stats: lieuPointageStats
    });
  };

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData(selectedDate);
  }, [selectedDate]);

  // Configuration du graphique en barres
  const barChartConfig: { series: any[]; options: ApexOptions } = {
        series: [{
      data: stats ? [
        stats.presents, 
        stats.absents, 
        stats.en_conge, 
        stats.en_repos,
        stats.retards + stats.presents_avec_retard,
        stats.sorties_anticipees
      ] : []
        }],
        options: {
          chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          distributed: true
        }
      },
      colors: ['#4caf50', '#f44336', '#ff9800', '#795548', '#ff5722', '#2196f3'],
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + " employés";
        }
      },
      xaxis: {
        categories: ['Présents', 'Absents', 'Congés', 'Repos', 'Retards', 'Sorties Anticipées']
      }
    }
  };

  // Configuration du graphique en donut pour les présents par lieu de pointage
  const donutChartConfig: { series: number[]; options: ApexOptions } = {
    series: stats && stats.lieu_pointage_stats ? Object.values(stats.lieu_pointage_stats) : [],
    options: {
      chart: {
        type: 'donut',
        height: 350,
        toolbar: { show: false }
      },
      labels: stats && stats.lieu_pointage_stats ? Object.keys(stats.lieu_pointage_stats) : [],
      colors: ['#1976d2', '#42a5f5', '#90caf9', '#ff9800', '#4caf50', '#f44336'],
      dataLabels: {
        enabled: true,
        formatter: function (_val: any, opts: any) {
          return opts.w.config.series[opts.seriesIndex] + ' employés';
        }
      },
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Présents',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      }
    }
  };

    // Configuration du graphique en aires avec données réelles
  const areaChartConfig: { series: any[]; options: ApexOptions } = {
    series: weeklyData.length > 0 ? [
      {
        name: 'Présents',
        data: weeklyData.map(day => {
          const presents = day.data.filter((a: any) => 
            a.statut_final === 'present' || 
            a.statut_final === 'present_avec_retard' || 
            a.statut_final === 'retard'
          ).length;
          return presents;
        })
      },
      {
        name: 'Absents',
        data: weeklyData.map(day => {
          const absents = day.data.filter((a: any) => a.statut_final === 'absent').length;
          return absents;
        })
      },
      {
        name: 'Retards',
        data: weeklyData.map(day => {
          const retards = day.data.filter((a: any) => 
            a.statut_final === 'retard' || 
            a.statut_final === 'present_avec_retard'
          ).length;
          return retards;
        })
      }
    ] : [],
    options: {
      chart: {
        type: 'area',
            height: 350,
        toolbar: { show: false }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1,
        }
      },
      colors: ['#81c784', '#e57373', '#ffb74d'],
          xaxis: {
        categories: weeklyData.length > 0 ? weeklyData.map(day => {
          const date = new Date(day.date);
          return date.toLocaleDateString('fr-FR', { weekday: 'short' });
        }) : []
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    }
  };

  // Configuration du graphique des top retardataires
  const topRetardatairesChartConfig: { series: any[]; options: ApexOptions } = {
    series: [{
      name: 'Retards',
      data: topData?.top_retardataires?.slice(0, 10).map((emp: any) => emp.retards) || []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true,
          distributed: false
        }
      },
      colors: ['#ff8a65'],
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + " retards";
        }
      },
      xaxis: {
        categories: topData?.top_retardataires?.slice(0, 10).map((emp: any) => 
          `${emp.nom} ${emp.prenom}`.trim() || emp.matricule
        ) || []
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },

    }
  };

  // Configuration du graphique des top absents
  const topAbsentsChartConfig: { series: any[]; options: ApexOptions } = {
    series: [{
      name: 'Absences',
      data: topData?.top_absents?.slice(0, 10).map((emp: any) => emp.absences) || []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true,
          distributed: false
        }
      },
      colors: ['#e57373'],
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + " absences";
        }
      },
      xaxis: {
        categories: topData?.top_absents?.slice(0, 10).map((emp: any) => 
          `${emp.nom} ${emp.prenom}`.trim() || emp.matricule
        ) || []
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },

    }
  };

  // Composant StatCard
  interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: number;
  }

  const StatCard = ({ title, value, icon, color, trend, trendValue }: StatCardProps) => (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.2)}`
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          backgroundColor: alpha(color, 0.15),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
          width: 'fit-content'
        }}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      </CardContent>
        </Card>
  );

  // Composant Skeleton pour le loading
  const StatsSkeleton = () => (
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
      mb: 4,
      width: '100%',
      minWidth: 0
    }}>
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Box key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Skeleton variant="circular" width={28} height={28} sx={{ mb: 1, mx: 'auto' }} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1, mx: 'auto' }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );

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
      {/* En-tête simplifié */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Cartes de statistiques */}
      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
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
          mb: 4,
          width: '100%',
          minWidth: 0
        }}>
          <StatCard 
            title="Total Employés" 
            value={stats.total_employes}
            icon={<GroupIcon sx={{ color: '#1976d2', fontSize: 28 }} />}
            color="#1976d2"
          />
          <StatCard 
            title="Présents" 
            value={stats.presents}
            icon={<EventAvailableIcon sx={{ color: '#4caf50', fontSize: 28 }} />}
            color="#4caf50"
          />
          <StatCard 
            title="Absents" 
            value={stats.absents}
            icon={<EventBusyIcon sx={{ color: '#f44336', fontSize: 28 }} />}
            color="#f44336"
          />
          <StatCard 
            title="Retards" 
            value={stats.retards + stats.presents_avec_retard}
            icon={<ScheduleIcon sx={{ color: '#ff5722', fontSize: 28 }} />}
            color="#ff5722"
          />
          <StatCard 
            title="En Congés" 
            value={stats.en_conge}
            icon={<EventBusyIcon sx={{ color: '#ff9800', fontSize: 28 }} />}
            color="#ff9800"
          />
          <StatCard 
            title="En Repos" 
            value={stats.en_repos}
            icon={<HotelIcon sx={{ color: '#795548', fontSize: 28 }} />}
            color="#795548"
          />
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune donnée disponible pour cette date
          </Typography>
        </Box>
      )}

                {/* Graphiques principaux */}
      {stats && (
        <>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr', 
              md: 'repeat(2, 1fr)' 
            },
            gap: { xs: 2, sm: 2, md: 3 },
            mb: 4,
            width: '100%',
            minWidth: 0
          }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              width: '100%',
              minWidth: 0
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Répartition par Statut
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <ReactApexChart 
                options={barChartConfig.options} 
                series={barChartConfig.series} 
                type="bar" 
                height={350} 
              />
            </Paper>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 }, 
              width: '100%',
              minWidth: 0
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Présents par Site
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <ReactApexChart 
                options={donutChartConfig.options} 
                series={donutChartConfig.series} 
                type="donut" 
                height={350} 
              />
            </Paper>
          </Box>

          {/* Graphique d'évolution */}
          <Box>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Évolution Hebdomadaire
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <ReactApexChart 
                options={areaChartConfig.options} 
                series={areaChartConfig.series} 
                type="area" 
                height={350} 
              />
            </Paper>
          </Box>

          {/* Top Retardataires et Absents */}
          {topData && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: '1fr', 
                md: 'repeat(2, 1fr)' 
              },
              gap: { xs: 2, sm: 2, md: 3 },
              mb: 4,
              width: '100%',
              minWidth: 0
            }}>
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                width: '100%',
                minWidth: 0
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Top 10 Retardataires
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <ReactApexChart 
                  options={topRetardatairesChartConfig.options} 
                  series={topRetardatairesChartConfig.series} 
                  type="bar" 
                  height={350} 
                />
              </Paper>
              
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                width: '100%',
                minWidth: 0
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Top 10 Absents
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <ReactApexChart 
                  options={topAbsentsChartConfig.options} 
                  series={topAbsentsChartConfig.series} 
                  type="bar" 
                  height={350} 
                />
              </Paper>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

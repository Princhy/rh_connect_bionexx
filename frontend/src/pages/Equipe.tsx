import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Stack,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Card,
  CardContent,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

interface Team {
  id_equipe: number;
  equipe: string;
}

interface CycleDay {
  jour: number;
  shift: 'jour' | 'nuit' | 'repos';
  deb_heure?: string;
  fin_heure?: string;
}

interface TeamSchedule {
  id_planning?: number;
  id_equipe: number;
  debut_semaine?: string;
  jours_travail?: string[];
  horaire?: string;
  deb_heure?: string;
  fin_heure?: string;
  type_planning: 'fixe' | 'cyclique';
  date_debut_cycle?: string;
  cycle_pattern?: CycleDay[];
}

interface EmployeePlanningForDate {
  travaille: boolean;
  shift?: 'jour' | 'nuit';
  deb_heure?: string;
  fin_heure?: string;
}

const JOURS_SEMAINE = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

const HORAIRES = [
  { value: 'jour', label: 'Jour' },
  { value: 'nuit', label: 'Nuit' },
  { value: 'repos', label: 'Repos' }
];

const EQUIPE_TYPES = [
  { value: 'Normal', label: 'Normal (Lundi-Vendredi)' },
  { value: 'A', label: 'Équipe A (Cyclique)' },
  { value: 'B', label: 'Équipe B (Cyclique)' },
  { value: 'C', label: 'Équipe C (Cyclique)' }
];

const TeamManager: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedules, setSchedules] = useState<TeamSchedule[]>([]);
  const [currentPlannings, setCurrentPlannings] = useState<any[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(false);

  // États pour la suppression des équipes
  const [itemDeleteTeam, setItemDeleteTeam] = useState<{ id_equipe: number } | null>(null);
  
  // États pour la modification des équipes
  const [itemEditTeam, setItemEditTeam] = useState<Team | null>(null);
  const [editTeamValue, setEditTeamValue] = useState('');
  
  // États pour le planning
  const [currentSchedule, setCurrentSchedule] = useState<TeamSchedule>({
    id_equipe: 0,
    debut_semaine: new Date().toISOString().split('T')[0],
    jours_travail: [],
    horaire: 'jour',
    deb_heure: '08:00',
    fin_heure: '17:00',
    type_planning: 'fixe',
    date_debut_cycle: new Date().toISOString().split('T')[0]
  });

  const [selectedEquipeType, setSelectedEquipeType] = useState<'Normal' | 'A' | 'B' | 'C'>('Normal');
  
  // États pour les modals
  const [openDeleteTeam, setOpenDeleteTeam] = useState(false);
  const [openEditTeam, setOpenEditTeam] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchData();
    fetchCurrentPlannings();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, schedulesRes] = await Promise.all([
        axiosInstance.get('/equipes'),
        axiosInstance.get('/plannings')
      ]);
      setTeams(teamsRes.data);
      setSchedules(schedulesRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPlannings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axiosInstance.get(`/plannings/date/${today}`);
      setCurrentPlannings(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des plannings actuels:', error);
    }
  };

  // Fonctions pour ajouter une équipe
  const handleAddTeam = async () => {
    if (!newTeam.trim()) return;
    try {
      await axiosInstance.post('/equipes', { equipe: newTeam });
      await fetchData();
      setNewTeam('');
      toast.success('Équipe ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'équipe');
    }
  };

  // Fonctions pour supprimer une équipe
  const handleDeleteTeam = async () => {
    if (!itemDeleteTeam) return;
    try {
      await axiosInstance.delete(`/equipes/${itemDeleteTeam.id_equipe}`);
      setTeams(teams.filter(team => team.id_equipe !== itemDeleteTeam.id_equipe));
      toast.success('Équipe supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'équipe');
    } finally {
      setOpenDeleteTeam(false);
      setItemDeleteTeam(null);
    }
  };

  // Fonctions pour modifier une équipe
  const handleEditTeam = async () => {
    if (!itemEditTeam || !editTeamValue.trim()) return;
    try {
      await axiosInstance.put(`/equipes/${itemEditTeam.id_equipe}`, { equipe: editTeamValue });
      await fetchData();
      toast.success('Équipe modifiée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'équipe');
    } finally {
      setOpenEditTeam(false);
      setItemEditTeam(null);
      setEditTeamValue('');
    }
  };

  // Fonctions pour le planning
  const handleSaveSchedule = async () => {
    try {
      let response;

      if (selectedEquipeType === 'Normal') {
        // Planning fixe
        if (currentSchedule.jours_travail?.length === 0) {
          toast.error('Veuillez sélectionner au moins un jour de travail');
          return;
        }

        const scheduleData = {
          id_equipe: currentSchedule.id_equipe,
          jours_travail: currentSchedule.jours_travail,
          deb_heure: currentSchedule.deb_heure,
          fin_heure: currentSchedule.fin_heure,
          debut_semaine: currentSchedule.debut_semaine
        };

        response = await axiosInstance.post('/plannings/fixe', scheduleData);
      } else {
        // Planning cyclique
        const scheduleData = {
          id_equipe: currentSchedule.id_equipe,
          equipe_type: selectedEquipeType,
          date_debut: currentSchedule.date_debut_cycle
        };

        response = await axiosInstance.post('/plannings/cyclique', scheduleData);
      }

      await fetchData();
      await fetchCurrentPlannings();
      setOpenScheduleModal(false);
      resetScheduleForm();
      toast.success('Planning créé avec succès');
    } catch (error) {
      console.error('Erreur complète:', error);
      toast.error('Erreur lors de la sauvegarde du planning');
    }
  };

  const deletePlanning = async () => {
    if (!currentSchedule.id_planning) return;
    
    try {
      await axiosInstance.delete(`/plannings/${currentSchedule.id_planning}`);
      toast.success('Planning supprimé avec succès');
      setOpenScheduleModal(false);
      resetScheduleForm();
      await fetchData();
      await fetchCurrentPlannings();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetScheduleForm = () => {
    setCurrentSchedule({
      id_equipe: 0,
      debut_semaine: new Date().toISOString().split('T')[0],
      jours_travail: [],
      horaire: 'jour',
      deb_heure: '08:00',
      fin_heure: '17:00',
      type_planning: 'fixe',
      date_debut_cycle: new Date().toISOString().split('T')[0]
    });
    setSelectedEquipeType('Normal');
    setIsEditMode(false);
  };

  // Fonctions pour ouvrir les modals
  const openEditTeamModal = (team: Team) => {
    setItemEditTeam(team);
    setEditTeamValue(team.equipe);
    setOpenEditTeam(true);
  };

  const openDeleteTeamModal = (team: Team) => {
    setItemDeleteTeam({ id_equipe: team.id_equipe });
    setOpenDeleteTeam(true);
  };

  const openScheduleModalForTeam = (team: Team) => {
    const existingSchedule = schedules.find(s => s.id_equipe === team.id_equipe);
    
    if (existingSchedule) {
      setCurrentSchedule({
        ...existingSchedule,
        debut_semaine: existingSchedule.debut_semaine?.split('T')[0] || new Date().toISOString().split('T')[0],
        date_debut_cycle: existingSchedule.date_debut_cycle?.split('T')[0] || new Date().toISOString().split('T')[0]
      });
      
      if (existingSchedule.type_planning === 'cyclique') {
        // Déterminer le type d'équipe basé sur le cycle pattern
        if (team.equipe.includes('A')) setSelectedEquipeType('A');
        else if (team.equipe.includes('B')) setSelectedEquipeType('B');
        else if (team.equipe.includes('C')) setSelectedEquipeType('C');
        else setSelectedEquipeType('Normal');
      } else {
        setSelectedEquipeType('Normal');
      }
      setIsEditMode(true);
    } else {
      setCurrentSchedule({
        ...currentSchedule,
        id_equipe: team.id_equipe
      });
      setIsEditMode(false);
    }
    setOpenScheduleModal(true);
  };

  const handleJourChange = (jour: string, checked: boolean) => {
    if (checked) {
      setCurrentSchedule({
        ...currentSchedule,
        jours_travail: [...(currentSchedule.jours_travail || []), jour]
      });
    } else {
      setCurrentSchedule({
        ...currentSchedule,
        jours_travail: currentSchedule.jours_travail?.filter(j => j !== jour) || []
      });
    }
  };

  const getTeamSchedule = (teamId: number) => {
    return schedules.find(s => s.id_equipe === teamId);
  };

  const getCurrentTeamPlanning = (teamId: number) => {
    return currentPlannings.find(p => p.id_equipe === teamId);
  };

  const formatCyclePattern = (pattern?: CycleDay[]) => {
    if (!pattern) return 'Aucun pattern défini';
    
    const cycleDescription = pattern.map((day, index) => {
      const dayNum = index + 1;
      if (day.shift === 'repos') return `J${dayNum}: Repos`;
      return `J${dayNum}: ${day.shift === 'jour' ? 'Jour' : 'Nuit'} (${day.deb_heure}-${day.fin_heure})`;
    }).join(' | ');
    
    return cycleDescription;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      {loading && <LinearProgress />}
      
      {/* Section plannings actuels */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Plannings d'aujourd'hui ({new Date().toLocaleDateString('fr-FR')})
          </Typography>
          <IconButton onClick={fetchCurrentPlannings} sx={{ ml: 1 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {currentPlannings.map((planning) => (
            <Card key={planning.id_equipe} sx={{ minWidth: 200 }}>
              <CardContent sx={{ pb: 2 }}>
                <Typography variant="h6" color="primary">
                  {planning.equipe?.equipe}
                </Typography>
                {planning.planning.travaille ? (
                  <Box>
                    <Chip 
                      label={planning.planning.shift === 'jour' ? 'Jour' : 'Nuit'} 
                      color={planning.planning.shift === 'jour' ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {planning.planning.deb_heure} - {planning.planning.fin_heure}
                    </Typography>
                  </Box>
                ) : (
                  <Chip label="Repos" color="default" size="small" />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Section Équipes */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des équipes et plannings
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Nouvelle équipe"
            size="small"
          />
          <Button variant="contained" color='secondary' onClick={handleAddTeam}>
            Ajouter
          </Button>
        </Stack>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Équipe</TableCell>
                <TableCell>Type de planning</TableCell>
                <TableCell>Détails planning</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => {
                const schedule = getTeamSchedule(team.id_equipe);
                return (
                  <TableRow key={team.id_equipe}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {team.equipe}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {schedule ? (
                        <Chip 
                          label={schedule.type_planning === 'fixe' ? 'Fixe' : 'Cyclique'} 
                          color={schedule.type_planning === 'fixe' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      ) : (
                        <Chip label="Non défini" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {schedule ? (
                        <Box>
                          {schedule.type_planning === 'fixe' ? (
                            <>
                              <Typography variant="body2">
                                {schedule.jours_travail?.join(', ')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {schedule.horaire} ({schedule.deb_heure} - {schedule.fin_heure})
                              </Typography>
                            </>
                          ) : (
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                Cycle de 6 jours depuis le {schedule.date_debut_cycle?.split('T')[0]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatCyclePattern(schedule.cycle_pattern)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Aucun planning défini
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openScheduleModalForTeam(team)}
                        color="info"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <ScheduleIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openEditTeamModal(team)}
                        color="secondary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteTeamModal(team)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de confirmation de suppression */}
      <Dialog open={openDeleteTeam} onClose={() => setOpenDeleteTeam(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action supprimera également son planning.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteTeam(false)}>Annuler</Button>
          <Button onClick={handleDeleteTeam} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={openEditTeam} onClose={() => setOpenEditTeam(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'équipe</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editTeamValue}
            onChange={(e) => setEditTeamValue(e.target.value)}
            placeholder="Nom de l'équipe"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditTeam(false)}>Annuler</Button>
          <Button onClick={handleEditTeam} color="secondary" variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de planning */}
      <Dialog open={openScheduleModal} onClose={() => setOpenScheduleModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Modifier le planning' : 'Créer un planning'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {!isEditMode && (
              <FormControl fullWidth>
                <InputLabel>Type d'équipe</InputLabel>
                <Select
                  value={selectedEquipeType}
                  label="Type d'équipe"
                  onChange={(e) => setSelectedEquipeType(e.target.value as 'Normal' | 'A' | 'B' | 'C')}
                >
                  {EQUIPE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedEquipeType === 'Normal' ? (
              // Planning fixe
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Planning fixe (Équipe normale)
                </Typography>
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Début de semaine"
                    type="date"
                    value={currentSchedule.debut_semaine}
                    onChange={(e) => setCurrentSchedule({
                      ...currentSchedule,
                      debut_semaine: e.target.value
                    })}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      label="Heure de début"
                      type="time"
                      value={currentSchedule.deb_heure}
                      onChange={(e) => setCurrentSchedule({
                        ...currentSchedule,
                        deb_heure: e.target.value
                      })}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Heure de fin"
                      type="time"
                      value={currentSchedule.fin_heure}
                      onChange={(e) => setCurrentSchedule({
                        ...currentSchedule,
                        fin_heure: e.target.value
                      })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Jours de travail
                    </Typography>
                    <FormGroup row>
                      {JOURS_SEMAINE.map((jour) => (
                        <FormControlLabel
                          key={jour}
                          control={
                            <Checkbox
                              checked={currentSchedule.jours_travail?.includes(jour) || false}
                              onChange={(e) => handleJourChange(jour, e.target.checked)}
                            />
                          }
                          label={jour}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Stack>
              </Box>
            ) : (
              // Planning cyclique
              <Box>
                <Typography variant="h6" gutterBottom color="secondary">
                  Planning cyclique - Équipe {selectedEquipeType}
                </Typography>
                
                <TextField
                  fullWidth
                  label="Date de début du cycle"
                  type="date"
                  value={currentSchedule.date_debut_cycle}
                  onChange={(e) => setCurrentSchedule({
                    ...currentSchedule,
                    date_debut_cycle: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Le cycle se répète automatiquement tous les 6 jours"
                />

                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Pattern du cycle (6 jours) - Équipe {selectedEquipeType}
                    </Typography>
                    
                    {selectedEquipeType === 'A' && (
                      <Stack spacing={1}>
                        <Typography variant="body2">• Jour 1-2: <strong>Jour</strong> (6h00-18h00)</Typography>
                        <Typography variant="body2">• Jour 3-4: <strong>Nuit</strong> (18h00-6h00)</Typography>
                        <Typography variant="body2">• Jour 5-6: <strong>Repos</strong></Typography>
                      </Stack>
                    )}
                    
                    {selectedEquipeType === 'B' && (
                      <Stack spacing={1}>
                        <Typography variant="body2">• Jour 1-2: <strong>Nuit</strong> (18h00-6h00)</Typography>
                        <Typography variant="body2">• Jour 3-4: <strong>Repos</strong></Typography>
                        <Typography variant="body2">• Jour 5-6: <strong>Jour</strong> (6h00-18h00)</Typography>
                      </Stack>
                    )}
                    
                    {selectedEquipeType === 'C' && (
                      <Stack spacing={1}>
                        <Typography variant="body2">• Jour 1-2: <strong>Repos</strong></Typography>
                        <Typography variant="body2">• Jour 3-4: <strong>Jour</strong> (6h00-18h00)</Typography>
                        <Typography variant="body2">• Jour 5-6: <strong>Nuit</strong> (18h00-6h00)</Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScheduleModal(false)}>Annuler</Button>
          {isEditMode && (
            <Button onClick={deletePlanning} color="error" variant="contained">
              Supprimer
            </Button>
          )}
          <Button onClick={handleSaveSchedule} color="secondary" variant="contained">
            {isEditMode ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeamManager;
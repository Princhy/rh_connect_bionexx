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
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

interface Location {
  id_lieu: number;
  lieu: string;
}

interface Department {
  id_departement: number;
  departement: string;
}

const ReferenceManager: React.FC = () => {
  const [lieux, setLieux] = useState<Location[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newLieux, setNewLieux] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  // États pour la suppression
  const [itemDeleteLieux, setItemDeleteLieux] = useState<{ id_lieu: number } | null>(null);
  const [itemDeleteDepartment, setItemDeleteDepartment] = useState<{ id_departement: number } | null>(null);
  
  // États pour la modification
  const [itemEditLieux, setItemEditLieux] = useState<Location | null>(null);
  const [itemEditDepartment, setItemEditDepartment] = useState<Department | null>(null);
  const [editLieuxValue, setEditLieuxValue] = useState('');
  const [editDepartmentValue, setEditDepartmentValue] = useState('');
  
  // États pour les modals
  const [openDeleteLieux, setOpenDeleteLieux] = useState(false);
  const [openDeleteDepartement, setOpenDeleteDepartement] = useState(false);
  const [openEditLieux, setOpenEditLieux] = useState(false);
  const [openEditDepartement, setOpenEditDepartement] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lieuRes, departmentsRes] = await Promise.all([
        axiosInstance.get('/lieux'),
        axiosInstance.get('/departements')
      ]);
      setLieux(lieuRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour ajouter
  const handleAddLocation = async () => {
    if (!newLieux.trim()) return;
    try {
      await axiosInstance.post('/lieux', { lieu: newLieux });
      await fetchData();
      setNewLieux('');
      toast.success('Lieu ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du lieu');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return;
    try {
      await axiosInstance.post('/departements', { departement: newDepartment });
      await fetchData();
      setNewDepartment('');
      toast.success('Département ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du département');
    }
  };

  // Fonctions pour supprimer
  const handleDeleteLieux = async () => {
    if (!itemDeleteLieux) return;
    try {
      await axiosInstance.delete(`/lieux/${itemDeleteLieux.id_lieu}`);
      setLieux(lieux.filter(lieu => lieu.id_lieu !== itemDeleteLieux.id_lieu));
      toast.success('Lieu supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du lieu');
    } finally {
      setOpenDeleteLieux(false);
      setItemDeleteLieux(null);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!itemDeleteDepartment) return;
    try {
      await axiosInstance.delete(`/departements/${itemDeleteDepartment.id_departement}`);
      setDepartments(departments.filter(department => department.id_departement !== itemDeleteDepartment.id_departement));
      toast.success('Département supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du département');
    } finally {
      setOpenDeleteDepartement(false);
      setItemDeleteDepartment(null);
    }
  };

  // Fonctions pour modifier
  const handleEditLieux = async () => {
    if (!itemEditLieux || !editLieuxValue.trim()) return;
    try {
      await axiosInstance.put(`/lieux/${itemEditLieux.id_lieu}`, { lieu: editLieuxValue });
      await fetchData();
      toast.success('Lieu modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification du lieu');
    } finally {
      setOpenEditLieux(false);
      setItemEditLieux(null);
      setEditLieuxValue('');
    }
  };

  const handleEditDepartment = async () => {
    if (!itemEditDepartment || !editDepartmentValue.trim()) return;
    try {
      await axiosInstance.put(`/departements/${itemEditDepartment.id_departement}`, { departement: editDepartmentValue });
      await fetchData();
      toast.success('Département modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification du département');
    } finally {
      setOpenEditDepartement(false);
      setItemEditDepartment(null);
      setEditDepartmentValue('');
    }
  };

  // Fonctions pour ouvrir les modals de modification
  const openEditLieuxModal = (lieu: Location) => {
    setItemEditLieux(lieu);
    setEditLieuxValue(lieu.lieu);
    setOpenEditLieux(true);
  };

  const openEditDepartmentModal = (department: Department) => {
    setItemEditDepartment(department);
    setEditDepartmentValue(department.departement);
    setOpenEditDepartement(true);
  };

  // Fonctions pour ouvrir les modals de suppression
  const openDeleteLieuxModal = (lieu: Location) => {
    setItemDeleteLieux({ id_lieu: lieu.id_lieu });
    setOpenDeleteLieux(true);
  };

  const openDeleteDepartmentModal = (department: Department) => {
    setItemDeleteDepartment({ id_departement: department.id_departement });
    setOpenDeleteDepartement(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      {loading && <LinearProgress />}
      
      <Box sx={{ display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3 }}>
        {/* Section Lieux */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des lieux
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              value={newLieux}
              onChange={(e) => setNewLieux(e.target.value)}
              placeholder="Nouveau lieu"
              size="small"
            />
            <Button variant="contained" color='secondary' onClick={handleAddLocation}>
              Ajouter
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lieux.map((lieu) => (
                  <TableRow key={lieu.id_lieu}>
                    <TableCell>{lieu.lieu}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditLieuxModal(lieu)}
                        color="secondary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteLieuxModal(lieu)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Section Départements */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des départements
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Nouveau département"
              size="small"
            />
            <Button variant="contained" color='secondary' onClick={handleAddDepartment}>
              Ajouter
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id_departement}>
                    <TableCell>{department.departement}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditDepartmentModal(department)}
                        color="secondary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDepartmentModal(department)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Modal de confirmation de suppression - Lieux */}
      <Dialog open={openDeleteLieux} onClose={() => setOpenDeleteLieux(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce lieu ? On ne peut pas effacer si un employé est rattaché à ce lieu.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteLieux(false)}>Annuler</Button>
          <Button onClick={handleDeleteLieux} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmation de suppression - Départements */}
      <Dialog open={openDeleteDepartement} onClose={() => setOpenDeleteDepartement(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce département ? On ne peut pas effacer si un employé est rattaché à ce département.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDepartement(false)}>Annuler</Button>
          <Button onClick={handleDeleteDepartment} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de modification - Lieux */}
      <Dialog open={openEditLieux} onClose={() => setOpenEditLieux(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le lieu</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editLieuxValue}
            onChange={(e) => setEditLieuxValue(e.target.value)}
            placeholder="Nom du lieu"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditLieux(false)}>Annuler</Button>
          <Button onClick={handleEditLieux} color="primary" variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de modification - Départements */}
      <Dialog open={openEditDepartement} onClose={() => setOpenEditDepartement(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le département</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editDepartmentValue}
            onChange={(e) => setEditDepartmentValue(e.target.value)}
            placeholder="Nom du département"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDepartement(false)}>Annuler</Button>
          <Button onClick={handleEditDepartment} color="primary" variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReferenceManager;
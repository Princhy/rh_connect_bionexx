import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { useAuth } from '../config/authConfig';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface RoleBasedActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export default function RoleBasedActions({ 
  onAdd, 
  onEdit, 
  onDelete, 
  onView 
}: RoleBasedActionsProps) {
  const { user, hasRole, hasAnyRole } = useAuth();

  if (!user) return null;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Actions disponibles pour {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {/* Actions Admin et RH */}
        {hasAnyRole(['Admin', 'RH']) && (
          <>
            {onAdd && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAdd}
                size="small"
              >
                Ajouter
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EditIcon />}
                onClick={onEdit}
                size="small"
              >
                Modifier
              </Button>
            )}
          </>
        )}

        {/* Actions Admin uniquement */}
        {hasRole('Admin') && onDelete && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            size="small"
          >
            Supprimer
          </Button>
        )}

        {/* Actions pour tous les rôles */}
        {onView && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={onView}
            size="small"
          >
            Voir
          </Button>
        )}
      </Box>

      {/* Affichage des permissions */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Permissions actuelles :
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
          {hasRole('Admin') && (
            <Chip label="Admin complet" size="small" color="error" />
          )}
          {hasRole('RH') && (
            <Chip label="RH (limitations backend)" size="small" color="secondary" />
          )}
          {hasRole('Superviseur') && (
            <Chip label="Superviseur" size="small" color="warning" />
          )}
          {hasRole('Employe') && (
            <Chip label="Employé" size="small" color="info" />
          )}
        </Box>
      </Box>
    </Paper>
  );
}

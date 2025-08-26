import { Box, Typography, Chip, Paper } from '@mui/material';
import { useAuth } from '../config/authConfig';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';

interface RoleInfoProps {
  showDetails?: boolean;
}

export default function RoleInfo({ showDetails = false }: RoleInfoProps) {
  const { user, hasRole } = useAuth();

  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <AdminPanelSettingsIcon />;
      case 'RH':
        return <WorkIcon />;
      case 'Superviseur':
        return <SupervisorAccountIcon />;
      case 'Employe':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'RH':
        return 'secondary';
      case 'Superviseur':
        return 'warning';
      case 'Employe':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'Admin':
        return [
          'Gestion complète des employés',
          'Gestion des références',
          'Gestion des équipes',
          'Accès aux analyses',
          'Gestion des pointages',
          'Gestion des congés'
        ];
      case 'RH':
        return [
          'Gestion complète des employés',
          'Gestion des références',
          'Gestion des équipes',
          'Accès aux analyses',
          'Gestion des pointages',
          'Gestion des congés',
          'Accès limité à certaines actions'
        ];
      case 'Superviseur':
        return [
          'Gestion des employés',
          'Accès aux analyses',
          'Gestion des congés'
        ];
      case 'Employe':
        return [
          'Consultation du dashboard',
          'Gestion de ses congés',
          'Accès à ses analyses personnelles'
        ];
      default:
        return [];
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {getRoleIcon(user.role)}
        <Box>
          <Typography variant="h6" component="h2">
            {user.prenom} {user.nom}
          </Typography>
          <Chip 
            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            color={getRoleColor(user.role) as any}
            size="small"
          />
        </Box>
      </Box>

      {showDetails && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Permissions :
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {getRolePermissions(user.role).map((permission, index) => (
              <Chip
                key={index}
                label={permission}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}

import { 
  Box, Divider, Drawer, IconButton, List, 
  ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Tooltip, Typography 
} from '@mui/material';
import { useTheme, alpha, darken } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import DetailsIcon from '@mui/icons-material/Details';
import PersonIcon from '@mui/icons-material/Person';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
//import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAuth } from '../config/authConfig';
//import ReferenceManager from '../pages/ref';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

// Configuration des menus par rôle
const MENU_CONFIG = {
  Admin: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
    { path: '/ref', label: 'Références', icon: <LocationCityIcon /> },
    { path: '/equipes', label: 'Equipes', icon: <Diversity3TwoToneIcon /> },
    { path: '/pointages', label: 'Pointages', icon: <FingerprintIcon /> },
    { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
    { path: '/analyse-employe', label: 'Analyse Individuelle', icon: <PersonIcon /> },
    { path: '/analyse-periode', label: 'Analyse par Période', icon: <DetailsIcon /> },
    { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
  ],
  RH: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
    { path: '/ref', label: 'Références', icon: <LocationCityIcon /> },
    { path: '/equipes', label: 'Equipes', icon: <Diversity3TwoToneIcon /> },
    { path: '/pointages', label: 'Pointages', icon: <FingerprintIcon /> },
    { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
    { path: '/analyse-employe', label: 'Analyse Individuelle', icon: <PersonIcon /> },
    { path: '/analyse-periode', label: 'Analyse par Période', icon: <DetailsIcon /> },
    { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
  ],
  Superviseur: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
    { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
    { path: '/analyse-employe', label: 'Analyse Individuelle', icon: <PersonIcon /> },
    { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
  ],
  Employe: [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/analyse-employe', label: 'Analyse Individuelle', icon: <PersonIcon /> },
    { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
  ]
};

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const drawerWidth = expanded ? 240 : 64;
  const theme = useTheme();
  const green = theme.palette.success.main;
  const base = darken(green, 0.45);
  const mid = darken(green, 0.55);
  const deep = darken(green, 0.7);

  // Déterminer les éléments de menu selon le rôle
  const getNavItems = () => {
    if (!user) return MENU_CONFIG.Employe; // Par défaut
    
    switch (user.role) {
      case 'Admin':
        return MENU_CONFIG.Admin;
      case 'RH':
        return MENU_CONFIG.RH;
      case 'Superviseur':
        return MENU_CONFIG.Superviseur;
      case 'Employe':
        return MENU_CONFIG.Employe;
      default:
        return MENU_CONFIG.Employe;
    }
  };

  const NAV_ITEMS = getNavItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'transparent',
          backgroundImage: `
            repeating-linear-gradient(115deg, ${alpha('#ffffff', 0.06)} 0 1px, transparent 1px 6px),
            repeating-radial-gradient(circle at 30% 15%, ${alpha('#000', 0.12)} 0 1px, transparent 1px 5px),
            linear-gradient(180deg, ${alpha('#ffffff', 0.05)} 0%, ${alpha('#ffffff', 0)} 40%),
            linear-gradient(180deg, ${base} 0%, ${mid} 45%, ${deep} 100%)
          `,
          backgroundBlendMode: 'overlay, overlay, screen, normal',
          color: theme.palette.common.white,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          border: 'none',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: expanded ? 'space-between' : 'center',
        p: 2,
        minHeight: 64
      }}>
        {expanded ? (
          <>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                RH CONNECT
              </Typography>
              {user && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              )}
            </Box>
            <IconButton onClick={onToggle} color="inherit">
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={onToggle} color="inherit">
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!expanded ? item.label : ''} 
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: expanded ? 'initial' : 'center',
                  px: 2.5,
                  position: 'relative',
                  borderRadius: 1,
                  '&:hover': { bgcolor: alpha(green, 0.12) },
                  '&.Mui-selected': {
                    bgcolor: alpha(green, 0.16),
                    color: theme.palette.common.white,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: green,
                    },
                    '&:hover': { bgcolor: alpha(green, 0.22) }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  mr: expanded ? 3 : 'auto',
                  color: 'inherit',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {expanded && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}
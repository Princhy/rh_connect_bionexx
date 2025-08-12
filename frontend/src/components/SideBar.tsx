import { 
  Box, Divider, Drawer, IconButton, List, 
  ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Tooltip, Typography 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import DetailsIcon from '@mui/icons-material/Details';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
//import ReferenceManager from '../pages/ref';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
  { path: '/ref', label: 'Références', icon: <LocationCityIcon /> },
  {path:'/equipes', label: 'Equipes', icon: <Diversity3TwoToneIcon />},
  {path:'/pointages', label: 'Pointages', icon: <FingerprintIcon />},
  {path:'/analyses', label: 'Analyses', icon: <DetailsIcon /> },
  {path:'/conges', label:'Congés', icon:<InsertInvitationIcon/>}
];

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = expanded ? 240 : 64;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'white',
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
            <Typography variant="h6"></Typography>
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
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    }
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
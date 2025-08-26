import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../config/authConfig';
import { useTheme, alpha, darken } from '@mui/material/styles';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const theme = useTheme();

  const success = theme.palette.success.main;
  const base = darken(success, 0.3);
  const mid = darken(success, 0.4);
  const deep = darken(success, 0.55);


  const handleLogout = () => {
  logout();
  navigate('/');
};
  return (
    <AppBar 
      position="fixed"
      sx={{
        color: 'common.white',
        backgroundColor: 'transparent',
        backgroundImage: `
          repeating-radial-gradient(circle at 20% 50%, ${alpha('#000', 0.12)} 0 1px, transparent 1px 4px),
          repeating-radial-gradient(circle at 80% 50%, ${alpha('#000', 0.1)} 0 1px, transparent 1px 4px),
          linear-gradient(135deg, ${alpha('#ffffff', 0.08)} 0%, ${alpha('#ffffff', 0)} 40%),
          linear-gradient(90deg, ${base} 0%, ${mid} 50%, ${deep} 100%)
        `,
        backgroundBlendMode: 'overlay, overlay, screen, normal',
        boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <Container 
        sx={{mx: 0,width:'100%', maxWidth: '100%!important'}}>
        <Toolbar disableGutters sx={{ paddingLeft:10 }}>
          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'common.white',
              textDecoration: 'none',
              fontSize: '1.5rem',
            }}
          >
           RH-CONNECT
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Dashboard
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'right' }}>
                  {user.prenom} {user.nom}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'right', display: 'block' }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Box>
            )}
            <Tooltip title="Paramètres utilisateur">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={user ? `${user.prenom} ${user.nom}` : "Utilisateur"} 
                  sx={{ 
                    bgcolor: 'success.main',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>Aides</Typography>
                </MenuItem>
                
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                </MenuItem>
                
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    <Button onClick={handleLogout} color='error' variant='outlined'>
                      Deconnexion</Button>
                  </Typography>
                </MenuItem>
            
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

import * as React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from '../config/authConfig';
import { useEffect } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark' pour le mode sombre
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});


export default function DashboardLayoutSidebarCollapsed() {
  const { hasRole,user } = useAuth();
  useEffect(() => {
    console.log(user);
  },[]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' ,paddingTop:'64px'}}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Dashboard</h1>
          <p>Contenu du dashboard...</p>
        <p> bienvenue {user?.nom} {user?.prenom} dans departement {user?.id_departement}</p>
          {hasRole('Admin') && <p>Admin</p>}
          {hasRole('RH') && <p>RH</p>}
          {hasRole('Superviseur') && <p>Superviseur</p>}
          {hasRole('Employe') && <p>Employe</p>}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
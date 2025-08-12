import * as React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' ,paddingTop:'64px'}}>
        <p>Dashobard</p>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
}
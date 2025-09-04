import * as React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import ResponsiveAppBar from '../components/AppBar';

export default function AdminLayout() {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
      <Box sx={{ 
        flexGrow: 1,
        
        transition: 'margin-left 0.3s ease'
      }}>
        <ResponsiveAppBar />
        <Box component="main" sx={{ 
          p: 3,
          maxWidth: '100%',
          width: '100%',
          '@media (min-width: 1200px)': {
            maxWidth: '100%',
            width: '100%'
          },
          '@media (min-width: 1536px)': {
            maxWidth: '100%',
            width: '100%'
          },
          '@media (min-width: 1920px)': {
            maxWidth: '100%',
            width: '100%'
          }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
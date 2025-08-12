import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastNotification } from './components/ToastNotification';
import AdminLayout from './layouts/adminlayout'
import { AuthProvider } from './config/authConfig';
import ProtectedRoute from './config/protectedRoute';

// Lazy loading des pages
const LoginPage = lazy(() => import('./pages/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const RegisterPage = lazy(() => import('./pages/Register'));
const EmployePage = lazy(() => import('./pages/Employe'));
const ReferenceManager = lazy(() => import('./pages/ref'));
const TeamManager = lazy(() => import('./pages/Equipe'));
const Pointage = lazy(()=> import('./pages/Pointage'));
const Analyse = lazy(()=>import('./pages/Analyse'));
const Conges= lazy(()=>import('./pages/Conge'))
const theme = createTheme({
  palette: {
    primary: {
      main: '#c7dac7',
    },
    secondary: {
      main: '#378047',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider >
      <Router>
        <Suspense fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress color='secondary'/>
          </Box>
        }>
          <Routes>
            {/* Pages publiques (sans sidebar) */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Pages admin (avec sidebar) */}
            <Route element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute> 
                }>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employe" element={<EmployePage />} />
              <Route path="employe/register" element={<RegisterPage />} />
              <Route path="/ref" element={<ReferenceManager />} />
              <Route path="/equipes" element={<TeamManager />} />
              <Route path='/pointages' element={<Pointage/>} />
              <Route path='/analyses' element={<Analyse/>} />
              <Route path='/conges' element={<Conges/>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      </AuthProvider>
      <ToastNotification />
    </ThemeProvider>
  );
}

export default App;
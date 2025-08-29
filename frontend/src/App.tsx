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
const Conges= lazy(()=>import('./pages/Conge'));
const AnalyseEmploye = lazy(()=>import('./pages/AnalyseEmploye'));
const AnalysePeriode = lazy(()=>import('./pages/AnalysePeriode'));
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized'));
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Pages protégées (avec sidebar) */}
            <Route element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute> 
                }>
              {/* Dashboard - accessible à tous les rôles */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Pages Admin et RH uniquement */}
              <Route path="/equipes" element={
                <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur']}>
                  <TeamManager />
                </ProtectedRoute>
              } />
              <Route path="employe/register" element={
                <ProtectedRoute allowedRoles={['Admin', 'RH']}>
                  <RegisterPage />
                </ProtectedRoute>
              } />
              <Route path="/ref" element={
                <ProtectedRoute allowedRoles={['Admin', 'RH']}>
                  <ReferenceManager />
                </ProtectedRoute>
              } />
              
              {/* Pages Admin, RH et Superviseur */}
            
               <Route path="/employe" element={
                <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur']}>
                  <EmployePage />
                </ProtectedRoute>
              } />
              {/* Pages Admin, RH, Superviseur et Employé */}
              <Route path='/analyses' element={
                <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur', 'Employe']}>
                  <Analyse/>
                </ProtectedRoute>
              } />
              
              {/* Pages Admin et RH uniquement */}
              <Route path='/pointages' element={
                <ProtectedRoute allowedRoles={['Admin', 'RH']}>
                  <Pointage/>
                </ProtectedRoute>
              } />
              
              {/* Pages accessibles à tous les rôles connectés */}
              <Route path='/conges' element={<Conges/>} />
              <Route path='/analyse-employe' element={
                <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur', 'Employe']}>
                  <AnalyseEmploye/>
                </ProtectedRoute>
              } />
              <Route path='/analyse-periode' element={
                <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur', 'Employe']}>
                  <AnalysePeriode/>
                </ProtectedRoute>
              } />
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
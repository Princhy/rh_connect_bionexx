import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  useTheme
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import axiosInstance from '../config/axiosConfig';
import { setInstanceTokens } from '../config/axiosConfig';
import { useAuth} from '../config/authConfig';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/login', { email, password });
      
      // Post-connexion
      localStorage.setItem('authToken', data.token);
      setInstanceTokens(data.token);
      login();
      toast.success(`Bienvenue ${data.user.prenom} !`, {
        autoClose: 2000,
      
      });
      navigate('/dashboard')
      

    } catch (error: any) {
      const message = error.response?.data?.message 
        || "Mot de passe incorrect";
      toast.error(message);
      localStorage.removeItem('authToken');
      setInstanceTokens();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
        p: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        maxWidth: 900,
        width: '100%',
        boxShadow: 6,
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        {/* Section Texte de Bienvenue */}
        <Box sx={{
          flex: 1,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Bienvenue sur RH CONNECT
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Système de Gestion RH
          </Typography>
          <Typography variant='h6' sx={{ mb: 4 }}>
            Connectez-vous pour accéder à votre espace personnel et gérer vos équipes.
          </Typography>
          
          <Typography sx={{ mt: 2, fontStyle: 'italic' }}>
            Powered by Bionexx IT
          </Typography>
        </Box>

        {/* Section Formulaire */}
        <Box sx={{ 
          flex: 1,
          backgroundColor: 'background.paper'
        }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LockIcon sx={{ 
                color: 'success.main', 
                fontSize: 40, 
                mb: 2 
              }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Connexion
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 4 }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <Typography sx={{ 
              mt: 3, 
              textAlign: 'center', 
              color: 'text.secondary',
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            }}>
              Pas de compte ? <a href="/register">Créez un compte</a> <br /> ou bien
              <a href="#"> contactez l'administrateur</a>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
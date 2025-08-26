import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Accès Refusé
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Retour au Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}


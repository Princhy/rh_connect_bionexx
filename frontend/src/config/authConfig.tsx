// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from './axiosConfig';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    toast.info('Vous avez été déconnecté.')
    try{
      axiosInstance.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Faire un appel à une route protégée pour vérifier l'auth
        const response = await axiosInstance.post('/refreshToken', {}, { withCredentials: true });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          // Optionnel: sauvegarder le nouveau token
          if (response.data.accessToken) {
            localStorage.setItem('authToken', response.data.accessToken);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.log('Échec de l\'authentification:', err);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};


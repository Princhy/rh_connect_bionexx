// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from './axiosConfig';
import { toast } from 'react-toastify';
import type { IUser } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  const login = (userData: IUser) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.info('Vous avez été déconnecté.')
    try{
      axiosInstance.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role);
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
          
          // Récupérer les données utilisateur si disponibles
          if (response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
          } else {
            // Essayer de récupérer les données utilisateur depuis le localStorage
            const savedUser = localStorage.getItem('userData');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.log('Échec de l\'authentification:', err);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      user, 
      login, 
      logout, 
      hasRole, 
      hasAnyRole 
    }}>
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


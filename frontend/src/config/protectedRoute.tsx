// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './authConfig';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user, hasAnyRole } = useAuth();

  if (loading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si des rôles sont spécifiés, vérifier que l'utilisateur a un des rôles autorisés
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
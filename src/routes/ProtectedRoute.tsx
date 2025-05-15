
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const { authenticated, role } = useAuthStore();
  
  // Check if user is authenticated
  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // If roles are specified, check if user has the required role
  if (roles.length > 0 && role) {
    const hasRequiredRole = roles.includes(role);
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

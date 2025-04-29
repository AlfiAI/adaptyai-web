
import React, { ReactNode } from 'react';
import { RouteGuard } from '@/components/auth/RouteGuard';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'editor' | 'viewer')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = ['viewer', 'editor', 'admin'] 
}) => {
  return (
    <RouteGuard requiredRoles={requiredRoles}>
      {children}
    </RouteGuard>
  );
};

export default ProtectedRoute;

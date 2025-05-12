
import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'editor' | 'viewer')[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRoles = ['viewer', 'editor', 'admin'] 
}) => {
  const { user, loading } = useAuth();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setHasRequiredRole(false);
        setCheckingRole(false);
        return;
      }

      try {
        // Check if user has any of the required roles
        for (const role of requiredRoles) {
          const { data, error } = await supabase.rpc('has_role', { _role: role });
          
          if (error) {
            console.error('Error checking role:', error);
            continue;
          }
          
          if (data === true) {
            setHasRequiredRole(true);
            break;
          }
        }
        
        // If we've checked all roles and none matched
        setCheckingRole(false);
      } catch (error) {
        console.error('Error checking user roles:', error);
        setHasRequiredRole(false);
        setCheckingRole(false);
      }
    };

    if (user) {
      checkUserRole();
    } else {
      setCheckingRole(loading);
    }
  }, [user, loading, requiredRoles]);

  if (loading || checkingRole) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-adapty-aqua" />
        <p className="mt-4 text-gray-400">Checking authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRoles.length > 0 && hasRequiredRole === false) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;

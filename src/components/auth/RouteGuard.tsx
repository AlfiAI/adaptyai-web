
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { UserProfile } from '@/lib/dataAccess/types';
import { getUserRepository } from '@/lib/dataAccess/factory';

interface RouteGuardProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'editor' | 'viewer')[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRoles = ['viewer', 'editor', 'admin'] 
}) => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }
      
      try {
        const userRepository = getUserRepository();
        const profile = await userRepository.getById(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse-glow h-16 w-16 rounded-full border-2 border-adapty-aqua flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-adapty-aqua border-opacity-50 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-400">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRoles.length > 0 && userProfile && !requiredRoles.includes(userProfile.role as any)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;

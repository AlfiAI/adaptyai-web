
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/components/auth/AuthProvider';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <PageContainer>
      <Section className="flex flex-col items-center justify-center min-h-[70vh]">
        <LoginForm />
      </Section>
    </PageContainer>
  );
};

export default Auth;

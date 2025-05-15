
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

export const AgentProfileNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <Section>
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold">Agent Not Found</h1>
          <p className="text-muted-foreground">We couldn't find the agent you're looking for.</p>
          <Button onClick={() => navigate('/agents')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agent Directory
          </Button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default AgentProfileNotFound;

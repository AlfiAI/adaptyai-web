
import React from 'react';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

export const AgentProfileLoading: React.FC = () => {
  return (
    <PageContainer>
      <Section className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
          <p className="text-muted-foreground">Loading agent profile...</p>
        </div>
      </Section>
    </PageContainer>
  );
};

export default AgentProfileLoading;

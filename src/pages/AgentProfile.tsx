
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { getAgentRepository } from '@/lib/dataAccess';
import AgentProfileHeader from '@/components/agents/AgentProfileHeader';
import AgentFeatures from '@/components/agents/AgentFeatures';
import AgentFAQs from '@/components/agents/AgentFAQs';
import AgentProfileLoading from '@/components/agents/AgentProfileLoading';
import AgentProfileNotFound from '@/components/agents/AgentProfileNotFound';
import AgentProfileError from '@/components/agents/AgentProfileError';
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { setupSmoothScrolling } from '@/utils/scrollUtils';

const AgentProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const agentRepo = getAgentRepository();

  // Query for agent data
  const {
    data: agent,
    isLoading: isLoadingAgent,
    error: agentError
  } = useQuery({
    queryKey: ['agent', slug],
    queryFn: async () => {
      try {
        if (!slug) throw new Error('No agent slug provided');
        console.log('Loading agent with slug:', slug);
        const agent = await agentRepo.getBySlug(slug);
        console.log('Agent loaded:', agent);
        if (!agent) throw new Error('Agent not found');
        return agent;
      } catch (error) {
        console.error('Error fetching agent:', error);
        throw error;
      }
    }
  });

  // Query for agent features
  const {
    data: features = [],
    isLoading: isLoadingFeatures
  } = useQuery({
    queryKey: ['agent-features', agent?.id],
    queryFn: async () => {
      if (!agent?.id) return [];
      console.log('Loading features for agent:', agent.id);
      const features = await agentRepo.getFeatures(agent.id);
      console.log('Features loaded:', features);
      return features;
    },
    enabled: !!agent?.id
  });

  // Query for agent FAQs
  const {
    data: faqs = [],
    isLoading: isLoadingFAQs
  } = useQuery({
    queryKey: ['agent-faqs', agent?.id],
    queryFn: async () => {
      if (!agent?.id) return [];
      console.log('Loading FAQs for agent:', agent.id);
      const faqs = await agentRepo.getFAQs(agent.id);
      console.log('FAQs loaded:', faqs);
      return faqs;
    },
    enabled: !!agent?.id
  });

  useEffect(() => {
    if (agentError) {
      toast({
        title: "Error loading agent",
        description: "We couldn't find the agent you're looking for.",
        variant: "destructive",
      });
      navigate('/agents');
    }
  }, [agentError, navigate, toast]);

  // Set up smooth scrolling and clean it up when component unmounts
  useEffect(() => {
    const cleanup = setupSmoothScrolling();
    // Return cleanup function to remove event listeners when component unmounts
    return cleanup;
  }, []);

  const agentTypeLabels: Record<string, string> = {
    aviation: 'Aviation',
    insurance: 'Insurance',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity',
    operator: 'Intelligence'
  };
  
  const typeLabel = agent?.agentType ? (agentTypeLabels[agent.agentType] || agent.agentType) : '';

  if (isLoadingAgent) {
    return <AgentProfileLoading />;
  }

  if (!agent) {
    return <AgentProfileNotFound />;
  }

  return (
    <ErrorBoundary fallback={<AgentProfileError />}>
      <PageContainer>
        <Section>
          <AgentProfileHeader agent={agent} typeLabel={typeLabel} />
          
          <AgentFeatures 
            features={features} 
            isLoading={isLoadingFeatures} 
          />
          <AgentFAQs 
            faqs={faqs} 
            isLoading={isLoadingFAQs} 
          />
        </Section>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default AgentProfile;

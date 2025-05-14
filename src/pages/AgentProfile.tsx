import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessagesSquareIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { getAgentRepository } from '@/lib/dataAccess';
import { AgentInfo, AgentFeature, AgentFaq } from '@/lib/dataAccess/types';
import AgentFeatures from '@/components/agents/AgentFeatures';
import AgentFAQs from '@/components/agents/AgentFAQs';
import { useQuery } from '@tanstack/react-query';

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
        const agent = await agentRepo.getBySlug(slug);
        return agent;
      } catch (error) {
        console.error('Error fetching agent:', error);
        throw error;
      }
    }
  });

  // Query for agent features
  const {
    data: features,
    isLoading: isLoadingFeatures
  } = useQuery({
    queryKey: ['agent-features', agent?.id],
    queryFn: async () => {
      if (!agent?.id) return [];
      return await agentRepo.getFeatures(agent.id);
    },
    enabled: !!agent?.id
  });

  // Query for agent FAQs
  const {
    data: faqs,
    isLoading: isLoadingFAQs
  } = useQuery({
    queryKey: ['agent-faqs', agent?.id],
    queryFn: async () => {
      if (!agent?.id) return [];
      return await agentRepo.getFAQs(agent.id);
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

  // Get initials for avatar fallback
  const initials = agent?.name
    ? agent.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '';

  const agentTypeLabels: Record<string, string> = {
    aviation: 'Aviation',
    insurance: 'Insurance',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity',
    operator: 'Intelligence'
  };
  
  const typeLabel = agent?.agentType ? (agentTypeLabels[agent.agentType] || agent.agentType) : '';

  if (isLoadingAgent) {
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
  }

  if (!agent) {
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
  }

  return (
    <PageContainer>
      <Section>
        <Link to="/agents" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agent Directory
        </Link>
        
        <div className="border-b border-gray-800 pb-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-2" style={{ borderColor: agent.themeColor }}>
              {agent.avatarUrl ? (
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              ) : (
                <AvatarFallback className="text-2xl" style={{ backgroundColor: agent.themeColor }}>
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{agent.name}</h1>
                    <Badge 
                      className="capitalize" 
                      style={{ backgroundColor: agent.themeColor, color: 'black' }}
                    >
                      {typeLabel}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">{agent.title}</p>
                </div>
                
                <Button className="flex gap-2" style={{ backgroundColor: agent.themeColor, color: 'black' }}>
                  <MessagesSquareIcon size={18} />
                  Chat with {agent.name}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">About</h2>
            <p className="whitespace-pre-wrap">{agent.fullDescription}</p>
          </div>
        </div>
        
        <AgentFeatures 
          features={(features || []) as any} 
          isLoading={isLoadingFeatures} 
        />
        <AgentFAQs 
          faqs={(faqs || []) as any} 
          isLoading={isLoadingFAQs} 
        />
      </Section>
    </PageContainer>
  );
};

export default AgentProfile;

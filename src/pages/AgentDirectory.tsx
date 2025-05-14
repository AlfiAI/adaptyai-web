
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAgentRepository } from '@/lib/dataAccess/factory';
import { AgentInfo } from '@/lib/dataAccess/types';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const AgentDirectory = () => {
  const navigate = useNavigate();
  const agentRepository = getAgentRepository();
  
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      return await agentRepository.getAll();
    }
  });

  if (isLoading) {
    return (
      <PageContainer>
        <Section>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-16 w-16 animate-spin text-adapty-aqua" />
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Section>
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-red-500">Error loading agents</h2>
            <p className="mt-2 text-gray-400">Please try again later</p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 text-adapty-aqua">Meet Our AI Agents</h1>
            <p className="text-lg text-gray-300">
              Our specialized AI agents are designed to help you navigate complex domains with expert guidance.
              Each agent brings unique capabilities to support your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents && agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onClick={() => navigate(`/agents/${agent.slug}`)} />
            ))}
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

interface AgentCardProps {
  agent: AgentInfo;
  onClick: () => void;
}

const AgentCard = ({ agent, onClick }: AgentCardProps) => {
  return (
    <Card className="border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-adapty-aqua/50 transition-all overflow-hidden">
      <CardHeader className="pb-2" style={{ borderBottom: `2px solid ${agent.themeColor}` }}>
        <div className="flex items-center space-x-4">
          <div 
            className="h-12 w-12 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor }}
          >
            {agent.name.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-xl">{agent.name}</CardTitle>
            <CardDescription>{agent.title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-gray-300">{agent.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${agent.themeColor}30`, color: agent.themeColor }}
            >
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onClick} 
          className="w-full group"
          style={{ 
            backgroundColor: `${agent.themeColor}20`, 
            color: agent.themeColor,
            borderColor: `${agent.themeColor}40`,
            borderWidth: '1px'
          }}
          variant="outline"
        >
          Meet {agent.name}
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentDirectory;

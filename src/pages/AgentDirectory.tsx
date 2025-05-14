import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { getAgentRepository } from '@/lib/dataAccess';
import { AgentInfo } from '@/lib/dataAccess/types';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import AgentCard from '@/components/agents/AgentCard';
import AgentTypeFilter from '@/components/agents/AgentTypeFilter';
import { useQuery } from '@tanstack/react-query';

const AgentDirectory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const agentRepo = getAgentRepository();
  
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      try {
        return await agentRepo.getAll();
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: "Error",
          description: "Failed to load agent directory",
          variant: "destructive",
        });
        return [];
      }
    }
  });
  
  // Extract all unique agent types from the data
  const agentTypes = Array.from(new Set(agents.map(agent => agent.agentType)));
  
  const agentTypeLabels: Record<string, string> = {
    aviation: 'Aviation',
    insurance: 'Insurance',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity',
    operator: 'Intelligence'
  };
  
  const agentTypeColors: Record<string, string> = {
    aviation: '#60a5fa', // blue
    insurance: '#f59e0b', // amber
    sustainability: '#10b981', // emerald
    cybersecurity: '#ef4444', // red
    operator: '#8b5cf6'  // violet
  };
  
  // Filter agents based on search query and selected type
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === null || agent.agentType === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <PageContainer>
      <Section>
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">Agent Directory</h1>
          <p className="text-muted-foreground">
            Discover and connect with our specialized AI agents designed to assist you 
            across various domains.
          </p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              className="pl-10"
              placeholder="Search by name, title, or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <AgentTypeFilter
            selectedType={selectedType}
            onSelectType={setSelectedType}
            agentTypes={agentTypes}
            typeLabels={agentTypeLabels}
            typeColors={agentTypeColors}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-adapty-aqua" />
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agents found matching your criteria.</p>
          </div>
        )}
      </Section>
    </PageContainer>
  );
};

export default AgentDirectory;


import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAgentRepository } from '@/lib/dataAccess/factory';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentData } from '@/lib/dataAccess/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentList from './agent/AgentList';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const AdminAgentManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const agentRepo = getAgentRepository();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch agents
  const {
    data: agents = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['admin', 'agents'],
    queryFn: async () => {
      try {
        return await agentRepo.getAll();
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agents',
          variant: 'destructive',
        });
        return [];
      }
    }
  });
  
  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      setIsDeleting(true);
      try {
        await agentRepo.delete(agentId);
        return agentId;
      } finally {
        setIsDeleting(false);
      }
    },
    onSuccess: (agentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'agents'] });
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete agent',
        variant: 'destructive',
      });
    }
  });
  
  const handleAddAgent = () => {
    // Navigate to agent form or open modal
    toast({
      title: 'Add Agent',
      description: 'This feature is coming soon!',
    });
  };
  
  const handleEditAgent = (agent: AgentData) => {
    // Navigate to agent form or open modal with agent data
    toast({
      title: 'Edit Agent',
      description: `Editing ${agent.name}`,
    });
  };
  
  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      deleteAgentMutation.mutate(agentId);
    }
  };
  
  return (
    <div>
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents">
          <AgentList
            agents={agents}
            isLoading={isLoading}
            onAddAgent={handleAddAgent}
            onEditAgent={handleEditAgent}
            onDeleteAgent={handleDeleteAgent}
            isDeleting={isDeleting}
          />
        </TabsContent>
        
        <TabsContent value="features">
          <div className="p-8 flex justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Select an agent first to manage its features.
              </p>
              <Button disabled>Manage Features</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs">
          <div className="p-8 flex justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Select an agent first to manage its FAQs.
              </p>
              <Button disabled>Manage FAQs</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAgentManager;

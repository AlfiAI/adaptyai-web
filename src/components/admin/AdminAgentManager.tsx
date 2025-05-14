
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentList } from './agent/AgentList';
import { FeaturesList } from './agent/FeaturesList';
import { FaqsList } from './agent/FaqsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AgentForm from './agent/AgentForm';
import { useToast } from '@/hooks/use-toast';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentInfo } from '@/lib/dataAccess/types';

export const AdminAgentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const agentRepo = new SupabaseAgentRepository();

  const handleAgentCreated = () => {
    toast({
      title: 'Success',
      description: 'Agent created successfully',
    });
    setIsDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAgentUpdated = () => {
    toast({
      title: 'Success',
      description: 'Agent updated successfully',
    });
    setIsDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditAgent = (agent: AgentInfo) => {
    setSelectedAgentId(agent.id);
    setIsDialogOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await agentRepo.delete(agentId);
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete agent',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-adapty-aqua text-black hover:bg-adapty-aqua/80">
              <Plus className="h-4 w-4" /> New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedAgentId ? 'Edit Agent' : 'Create New Agent'}
              </DialogTitle>
              <DialogDescription>
                {selectedAgentId 
                  ? 'Update the agent information below.' 
                  : 'Fill in the details to create a new AI agent.'}
              </DialogDescription>
            </DialogHeader>
            <AgentForm 
              agentId={selectedAgentId} 
              onAgentCreated={handleAgentCreated}
              onAgentUpdated={handleAgentUpdated}
              onCancel={() => {
                setIsDialogOpen(false);
                setSelectedAgentId(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs 
        defaultValue="agents" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="mt-6">
          <AgentList 
            onEdit={handleEditAgent} 
            onDelete={handleDeleteAgent}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        <TabsContent value="features" className="mt-6">
          <FeaturesList refreshTrigger={refreshTrigger} />
        </TabsContent>
        <TabsContent value="faqs" className="mt-6">
          <FaqsList refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

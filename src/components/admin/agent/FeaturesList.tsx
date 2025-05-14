
import React, { useEffect, useState } from 'react';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentInfo, AgentFeature } from '@/lib/dataAccess/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FeatureForm from './FeatureForm';

interface FeaturesListProps {
  refreshTrigger: number;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ refreshTrigger }) => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [features, setFeatures] = useState<AgentFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<AgentFeature | null>(null);
  const { toast } = useToast();
  const agentRepo = new SupabaseAgentRepository();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentsList = await agentRepo.getAll();
        setAgents(agentsList);
        
        if (agentsList.length > 0 && !selectedAgentId) {
          setSelectedAgentId(agentsList[0].id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agents',
          variant: 'destructive',
        });
      }
    };
    
    fetchAgents();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!selectedAgentId) return;
      
      setIsLoading(true);
      try {
        const featuresList = await agentRepo.getAgentFeatures(selectedAgentId);
        setFeatures(featuresList);
      } catch (error) {
        console.error('Error fetching features:', error);
        toast({
          title: 'Error',
          description: 'Failed to load features',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeatures();
  }, [selectedAgentId, refreshTrigger]);

  const handleAgentChange = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handleEditFeature = (feature: AgentFeature) => {
    setEditingFeature(feature);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (featureId: string) => {
    setSelectedFeatureId(featureId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFeatureId) {
      try {
        await agentRepo.deleteFeature(selectedFeatureId);
        toast({
          title: 'Success',
          description: 'Feature deleted successfully',
        });
        // Refresh features list
        const updatedFeatures = await agentRepo.getAgentFeatures(selectedAgentId);
        setFeatures(updatedFeatures);
      } catch (error) {
        console.error('Error deleting feature:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete feature',
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogOpen(false);
        setSelectedFeatureId(null);
      }
    }
  };

  const handleFeatureSaved = async () => {
    setIsDialogOpen(false);
    setEditingFeature(null);
    // Refresh features list
    const updatedFeatures = await agentRepo.getAgentFeatures(selectedAgentId);
    setFeatures(updatedFeatures);
  };

  const getSelectedAgentName = () => {
    const agent = agents.find(a => a.id === selectedAgentId);
    return agent ? agent.name : 'Select Agent';
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Select value={selectedAgentId} onValueChange={handleAgentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: agent.themeColor }}
                      ></div>
                      {agent.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={() => {
            if (selectedAgentId) {
              setEditingFeature(null);
              setIsDialogOpen(true);
            } else {
              toast({
                title: 'Select an Agent',
                description: 'Please select an agent first',
                variant: 'default',
              });
            }
          }}
          className="flex items-center gap-2 bg-adapty-aqua text-black hover:bg-adapty-aqua/80"
        >
          <Plus className="h-4 w-4" /> Add Feature
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-adapty-aqua"></div>
        </div>
      ) : selectedAgentId ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No features found for {getSelectedAgentName()}
                  </TableCell>
                </TableRow>
              ) : (
                features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <div className="text-2xl">{feature.icon || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{feature.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{feature.description}</div>
                    </TableCell>
                    <TableCell>{feature.displayOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFeature(feature)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(feature.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          Please select an agent to view features
        </div>
      )}

      {/* Feature Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? 'Edit Feature' : 'Add New Feature'}
            </DialogTitle>
            <DialogDescription>
              {editingFeature 
                ? 'Update the feature details below.' 
                : 'Fill in the details to create a new feature.'}
            </DialogDescription>
          </DialogHeader>
          <FeatureForm
            feature={editingFeature}
            agentId={selectedAgentId}
            onSaved={handleFeatureSaved}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


import React, { useEffect, useState } from 'react';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentInfo, AgentFaq } from '@/lib/dataAccess/types';
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
import FaqForm from './FaqForm';

interface FaqsListProps {
  refreshTrigger: number;
}

export const FaqsList: React.FC<FaqsListProps> = ({ refreshTrigger }) => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [faqs, setFaqs] = useState<AgentFaq[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<AgentFaq | null>(null);
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
    const fetchFaqs = async () => {
      if (!selectedAgentId) return;
      
      setIsLoading(true);
      try {
        const faqsList = await agentRepo.getAgentFaqs(selectedAgentId);
        setFaqs(faqsList);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load FAQs',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFaqs();
  }, [selectedAgentId, refreshTrigger]);

  const handleAgentChange = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handleEditFaq = (faq: AgentFaq) => {
    setEditingFaq(faq);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (faqId: string) => {
    setSelectedFaqId(faqId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFaqId) {
      try {
        await agentRepo.deleteFaq(selectedFaqId);
        toast({
          title: 'Success',
          description: 'FAQ deleted successfully',
        });
        // Refresh FAQs list
        const updatedFaqs = await agentRepo.getAgentFaqs(selectedAgentId);
        setFaqs(updatedFaqs);
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete FAQ',
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogOpen(false);
        setSelectedFaqId(null);
      }
    }
  };

  const handleFaqSaved = async () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
    // Refresh FAQs list
    const updatedFaqs = await agentRepo.getAgentFaqs(selectedAgentId);
    setFaqs(updatedFaqs);
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
              setEditingFaq(null);
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
          <Plus className="h-4 w-4" /> Add FAQ
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
                <TableHead>Question</TableHead>
                <TableHead>Answer Preview</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                    No FAQs found for {getSelectedAgentName()}
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div className="font-medium">{faq.question}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{faq.answer}</div>
                    </TableCell>
                    <TableCell>{faq.displayOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFaq(faq)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(faq.id)}
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
          Please select an agent to view FAQs
        </div>
      )}

      {/* FAQ Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </DialogTitle>
            <DialogDescription>
              {editingFaq 
                ? 'Update the FAQ details below.' 
                : 'Fill in the details to create a new FAQ.'}
            </DialogDescription>
          </DialogHeader>
          <FaqForm
            faq={editingFaq}
            agentId={selectedAgentId}
            onSaved={handleFaqSaved}
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
              This will permanently delete this FAQ.
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

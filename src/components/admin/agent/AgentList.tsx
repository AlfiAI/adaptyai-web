
import React, { useEffect, useState } from 'react';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentInfo } from '@/lib/dataAccess/types';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
import { Pencil, MoreVertical, Trash2, Info } from 'lucide-react';
import { format } from 'date-fns';

interface AgentListProps {
  onEdit: (agent: AgentInfo) => void;
  onDelete: (agentId: string) => void;
  refreshTrigger: number;
}

export const AgentList: React.FC<AgentListProps> = ({ 
  onEdit, 
  onDelete,
  refreshTrigger, 
}) => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const agentRepo = new SupabaseAgentRepository();

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const agentsList = await agentRepo.getAll();
        setAgents(agentsList);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgents();
  }, [refreshTrigger]);

  const handleDeleteClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAgentId) {
      onDelete(selectedAgentId);
      setDeleteDialogOpen(false);
      setSelectedAgentId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      if (typeof date === 'string') {
        return format(new Date(date), 'MMM d, yyyy');
      }
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-adapty-aqua"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                  No agents found
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: `${agent.themeColor}30`, color: agent.themeColor }}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {agent.agentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(agent.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(agent)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(agent.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this agent
              and all associated features and FAQs.
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

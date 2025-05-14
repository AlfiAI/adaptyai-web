
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Edit, Trash, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AgentData } from '@/lib/dataAccess/types';
import { Link } from 'react-router-dom';

interface AgentListProps {
  agents: AgentData[];
  isLoading: boolean;
  onAddAgent: () => void;
  onEditAgent: (agent: AgentData) => void;
  onDeleteAgent: (agentId: string) => void;
  isDeleting: boolean;
}

export const AgentList: React.FC<AgentListProps> = ({
  agents,
  isLoading,
  onAddAgent,
  onEditAgent,
  onDeleteAgent,
  isDeleting,
}) => {
  const agentTypeLabels: Record<string, string> = {
    aviation: 'Aviation',
    insurance: 'Insurance',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity',
    operator: 'Intelligence'
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Agents</h2>
        <Button onClick={onAddAgent} className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80">
          <Plus className="h-4 w-4 mr-2" /> Create Agent
        </Button>
      </div>
      
      {agents.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No agents have been created yet.</p>
          <Button onClick={onAddAgent}>
            <Plus className="h-4 w-4 mr-2" /> Create your first agent
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => {
            const initials = agent.name
              .split(' ')
              .map(part => part[0])
              .join('')
              .toUpperCase();
              
            return (
              <Card key={agent.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar 
                      className="h-12 w-12 border-2" 
                      style={{ borderColor: agent.themeColor }}
                    >
                      {agent.avatarUrl ? (
                        <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: agent.themeColor }}>
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        <Badge 
                          variant="outline" 
                          className="capitalize"
                          style={{ borderColor: agent.themeColor, color: agent.themeColor }}
                        >
                          {agentTypeLabels[agent.agentType] || agent.agentType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{agent.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/agents/${agent.slug}`} target="_blank">
                      <Button size="icon" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" onClick={() => onEditAgent(agent)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => onDeleteAgent(agent.id)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentList;

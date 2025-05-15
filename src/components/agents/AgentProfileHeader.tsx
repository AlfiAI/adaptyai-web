
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessagesSquareIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AgentInfo } from '@/lib/dataAccess/types';

interface AgentProfileHeaderProps {
  agent: AgentInfo;
  typeLabel: string;
}

export const AgentProfileHeader: React.FC<AgentProfileHeaderProps> = ({ agent, typeLabel }) => {
  // Get initials for avatar fallback
  const initials = agent.name
    ? agent.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="border-b border-gray-800 pb-8 mb-8">
      <Link to="/agents" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Agent Directory
      </Link>
      
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
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
            
            <Button className="flex gap-2 self-start" style={{ backgroundColor: agent.themeColor, color: 'black' }}>
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
  );
};

export default AgentProfileHeader;

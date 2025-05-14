
import { AgentInfo } from '@/lib/dataAccess/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: AgentInfo;
  index: number;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, index }) => {
  const agentTypeLabels: Record<string, string> = {
    aviation: 'Aviation',
    insurance: 'Insurance',
    sustainability: 'Sustainability',
    cybersecurity: 'Cybersecurity',
    operator: 'Intelligence'
  };
  
  const typeLabel = agentTypeLabels[agent.agentType] || agent.agentType;
  
  // Get initials from agent name
  const initials = agent.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/agents/${agent.slug}`} className="block h-full">
        <Card 
          className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg border border-gray-700 hover:border-adapty-aqua/40 group"
          style={{ 
            borderLeftColor: agent.themeColor, 
            borderLeftWidth: '4px' 
          }}
        >
          <CardContent className="p-6 pb-2">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12 border-2" style={{ borderColor: agent.themeColor }}>
                {agent.avatarUrl ? (
                  <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                ) : (
                  <AvatarFallback style={{ backgroundColor: agent.themeColor }}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-adapty-aqua transition-colors">
                  {agent.name}
                </h3>
                <p className="text-muted-foreground text-sm">{agent.title}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {agent.shortDescription}
            </p>
          </CardContent>
          
          <CardFooter className="px-6 py-4 flex items-center justify-between">
            <Badge 
              variant="outline"
              className="font-normal capitalize"
              style={{ borderColor: agent.themeColor, color: agent.themeColor }}
            >
              {typeLabel}
            </Badge>
            
            <div className="text-xs text-muted-foreground">
              {agent.capabilities && agent.capabilities.length > 0 ? `${agent.capabilities.length} Capabilities` : 'New Agent'}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default AgentCard;

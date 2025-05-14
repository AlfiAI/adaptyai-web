
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AgentTypeFilterProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  agentTypes: string[];
  typeLabels: Record<string, string>;
  typeColors: Record<string, string>;
}

export const AgentTypeFilter: React.FC<AgentTypeFilterProps> = ({
  selectedType,
  onSelectType,
  agentTypes,
  typeLabels,
  typeColors
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={!selectedType ? "default" : "outline"}
        className="cursor-pointer hover:bg-primary/80"
        onClick={() => onSelectType(null)}
      >
        All Agents
      </Badge>
      
      {agentTypes.map(type => (
        <Badge
          key={type}
          variant={selectedType === type ? "default" : "outline"}
          className="cursor-pointer capitalize hover:opacity-80"
          style={{
            backgroundColor: selectedType === type ? typeColors[type] : 'transparent',
            borderColor: typeColors[type],
            color: selectedType === type ? 'black' : typeColors[type]
          }}
          onClick={() => onSelectType(type)}
        >
          {typeLabels[type]}
        </Badge>
      ))}
    </div>
  );
};

export default AgentTypeFilter;

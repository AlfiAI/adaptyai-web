
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AgentFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  display_order: number;
}

interface AgentFeaturesProps {
  features: AgentFeature[];
  isLoading?: boolean;
}

export const AgentFeatures: React.FC<AgentFeaturesProps> = ({ features, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 my-6">
        <h2 className="text-2xl font-semibold">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-36 bg-muted/30 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="space-y-4 my-6">
        <h2 className="text-2xl font-semibold">Key Features</h2>
        <p className="text-muted-foreground italic">This agent is still learning new capabilities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <h2 className="text-2xl font-semibold">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.id} className="overflow-hidden border border-muted transition-all duration-200 hover:shadow-md hover:border-adapty-aqua/40">
            <CardContent className="p-4">
              <div className="flex gap-3 items-start">
                {feature.icon && (
                  <div className="text-2xl mt-1">{feature.icon}</div>
                )}
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentFeatures;

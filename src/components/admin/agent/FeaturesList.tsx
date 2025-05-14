
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, Loader2 } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  display_order: number;
}

interface FeaturesListProps {
  features: Feature[];
  isLoading: boolean;
  onAddFeature: () => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
  isDeleting: boolean;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({
  features,
  isLoading,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
  isDeleting,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-adapty-aqua" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Features</h3>
        <Button size="sm" onClick={onAddFeature}>
          <Plus className="h-4 w-4 mr-1" /> Add Feature
        </Button>
      </div>
      
      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No features added yet. Click the button above to add your first feature.
        </p>
      ) : (
        <div className="space-y-2">
          {features.sort((a, b) => a.display_order - b.display_order).map((feature) => (
            <Card key={feature.id} className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {feature.icon && (
                    <div className="text-xl">{feature.icon}</div>
                  )}
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditFeature(feature)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => onDeleteFeature(feature.id)}
                    disabled={isDeleting}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturesList;

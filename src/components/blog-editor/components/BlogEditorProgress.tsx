
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBlogEditorContext } from '../context/BlogEditorContext';

export const BlogEditorProgress: React.FC = () => {
  const { progress, isAutoSaving } = useBlogEditorContext();
  
  return (
    <Card className="mb-6 p-4 bg-black/20 border-white/10">
      <div className="flex items-center mb-2">
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="ml-4 text-sm font-medium">{Math.round(progress)}% complete</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {isAutoSaving 
          ? "Saving your progress..." 
          : "Complete all required steps to publish your blog post. Progress is automatically saved."}
      </p>
    </Card>
  );
};

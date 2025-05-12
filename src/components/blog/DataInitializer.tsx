
import { useEffect, useState } from 'react';
import { createBlogSampleData } from '@/lib/dataAccess/repositories/supabase/createBlogSampleData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DataInitializerProps {
  onComplete?: () => void;
}

export const DataInitializer: React.FC<DataInitializerProps> = ({ onComplete }) => {
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const initializeData = async () => {
    setInitializing(true);
    
    try {
      await createBlogSampleData();
      
      toast({
        title: "Sample data created",
        description: "Blog posts have been created successfully",
        variant: "default",
      });
      
      setInitialized(true);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error initializing data:', error);
      
      toast({
        title: "Error creating sample data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="mb-4 p-4 border border-dashed border-gray-700 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Blog Sample Data</h3>
          <p className="text-sm text-gray-400">
            {initialized
              ? "Sample blog posts have been created."
              : "Create sample blog posts to get started."}
          </p>
        </div>
        <Button
          onClick={initializeData}
          disabled={initializing || initialized}
          variant={initialized ? "outline" : "default"}
        >
          {initializing ? "Creating..." : initialized ? "Created" : "Create Sample Data"}
        </Button>
      </div>
    </div>
  );
};

export default DataInitializer;

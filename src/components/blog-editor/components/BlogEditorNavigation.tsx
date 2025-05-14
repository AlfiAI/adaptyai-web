
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useBlogEditorContext } from '../context/BlogEditorContext';

interface BlogEditorNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const BlogEditorNavigation: React.FC<BlogEditorNavigationProps> = ({ 
  onPrevious, 
  onNext 
}) => {
  const { activeStep, isSubmitting, progress } = useBlogEditorContext();

  return (
    <div className="flex justify-between py-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={onPrevious}
        disabled={activeStep === 'step-1'}
      >
        Previous
      </Button>
      
      {activeStep !== 'review' ? (
        <Button 
          type="button"
          onClick={onNext}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="submit"
          disabled={isSubmitting || progress < 80}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
        </Button>
      )}
    </div>
  );
};

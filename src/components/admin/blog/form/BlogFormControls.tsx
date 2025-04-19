
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BlogFormControlsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const BlogFormControls = ({ isSubmitting, onCancel }: BlogFormControlsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
      <Button 
        type="submit"
        className="bg-adapty-aqua hover:bg-adapty-aqua/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          'Publish Post'
        )}
      </Button>
    </div>
  );
};


import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormControlsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  submitText?: string;
  loadingText?: string;
}

export const FormControls = ({ 
  isSubmitting, 
  onCancel,
  submitText = "Submit",
  loadingText = "Submitting..."
}: FormControlsProps) => {
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
            {loadingText}
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
};

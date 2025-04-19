
import { FormControls } from '@/components/forms/shared/FormControls';

interface BlogFormControlsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const BlogFormControls = ({ isSubmitting, onCancel }: BlogFormControlsProps) => {
  return (
    <FormControls
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      submitText="Publish Post"
      loadingText="Publishing..."
    />
  );
};

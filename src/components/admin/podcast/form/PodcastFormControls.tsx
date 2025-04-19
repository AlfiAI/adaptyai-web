
import { FormControls } from '@/components/forms/shared/FormControls';

interface PodcastFormControlsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  uploading?: boolean;
}

export const PodcastFormControls = ({ isSubmitting, onCancel, uploading }: PodcastFormControlsProps) => {
  return (
    <FormControls
      isSubmitting={isSubmitting || uploading}
      onCancel={onCancel}
      submitText="Publish Episode"
      loadingText={uploading ? "Uploading..." : "Publishing..."}
    />
  );
};

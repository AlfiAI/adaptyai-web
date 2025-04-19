
import { FormMediaUpload } from '@/components/forms/shared/FormMediaUpload';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { PodcastFormValues } from '../PodcastForm';

interface PodcastAudioUploadProps {
  form: UseFormReturn<PodcastFormValues>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: () => void;
  previewDisabled: boolean;
}

export const PodcastAudioUpload = ({ 
  form, 
  selectedFile, 
  onFileChange,
  onPreview,
  previewDisabled
}: PodcastAudioUploadProps) => {
  return (
    <div className="space-y-2">
      <FormMediaUpload
        id="audioFileUpload"
        label="Audio"
        urlValue={form.watch('audio_url')}
        onUrlChange={(value) => form.setValue('audio_url', value)}
        selectedFile={selectedFile}
        onFileChange={onFileChange}
        accept="audio/*"
        urlPlaceholder="https://example.com/podcast.mp3"
        error={form.formState.errors.audio_url?.message}
      />
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onPreview}
          disabled={previewDisabled}
        >
          Preview
        </Button>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { PodcastData } from '@/lib/dataAccess/types';
import { PodcastPreview } from '@/components/admin/PodcastPreview';
import { PodcastFormControls } from './form/PodcastFormControls';
import { PodcastAudioUpload } from './form/PodcastAudioUpload';
import { FormMediaUpload } from '@/components/forms/shared/FormMediaUpload';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const podcastSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  guest_name: z.string().optional(),
  duration: z.string().min(1, { message: "Duration is required (e.g. 32:15)" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  audio_url: z.string().url({ message: "Please enter a valid audio URL" }).or(z.string().length(0)),
  cover_image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0)),
});

export type PodcastFormValues = z.infer<typeof podcastSchema>;

interface PodcastFormProps {
  onSubmit: (data: PodcastFormValues, audioFile: File | null, coverFile: File | null) => void;
  initialData?: PodcastData;
  isSubmitting: boolean;
  onCancel?: () => void;
  uploading?: boolean;
}

export const PodcastForm = ({
  onSubmit,
  initialData,
  isSubmitting,
  onCancel,
  uploading = false
}: PodcastFormProps) => {
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.audio_url || null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: initialData?.title || '',
      guest_name: initialData?.guest_name || '',
      duration: initialData?.duration || '',
      description: initialData?.description || '',
      audio_url: initialData?.audio_url || '',
      cover_image_url: initialData?.cover_image_url || '',
    },
  });

  const handleSubmit = (data: PodcastFormValues) => {
    // Validate that either audio URL or audio file is provided
    if (!data.audio_url && !selectedAudioFile) {
      setFormError("Please provide an audio URL or upload an audio file");
      return;
    }
    
    // Validate that either cover image URL or cover file is provided
    if (!data.cover_image_url && !selectedCoverFile) {
      setFormError("Please provide a cover image URL or upload an image");
      return;
    }
    
    setFormError(null);
    onSubmit(data, selectedAudioFile, selectedCoverFile);
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate audio file type
      if (!file.type.startsWith('audio/')) {
        setFormError("Please select an audio file (MP3, WAV, OGG)");
        return;
      }
      
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setFormError("Maximum audio file size is 100MB");
        return;
      }
      
      setSelectedAudioFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFormError(null);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate image file type
      if (!file.type.startsWith('image/')) {
        setFormError("Please select an image file (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Maximum image file size is 5MB");
        return;
      }
      
      setSelectedCoverFile(file);
      setFormError(null);
    }
  };

  const handlePreview = () => {
    const audioLink = form.getValues("audio_url");
    if (audioLink) {
      setPreviewUrl(audioLink);
      setFormError(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {formError}
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter episode title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guest_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guest Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter guest name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 32:15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description of the podcast episode" 
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PodcastAudioUpload
          form={form}
          selectedFile={selectedAudioFile}
          onFileChange={handleAudioFileChange}
          onPreview={handlePreview}
          previewDisabled={!form.getValues('audio_url') && !selectedAudioFile}
        />
        
        {previewUrl && (
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-2">Audio Preview</h3>
            <PodcastPreview audioUrl={previewUrl} />
          </Card>
        )}
        
        <FormMediaUpload
          id="coverImageUpload"
          label="Cover Image"
          urlValue={form.watch('cover_image_url')}
          onUrlChange={(value) => form.setValue('cover_image_url', value)}
          selectedFile={selectedCoverFile}
          onFileChange={handleCoverFileChange}
          accept="image/*"
          urlPlaceholder="https://example.com/image.jpg"
          error={form.formState.errors.cover_image_url?.message}
        />
        
        <PodcastFormControls
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          uploading={uploading}
        />
      </form>
    </Form>
  );
};

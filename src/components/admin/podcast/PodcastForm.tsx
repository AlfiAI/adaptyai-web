
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { FirestorePodcast } from '@/services/firebase';
import { PodcastPreview } from '@/components/admin/PodcastPreview';
import { PodcastFormControls } from './form/PodcastFormControls';
import { PodcastAudioUpload } from './form/PodcastAudioUpload';
import { FormMediaUpload } from '@/components/forms/shared/FormMediaUpload';

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
  initialData?: FirestorePodcast;
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
    onSubmit(data, selectedAudioFile, selectedCoverFile);
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedAudioFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedCoverFile(e.target.files[0]);
    }
  };

  const handlePreview = () => {
    const audioLink = form.getValues("audio_url");
    if (audioLink) {
      setPreviewUrl(audioLink);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

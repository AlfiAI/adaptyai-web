
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFileToStorage } from '@/lib/utils';
import { PodcastForm, PodcastFormValues } from './podcast/PodcastForm';
import { PodcastList } from './podcast/PodcastList';
import { getPodcastRepository } from '@/lib/dataAccess';
import type { PodcastData } from '@/lib/dataAccess';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AdminPodcastManager = () => {
  const [editingPodcast, setEditingPodcast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const podcastRepository = getPodcastRepository();

  const { data: podcasts, isLoading, isError } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => await podcastRepository.getAll(),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { formData: PodcastFormValues; audioFile: File | null, coverFile: File | null }) => {
      let coverImageUrl = data.formData.cover_image_url;
      let audioUrl = data.formData.audio_url;
      
      setUploading(true);
      try {
        if (data.coverFile) {
          coverImageUrl = await uploadFileToStorage(data.coverFile, 'podcast_covers');
        }
        
        if (data.audioFile) {
          audioUrl = await uploadFileToStorage(data.audioFile, 'podcast_audio');
        }
        
        if (!audioUrl) {
          throw new Error("Audio file or URL is required");
        }
        
        if (editingPodcast) {
          // Update existing podcast
          return podcastRepository.update(editingPodcast, {
            title: data.formData.title,
            description: data.formData.description,
            audio_url: audioUrl,
            guest_name: data.formData.guest_name,
            duration: data.formData.duration,
            cover_image_url: coverImageUrl,
            published_at: new Date()
          });
        } else {
          // Create new podcast
          return podcastRepository.create({
            title: data.formData.title,
            description: data.formData.description,
            audio_url: audioUrl,
            guest_name: data.formData.guest_name,
            duration: data.formData.duration,
            cover_image_url: coverImageUrl,
            published_at: new Date()
          });
        }
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: editingPodcast 
          ? "Your podcast episode has been updated" 
          : "Your podcast episode has been published",
      });
      setEditingPodcast(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
        
      setError(`Failed to ${editingPodcast ? 'update' : 'publish'} podcast: ${errorMessage}`);
      
      toast({
        title: "Error",
        description: `Failed to ${editingPodcast ? 'update' : 'publish'} podcast`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (podcastId: string) => podcastRepository.delete(podcastId),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Podcast episode has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
        
      setError(`Failed to delete podcast: ${errorMessage}`);
      
      toast({
        title: "Error",
        description: "Failed to delete podcast",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PodcastFormValues, audioFile: File | null, coverFile: File | null) => {
    setError(null);
    submitMutation.mutate({ formData: data, audioFile, coverFile });
  };

  const handleEditPodcast = (podcast: PodcastData) => {
    setEditingPodcast(podcast.id);
    setError(null);
  };

  const handleDeletePodcast = (podcastId: string) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      deleteMutation.mutate(podcastId);
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load podcast episodes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPodcast ? 'Edit Podcast Episode' : 'Upload New Podcast Episode'}
            </h2>
            <PodcastForm
              onSubmit={handleSubmit}
              initialData={editingPodcast ? podcasts?.find(podcast => podcast.id === editingPodcast) : undefined}
              isSubmitting={submitMutation.isPending}
              onCancel={editingPodcast ? () => setEditingPodcast(null) : undefined}
              uploading={uploading}
            />
          </Card>
        </div>
        
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Published Podcast Episodes</h2>
            <PodcastList
              podcasts={podcasts || []}
              onEdit={handleEditPodcast}
              onDelete={handleDeletePodcast}
              isLoading={isLoading}
              isDeletingPodcast={deleteMutation.isPending}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

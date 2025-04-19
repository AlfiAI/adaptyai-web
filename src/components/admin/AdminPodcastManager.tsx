
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitPodcast, getPodcasts, deletePodcast } from '@/services/firebaseService';
import { PodcastPreview } from '@/components/admin/PodcastPreview';

// Schema for podcast validation
const podcastSchema = z.object({
  episodeTitle: z.string().min(3, { message: "Episode title must be at least 3 characters" }),
  guestName: z.string().min(1, { message: "Guest name is required" }),
  topic: z.string().min(1, { message: "Topic is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  audioLink: z.string().url({ message: "Please enter a valid audio URL" }),
  coverImageURL: z.string().url({ message: "Please enter a valid image URL" }),
});

type PodcastFormValues = z.infer<typeof podcastSchema>;

export const AdminPodcastManager = () => {
  const [editingPodcast, setEditingPodcast] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up form with validation
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      episodeTitle: '',
      guestName: '',
      topic: '',
      description: '',
      audioLink: '',
      coverImageURL: '',
    },
  });

  // Query to fetch podcasts - updated to use appropriate queryFn format
  const { data: podcasts, isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => await getPodcasts(),
  });

  // Mutation to submit a podcast
  const submitMutation = useMutation({
    mutationFn: (data: PodcastFormValues & { date: Date }) => {
      return submitPodcast(data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your podcast episode has been published",
      });
      form.reset();
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to publish podcast: " + error,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a podcast
  const deleteMutation = useMutation({
    mutationFn: deletePodcast,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Podcast episode has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete podcast: " + error,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PodcastFormValues) => {
    const podcastData = {
      ...data,
      date: new Date(),
    };
    
    submitMutation.mutate(podcastData);
  };

  const handleEditPodcast = (podcast: any) => {
    setEditingPodcast(podcast.id);
    form.reset({
      episodeTitle: podcast.episodeTitle,
      guestName: podcast.guestName,
      topic: podcast.topic,
      description: podcast.description,
      audioLink: podcast.audioLink,
      coverImageURL: podcast.coverImageURL,
    });
    setPreviewUrl(podcast.audioLink);
  };

  const handleDeletePodcast = (podcastId: string) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      deleteMutation.mutate(podcastId);
    }
  };

  const handlePreview = () => {
    const audioLink = form.getValues("audioLink");
    if (audioLink) {
      setPreviewUrl(audioLink);
    } else {
      toast({
        title: "Missing Audio Link",
        description: "Please enter an audio link to preview",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Podcast Form */}
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPodcast ? 'Edit Podcast Episode' : 'Upload New Podcast Episode'}
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="episodeTitle"
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
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter guest name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. AI in Business, Machine Learning" {...field} />
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
                
                <FormField
                  control={form.control}
                  name="audioLink"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Audio Link</FormLabel>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handlePreview}
                        >
                          Preview
                        </Button>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="https://spotify.com/episode/... or https://soundcloud.com/..." 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            // Clear preview when audio link changes
                            setPreviewUrl(null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {previewUrl && (
                  <div className="border rounded-md p-4 bg-card">
                    <h3 className="text-sm font-medium mb-2">Audio Preview</h3>
                    <PodcastPreview audioUrl={previewUrl} />
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="coverImageURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  {editingPodcast && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setEditingPodcast(null);
                        setPreviewUrl(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="bg-adapty-aqua hover:bg-adapty-aqua/80"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Publish Episode'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
        
        {/* Podcasts List */}
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Published Podcast Episodes</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
              </div>
            ) : podcasts && podcasts.length > 0 ? (
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {podcasts.map((podcast) => (
                  <Card key={podcast.id} className="p-4 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold line-clamp-1">{podcast.episodeTitle}</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPodcast(podcast)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeletePodcast(podcast.id as string)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 flex justify-between">
                      <span>Guest: {podcast.guestName}</span>
                      <span>Topic: {podcast.topic}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No podcast episodes yet. Upload your first episode!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

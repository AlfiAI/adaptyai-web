
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Trash, Upload } from 'lucide-react';
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
import { submitPodcast, getPodcasts, deletePodcast, uploadImage, uploadAudio, FirestorePodcast } from '@/services/firebaseService';
import { PodcastPreview } from '@/components/admin/PodcastPreview';

// Schema for podcast validation
const podcastSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  guest_name: z.string().optional(),
  duration: z.string().min(1, { message: "Duration is required (e.g. 32:15)" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  audio_url: z.string().url({ message: "Please enter a valid audio URL" }).or(z.string().length(0)),
  cover_image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0)),
});

type PodcastFormValues = z.infer<typeof podcastSchema>;

export const AdminPodcastManager = () => {
  const [editingPodcast, setEditingPodcast] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up form with validation
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: '',
      guest_name: '',
      duration: '',
      description: '',
      audio_url: '',
      cover_image_url: '',
    },
  });

  // Query to fetch podcasts
  const { data: podcasts, isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => await getPodcasts(),
  });

  // Mutation to submit a podcast
  const submitMutation = useMutation({
    mutationFn: async (data: PodcastFormValues) => {
      let coverImageUrl = data.cover_image_url;
      let audioUrl = data.audio_url;
      
      setUploading(true);
      try {
        // Upload cover image if selected
        if (selectedCoverFile) {
          coverImageUrl = await uploadImage(selectedCoverFile, 'podcasts/covers');
        }
        
        // Upload audio file if selected
        if (selectedAudioFile) {
          audioUrl = await uploadAudio(selectedAudioFile);
        }
        
        // Validate that we have either a URL or an uploaded file for audio
        if (!audioUrl) {
          throw new Error("Audio file or URL is required");
        }
        
        // Submit the podcast with the URLs
        return submitPodcast({
          title: data.title,
          description: data.description,
          audio_url: audioUrl,
          guest_name: data.guest_name,
          duration: data.duration,
          cover_image_url: coverImageUrl,
          published_at: new Date()
        });
      } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your podcast episode has been published",
      });
      form.reset();
      setSelectedCoverFile(null);
      setSelectedAudioFile(null);
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

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedCoverFile(file);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedAudioFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onSubmit = (data: PodcastFormValues) => {
    // Validate that we have either a URL or an uploaded file for audio
    if (!data.audio_url && !selectedAudioFile) {
      toast({
        title: "Audio required",
        description: "Please provide an audio URL or upload an audio file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate that we have either a URL or an uploaded file for cover image
    if (!data.cover_image_url && !selectedCoverFile) {
      toast({
        title: "Cover image required",
        description: "Please provide a cover image URL or upload an image",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate(data);
  };

  const handleEditPodcast = (podcast: FirestorePodcast) => {
    setEditingPodcast(podcast.id);
    form.reset({
      title: podcast.title,
      guest_name: podcast.guest_name,
      duration: podcast.duration,
      description: podcast.description,
      audio_url: podcast.audio_url,
      cover_image_url: podcast.cover_image_url,
    });
    setPreviewUrl(podcast.audio_url);
    setSelectedCoverFile(null);
    setSelectedAudioFile(null);
  };

  const handleDeletePodcast = (podcastId: string) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      deleteMutation.mutate(podcastId);
    }
  };

  const handlePreview = () => {
    const audioLink = form.getValues("audio_url");
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
                
                <FormField
                  control={form.control}
                  name="audio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="col-span-2">
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/podcast.mp3" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Clear preview when audio link changes
                                if (e.target.value !== field.value) {
                                  setPreviewUrl(null);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <Input
                              type="file"
                              id="audioFileUpload"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleAudioFileChange}
                              accept="audio/*"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full flex items-center justify-center"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={handlePreview}
                            disabled={!field.value && !selectedAudioFile}
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                      {selectedAudioFile && (
                        <p className="text-sm mt-1 text-emerald-500">
                          Selected: {selectedAudioFile.name}
                        </p>
                      )}
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
                  name="cover_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="col-span-2">
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <div>
                          <div className="relative">
                            <Input
                              type="file"
                              id="coverImageUpload"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleCoverFileChange}
                              accept="image/*"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full flex items-center justify-center"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      {selectedCoverFile && (
                        <p className="text-sm mt-1 text-emerald-500">
                          Selected: {selectedCoverFile.name}
                        </p>
                      )}
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
                        setSelectedCoverFile(null);
                        setSelectedAudioFile(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="bg-adapty-aqua hover:bg-adapty-aqua/80"
                    disabled={submitMutation.isPending || uploading}
                  >
                    {(submitMutation.isPending || uploading) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploading ? 'Uploading...' : 'Publishing...'}
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
                      <h3 className="font-semibold line-clamp-1">{podcast.title}</h3>
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
                      {podcast.guest_name && <span>Guest: {podcast.guest_name}</span>}
                      <span>Duration: {podcast.duration}</span>
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

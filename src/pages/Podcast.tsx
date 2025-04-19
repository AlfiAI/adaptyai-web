
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { getPodcasts } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PodcastEpisodeCard } from '@/components/podcast/PodcastEpisodeCard';
import { useQuery } from '@tanstack/react-query';
import LexIntegration from '@/components/blog/LexIntegration';

const Podcast = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('latest');
  const navigate = useNavigate();

  // Query to fetch podcasts
  const { data: podcasts, isLoading, error } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => await getPodcasts(),
  });

  if (error) {
    toast({
      title: "Couldn't load podcasts",
      description: "Using placeholder content instead.",
      variant: "destructive"
    });
  }

  // Prepare data for rendering
  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return 'Unknown date';
  };

  // Group podcasts by guest (if available)
  const podcastsByGuest = podcasts?.reduce((acc: Record<string, any[]>, podcast) => {
    const guestName = podcast.guest_name || 'Other Episodes';
    if (!acc[guestName]) {
      acc[guestName] = [];
    }
    acc[guestName].push({
      ...podcast,
      formattedDate: formatDate(podcast.published_at)
    });
    return acc;
  }, {}) || {};

  const guests = Object.keys(podcastsByGuest).filter(guest => guest !== 'Other Episodes');
  if (podcastsByGuest['Other Episodes']) {
    guests.push('Other Episodes');
  }

  return (
    <PageContainer>
      <Section>
        {/* Hero Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Adapty AI Podcast</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Join us as we explore the cutting edge of AI technology and its real-world applications 
            with industry experts, thought leaders, and innovative practitioners.
          </p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10"
              onClick={() => navigate('/admin')}
            >
              Admin Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Podcast Episode List */}
        <div className="mb-12">
          <Tabs defaultValue="latest" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8 overflow-x-auto py-2">
              <TabsList>
                <TabsTrigger value="latest">Latest Episodes</TabsTrigger>
                {guests.map(guest => (
                  <TabsTrigger key={guest} value={guest}>{guest}</TabsTrigger>
                ))}
              </TabsList>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-adapty-aqua" />
              </div>
            ) : (
              <>
                <TabsContent value="latest">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {podcasts && podcasts.length > 0 ? (
                      podcasts.slice(0, 6).map(episode => (
                        <PodcastEpisodeCard 
                          key={episode.id} 
                          episode={{
                            id: episode.id,
                            title: episode.title,
                            description: episode.description,
                            audioLink: episode.audio_url,
                            guestName: episode.guest_name || '',
                            date: formatDate(episode.published_at),
                            duration: episode.duration,
                            coverImageURL: episode.cover_image_url
                          }} 
                        />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-12 text-gray-400">
                        No podcast episodes found. Check back soon!
                      </div>
                    )}
                  </div>
                </TabsContent>

                {guests.map(guest => (
                  <TabsContent key={guest} value={guest}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {podcastsByGuest[guest].map(episode => (
                        <PodcastEpisodeCard 
                          key={episode.id} 
                          episode={{
                            id: episode.id,
                            title: episode.title,
                            description: episode.description,
                            audioLink: episode.audio_url,
                            guestName: episode.guest_name || '',
                            date: episode.formattedDate,
                            duration: episode.duration,
                            coverImageURL: episode.cover_image_url
                          }} 
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>

          {activeTab === 'latest' && podcasts && podcasts.length > 6 && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10"
              >
                Load More Episodes
              </Button>
            </div>
          )}
        </div>

        {/* L.E.X. Integration */}
        <LexIntegration />
      </Section>
    </PageContainer>
  );
};

export default Podcast;


import { useState, useEffect } from 'react';
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

  // Query to fetch podcasts
  const { data: podcasts, isLoading, error } = useQuery({
    queryKey: ['podcasts'],
    queryFn: getPodcasts,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Couldn't load podcasts",
        description: "Using placeholder content instead.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Group podcasts by topic
  const podcastsByTopic = podcasts?.reduce((acc: Record<string, any[]>, podcast) => {
    const topic = podcast.topic || 'Uncategorized';
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(podcast);
    return acc;
  }, {}) || {};

  const topics = Object.keys(podcastsByTopic);

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
        </motion.div>

        {/* Podcast Episode List */}
        <div className="mb-12">
          <Tabs defaultValue="latest" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="latest">Latest Episodes</TabsTrigger>
                {topics.map(topic => (
                  <TabsTrigger key={topic} value={topic}>{topic}</TabsTrigger>
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
                        <PodcastEpisodeCard key={episode.id} episode={episode} />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-12 text-gray-400">
                        No podcast episodes found. Check back soon!
                      </div>
                    )}
                  </div>
                </TabsContent>

                {topics.map(topic => (
                  <TabsContent key={topic} value={topic}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {podcastsByTopic[topic].map(episode => (
                        <PodcastEpisodeCard key={episode.id} episode={episode} />
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

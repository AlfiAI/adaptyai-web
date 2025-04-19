
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PodcastPreview } from '@/components/admin/PodcastPreview';
import { formatDistanceToNow } from 'date-fns';
import { PodcastEpisode } from '@/types/blog';

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode;
}

export const PodcastEpisodeCard: React.FC<PodcastEpisodeCardProps> = ({ episode }) => {
  const [playerOpen, setPlayerOpen] = useState(false);

  const formatDate = (date: any) => {
    if (typeof date === 'string') {
      return date;
    }
    if (date && typeof date === 'object' && 'seconds' in date) {
      return formatDistanceToNow(new Date(date.seconds * 1000), { addSuffix: true });
    }
    if (date instanceof Date) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return 'Unknown date';
  };

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,247,0.1)]">
          <div className="relative">
            <img 
              src={episode.coverImageURL || '/placeholder.svg'} 
              alt={episode.title}
              className="w-full h-48 object-cover"
            />
            <Button 
              className="absolute bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-adapty-aqua hover:bg-adapty-aqua/90"
              onClick={() => setPlayerOpen(true)}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-2 flex justify-between text-sm text-gray-400">
              <span>AI Podcast</span>
              <span>{formatDate(episode.date)}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
            <p className="text-gray-400 mb-4 flex-1 line-clamp-3">{episode.description}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">With {episode.guestName}</span>
              <Button 
                variant="ghost" 
                className="text-adapty-aqua hover:text-adapty-aqua/80 p-0"
                onClick={() => setPlayerOpen(true)}
              >
                Listen Now
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{episode.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PodcastPreview audioUrl={episode.audioLink} />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Guest: {episode.guestName}</h3>
            <p className="text-sm text-gray-400 mb-3">AI Podcast • {formatDate(episode.date)}</p>
            <p className="text-gray-300">{episode.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

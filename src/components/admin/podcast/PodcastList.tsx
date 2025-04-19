
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Loader2 } from 'lucide-react';
import { FirestorePodcast } from '@/services/firebase';

interface PodcastListProps {
  podcasts: FirestorePodcast[];
  onEdit: (podcast: FirestorePodcast) => void;
  onDelete: (podcastId: string) => void;
  isLoading: boolean;
  isDeletingPodcast: boolean;
}

export const PodcastList = ({ 
  podcasts, 
  onEdit, 
  onDelete, 
  isLoading,
  isDeletingPodcast 
}: PodcastListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
      </div>
    );
  }

  if (!podcasts || podcasts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No podcast episodes yet. Upload your first episode!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
      {podcasts.map((podcast) => (
        <Card key={podcast.id} className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold line-clamp-1">{podcast.title}</h3>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(podcast)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(podcast.id)}
                disabled={isDeletingPodcast}
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
  );
};

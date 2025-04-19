
import React from 'react';

interface PodcastPreviewProps {
  audioUrl: string;
}

export const PodcastPreview: React.FC<PodcastPreviewProps> = ({ audioUrl }) => {
  // Helper function to determine player type and format
  const getPlayerElement = () => {
    // Handle Spotify
    if (audioUrl.includes('spotify.com')) {
      // Convert regular URL to embed URL if needed
      const spotifyEmbedUrl = audioUrl.replace('spotify.com', 'spotify.com/embed');
      return (
        <iframe 
          src={spotifyEmbedUrl}
          width="100%" 
          height="152" 
          frameBorder="0" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Player"
        />
      );
    }
    
    // Handle SoundCloud
    if (audioUrl.includes('soundcloud.com')) {
      return (
        <iframe 
          width="100%" 
          height="166" 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(audioUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
          title="SoundCloud Player"
        />
      );
    }
    
    // Handle YouTube
    if (audioUrl.includes('youtube.com') || audioUrl.includes('youtu.be')) {
      // Extract video ID
      let videoId = '';
      if (audioUrl.includes('youtube.com/watch')) {
        videoId = new URL(audioUrl).searchParams.get('v') || '';
      } else if (audioUrl.includes('youtu.be/')) {
        videoId = audioUrl.split('youtu.be/')[1].split('?')[0];
      } else if (audioUrl.includes('youtube.com/embed/')) {
        videoId = audioUrl.split('youtube.com/embed/')[1].split('?')[0];
      }
      
      return (
        <iframe 
          width="100%" 
          height="200" 
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      );
    }
    
    // Direct MP3 or other audio formats - use HTML audio element
    if (audioUrl.endsWith('.mp3') || audioUrl.endsWith('.wav') || audioUrl.endsWith('.ogg')) {
      return (
        <audio controls className="w-full">
          <source src={audioUrl} type={`audio/${audioUrl.split('.').pop()}`} />
          Your browser does not support the audio element.
        </audio>
      );
    }
    
    // Default fallback for unknown formats
    return (
      <div className="p-4 bg-yellow-500/20 text-yellow-300 rounded">
        Unsupported audio format. Please use Spotify, SoundCloud, YouTube, or direct MP3 links.
      </div>
    );
  };

  return (
    <div className="w-full">
      {getPlayerElement()}
    </div>
  );
};

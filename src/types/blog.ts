
export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number };
  author: string;
  category: string;
  image: string;
}

export type DateFormatFunction = (date: string | { seconds: number }) => string;

export interface PodcastEpisode {
  id: string;
  title: string;           // Changed from episodeTitle to title
  description: string;
  audioLink: string;
  guestName: string;
  date: string;
  duration: string;
  coverImageURL: string;
}

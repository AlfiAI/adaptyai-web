
export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number } | Date; // Added Date as valid type
  author: string;
  category: string;
  image: string;
}

export type DateFormatFunction = (date: string | { seconds: number } | Date) => string; // Updated to include Date

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioLink: string;
  guestName: string;
  date: string;
  duration: string;
  coverImageURL: string;
}

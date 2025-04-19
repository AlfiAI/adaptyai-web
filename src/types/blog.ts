
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

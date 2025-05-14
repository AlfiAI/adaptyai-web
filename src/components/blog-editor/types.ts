
import { BlogPostData } from '@/lib/dataAccess/types';

// FAQ and Key takeaways interfaces
export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogFormData extends Partial<BlogPostData> {
  key_takeaways: string[];
  faqs: FAQ[];
  coverImageFile?: File | null;
}

// Default blog post data
export const defaultBlogPost: Partial<BlogPostData> = {
  title: '',
  excerpt: '',
  body: '',
  tags: [],
  featured: false,
  cover_image_url: '',
  slug: '',
  published_at: new Date(),
};

// Local storage key for autosave
export const AUTOSAVE_KEY = 'blog-editor-autosave';

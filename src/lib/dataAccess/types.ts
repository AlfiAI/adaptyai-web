
/**
 * Common interfaces for the data access layer
 * These interfaces define the shape of data across different storage providers
 */

// User Interfaces
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date | string;
  avatarUrl?: string;
}

// Blog Post Interfaces
export interface BlogPostData {
  id: string; // Changed from optional to required
  title: string;
  excerpt: string;
  body: string;
  author: string;
  published_at: Date | string;
  tags: string[];
  cover_image_url: string;
}

// Podcast Interfaces
export interface PodcastData {
  id: string; // Changed from optional to required
  title: string;
  description: string;
  audio_url: string;
  guest_name?: string;
  duration: string;
  published_at: Date | string;
  cover_image_url: string;
}

// AI Assistant Interfaces
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  messages: ConversationMessage[];
}

// Generic Repository Interface
export interface DataRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<string>;
  update(id: string, data: Partial<T>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

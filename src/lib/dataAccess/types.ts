
export * from './config';
export * from './factory';

// Base repository interface for data access
export interface DataRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<string>;
  update(id: string, data: Partial<T>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

// Agent information interface
export interface AgentInfo {
  id: string;
  name: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  agentType: 'aviation' | 'insurance' | 'sustainability' | 'cybersecurity' | 'operator';
  capabilities: string[];
  avatarUrl?: string;
  themeColor: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Agent feature interface
export interface AgentFeature {
  id: string;
  agentId: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
}

// Agent FAQ interface
export interface AgentFaq {
  id: string;
  agentId: string;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt?: Date;
}

// Blog post data interface
export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  published_at: Date;
  tags: string[];
  cover_image_url: string;
  featured: boolean;
}

// Podcast episode data interface
export interface PodcastData {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  guest_name?: string;
  duration: string;
  published_at: Date;
  cover_image_url: string;
}

// Data provider types
export type DataProviderType = 'Firebase' | 'Supabase';

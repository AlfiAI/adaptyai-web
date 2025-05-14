
/**
 * Common interfaces for the data access layer
 * These interfaces define the shape of data across different storage providers
 */

// User Interfaces
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer' | null;
  createdAt: Date | string;
  avatarUrl?: string;
}

// Blog Post Interfaces
export interface BlogPostData {
  id: string; 
  title: string;
  excerpt: string;
  body: string;
  author: string;
  published_at: Date | string;
  tags: string[];
  cover_image_url: string;
  slug: string;
  featured: boolean;
}

// Podcast Interfaces
export interface PodcastData {
  id: string; 
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
  // Optional embedding field for when we can add pgvector
  embedding?: number[];
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  messages: ConversationMessage[];
}

// Agent Info Interface
export interface AgentInfo {
  id: string;
  name: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  agentType: 'aviation' | 'insurance' | 'sustainability' | 'cybersecurity' | 'operator';
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  themeColor: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Generic Repository Interface
export interface DataRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<string>;
  update(id: string, data: Partial<T>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

// Additional interface for conversation repositories
export interface ConversationRepository extends DataRepository<Conversation> {
  addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>): Promise<string>;
  getConversationsForUser(userId: string): Promise<Conversation[]>;
}

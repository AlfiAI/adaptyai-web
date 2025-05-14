
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

// Agent information interface - used as AgentData throughout the application
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
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Alias AgentData for backward compatibility
export type AgentData = AgentInfo;

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
  createdAt?: Date | string;
}

// Blog post data interface
export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  published_at: Date | string;
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
  published_at: Date | string;
  cover_image_url: string;
}

// User profile interface
export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  avatarUrl?: string;
  createdAt: Date | string;
  lastLogin?: Date | string;
  roles?: string[];
}

// Conversation message interface
export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date | string;
  metadata?: Record<string, any>;
}

// Conversation interface
export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Extended repository interface for conversations
export interface ConversationRepository extends DataRepository<Conversation> {
  addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>): Promise<string>;
  getConversationsForUser(userId: string): Promise<Conversation[]>;
}

// Data provider types
export type DataProviderType = 'Firebase' | 'Supabase';

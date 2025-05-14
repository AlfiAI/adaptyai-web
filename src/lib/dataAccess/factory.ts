import { FirebaseAgentRepository } from './repositories/agentRepository';
import { SupabaseAgentRepository } from './repositories/supabase/agentRepository';
import { FirebaseBlogRepository } from './repositories/blogRepository';
import { SupabaseBlogRepository } from './repositories/supabase/blogSBRepository';
import { FirebasePodcastRepository } from './repositories/podcastRepository';
import { SupabasePodcastRepository } from './repositories/supabase/podcastSBRepository';
import { FirebaseConversationRepository } from './repositories/conversationRepository';
import { SupabaseConversationRepository } from './repositories/supabase/conversationSBRepository';
import { DataProvider, getDataProvider } from './config';

/**
 * Repository Factory for creating and managing data repositories
 */
export class RepositoryFactory {
  private static currentProvider: DataProvider = DataProvider.FIREBASE;

  /**
   * Set the data provider for all repositories
   */
  static setProvider(provider: DataProvider): void {
    RepositoryFactory.currentProvider = provider;
  }

  /**
   * Get current data provider
   */
  static getProvider(): DataProvider {
    return RepositoryFactory.currentProvider;
  }

  /**
   * Create repository instance for blog data
   */
  static createBlogRepository() {
    return RepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseBlogRepository()
      : new FirebaseBlogRepository();
  }

  /**
   * Create repository instance for podcast data
   */
  static createPodcastRepository() {
    return RepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabasePodcastRepository()
      : new FirebasePodcastRepository();
  }

  /**
   * Create repository instance for agent data
   */
  static createAgentRepository() {
    return RepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseAgentRepository()
      : new FirebaseAgentRepository();
  }

  /**
   * Create repository instance for conversation data
   */
  static createConversationRepository() {
    return RepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseConversationRepository()
      : new FirebaseConversationRepository();
  }
}

/**
 * Get repository instance for agent data
 */
export function getAgentRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabaseAgentRepository();
  }
  
  return new FirebaseAgentRepository();
}

/**
 * Get repository instance for blog data
 */
export function getBlogRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabaseBlogRepository();
  }
  
  return new FirebaseBlogRepository();
}

/**
 * Get repository instance for podcast data
 */
export function getPodcastRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabasePodcastRepository();
  }
  
  return new FirebasePodcastRepository();
}

/**
 * Get repository instance for conversation data
 */
export function getConversationRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabaseConversationRepository();
  }
  
  return new FirebaseConversationRepository();
}

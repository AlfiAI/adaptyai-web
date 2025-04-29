
import { FirebaseBlogRepository } from './repositories/blogRepository';
import { FirebasePodcastRepository } from './repositories/podcastRepository';
import { FirebaseConversationRepository } from './repositories/conversationRepository';
import type { BlogPostData, PodcastData, Conversation } from './types';
import type { DataRepository } from './types';

/**
 * Data provider enum to specify which storage system to use
 */
export enum DataProvider {
  FIREBASE = 'firebase',
  SUPABASE = 'supabase',
}

/**
 * Factory that creates repositories based on specified storage provider
 */
export class RepositoryFactory {
  private static provider: DataProvider = DataProvider.FIREBASE;

  /**
   * Set the global data provider
   */
  static setProvider(provider: DataProvider): void {
    this.provider = provider;
    console.log(`Data provider set to: ${provider}`);
  }

  /**
   * Get current global data provider
   */
  static getProvider(): DataProvider {
    return this.provider;
  }

  /**
   * Create a blog repository
   */
  static createBlogRepository(): DataRepository<BlogPostData> {
    switch (this.provider) {
      case DataProvider.FIREBASE:
        return new FirebaseBlogRepository();
      case DataProvider.SUPABASE:
        // Will be implemented in phase 2
        console.warn('Supabase blog repository not yet implemented, falling back to Firebase');
        return new FirebaseBlogRepository();
      default:
        return new FirebaseBlogRepository();
    }
  }

  /**
   * Create a podcast repository
   */
  static createPodcastRepository(): DataRepository<PodcastData> {
    switch (this.provider) {
      case DataProvider.FIREBASE:
        return new FirebasePodcastRepository();
      case DataProvider.SUPABASE:
        // Will be implemented in phase 2
        console.warn('Supabase podcast repository not yet implemented, falling back to Firebase');
        return new FirebasePodcastRepository();
      default:
        return new FirebasePodcastRepository();
    }
  }

  /**
   * Create a conversation repository
   */
  static createConversationRepository(): DataRepository<Conversation> & { addMessage: (conversationId: string, message: any) => Promise<string> } {
    switch (this.provider) {
      case DataProvider.FIREBASE:
        return new FirebaseConversationRepository();
      case DataProvider.SUPABASE:
        // Will be implemented in phase 2
        console.warn('Supabase conversation repository not yet implemented, falling back to Firebase');
        return new FirebaseConversationRepository();
      default:
        return new FirebaseConversationRepository();
    }
  }
}

/**
 * Helper function to get the blog repository
 */
export const getBlogRepository = (): DataRepository<BlogPostData> => {
  return RepositoryFactory.createBlogRepository();
};

/**
 * Helper function to get the podcast repository
 */
export const getPodcastRepository = (): DataRepository<PodcastData> => {
  return RepositoryFactory.createPodcastRepository();
};

/**
 * Helper function to get the conversation repository
 */
export const getConversationRepository = (): DataRepository<Conversation> & { addMessage: (conversationId: string, message: any) => Promise<string> } => {
  return RepositoryFactory.createConversationRepository();
};

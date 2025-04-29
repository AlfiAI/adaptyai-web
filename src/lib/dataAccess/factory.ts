import { FirebaseBlogRepository } from './repositories/blogRepository';
import { FirebasePodcastRepository } from './repositories/podcastRepository';
import { FirebaseConversationRepository } from './repositories/conversationRepository';
import { SupabaseBlogRepository } from './repositories/supabase/blogSBRepository';
import { SupabasePodcastRepository } from './repositories/supabase/podcastSBRepository';
import { SupabaseConversationRepository } from './repositories/supabase/conversationSBRepository';
import { FirebaseUserRepository } from './repositories/userRepository';
import { SupabaseUserRepository } from './repositories/supabase/userSBRepository';
import { FirebaseAgentRepository } from './repositories/agentRepository';
import { SupabaseAgentRepository } from './repositories/supabase/agentSBRepository';
import dataConfig, { DataProvider } from './config';

import type { BlogPostData, PodcastData, Conversation, ConversationRepository, UserProfile, AgentInfo } from './types';
import type { DataRepository } from './types';

/**
 * Factory that creates repositories based on specified storage provider
 */
export class RepositoryFactory {
  private static provider: DataProvider = dataConfig.provider;

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
   * Get provider for a specific feature from feature flags
   */
  private static getProviderForFeature(feature: keyof typeof dataConfig.features): DataProvider {
    return dataConfig.features[feature] || this.provider;
  }

  /**
   * Create a blog repository
   */
  static createBlogRepository(): DataRepository<BlogPostData> {
    const provider = this.getProviderForFeature('blogs');
    if (dataConfig.debug) console.log(`Creating blog repository with ${provider} provider`);
    
    switch (provider) {
      case DataProvider.FIREBASE:
        return new FirebaseBlogRepository();
      case DataProvider.SUPABASE:
        return new SupabaseBlogRepository();
      default:
        return new FirebaseBlogRepository();
    }
  }

  /**
   * Create a podcast repository
   */
  static createPodcastRepository(): DataRepository<PodcastData> {
    const provider = this.getProviderForFeature('podcasts');
    if (dataConfig.debug) console.log(`Creating podcast repository with ${provider} provider`);
    
    switch (provider) {
      case DataProvider.FIREBASE:
        return new FirebasePodcastRepository();
      case DataProvider.SUPABASE:
        return new SupabasePodcastRepository();
      default:
        return new FirebasePodcastRepository();
    }
  }

  /**
   * Create a conversation repository
   */
  static createConversationRepository(): ConversationRepository {
    const provider = this.getProviderForFeature('conversations');
    if (dataConfig.debug) console.log(`Creating conversation repository with ${provider} provider`);
    
    switch (provider) {
      case DataProvider.FIREBASE:
        return new FirebaseConversationRepository();
      case DataProvider.SUPABASE:
        return new SupabaseConversationRepository();
      default:
        return new FirebaseConversationRepository();
    }
  }
  
  /**
   * Create a user repository
   */
  static createUserRepository(): DataRepository<UserProfile> {
    const provider = this.getProviderForFeature('users');
    if (dataConfig.debug) console.log(`Creating user repository with ${provider} provider`);
    
    switch (provider) {
      case DataProvider.FIREBASE:
        return new FirebaseUserRepository();
      case DataProvider.SUPABASE:
        return new SupabaseUserRepository();
      default:
        return new FirebaseUserRepository();
    }
  }
  
  /**
   * Create an agent info repository
   */
  static createAgentRepository(): DataRepository<AgentInfo> {
    const provider = this.getProviderForFeature('agents');
    if (dataConfig.debug) console.log(`Creating agent repository with ${provider} provider`);
    
    switch (provider) {
      case DataProvider.FIREBASE:
        return new FirebaseAgentRepository();
      case DataProvider.SUPABASE:
        return new SupabaseAgentRepository();
      default:
        return new FirebaseAgentRepository();
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
export const getConversationRepository = (): ConversationRepository => {
  return RepositoryFactory.createConversationRepository();
};

/**
 * Helper function to get the user repository
 */
export const getUserRepository = (): DataRepository<UserProfile> => {
  return RepositoryFactory.createUserRepository();
};

/**
 * Helper function to get the agent repository
 */
export const getAgentRepository = (): DataRepository<AgentInfo> => {
  return RepositoryFactory.createAgentRepository();
};


import { DataProvider } from './config';
import { FirebaseAgentRepository } from './repositories/agentRepository';
import { SupabaseAgentRepository } from './repositories/supabase/agentRepository';
import { FirebaseBlogRepository } from './repositories/blogRepository';
import { FirebasePodcastRepository } from './repositories/podcastRepository';
import { SupabaseBlogRepository } from './repositories/supabase/blogSBRepository';
import { SupabasePodcastRepository } from './repositories/supabase/podcastSBRepository';
import { FirebaseConversationRepository } from './repositories/conversationRepository';
import { SupabaseConversationRepository } from './repositories/supabase/conversationSBRepository';
import { FirebaseUserRepository } from './repositories/userRepository';
import { SupabaseUserRepository } from './repositories/supabase/userSBRepository';

import dataConfig, { updateDataProvider, updateFeatureFlag } from './config';

/**
 * Get the appropriate repository for agent data
 */
export const getAgentRepository = () => {
  const provider = dataConfig.features.agents;
  
  if (provider === DataProvider.FIREBASE) {
    return new FirebaseAgentRepository();
  }
  
  return new SupabaseAgentRepository();
};

/**
 * Get the appropriate repository for blog data
 */
export const getBlogRepository = () => {
  const provider = dataConfig.features.blogs;

  if (provider === DataProvider.FIREBASE) {
    return new FirebaseBlogRepository();
  }

  return new SupabaseBlogRepository();
};

/**
 * Get the appropriate repository for podcast data
 */
export const getPodcastRepository = () => {
  const provider = dataConfig.features.podcasts;

  if (provider === DataProvider.FIREBASE) {
    return new FirebasePodcastRepository();
  }

  return new SupabasePodcastRepository();
};

/**
 * Get the appropriate repository for conversation data
 */
export const getConversationRepository = () => {
  const provider = dataConfig.features.conversations;

  if (provider === DataProvider.FIREBASE) {
    return new FirebaseConversationRepository();
  }

  return new SupabaseConversationRepository();
};

/**
 * Get the appropriate repository for user data
 */
export const getUserRepository = () => {
  const provider = dataConfig.features.users;

  if (provider === DataProvider.FIREBASE) {
    return new FirebaseUserRepository();
  }

  return new SupabaseUserRepository();
};

/**
 * Factory class for creating repositories
 */
export class RepositoryFactory {
  private static currentProvider: DataProvider = DataProvider.FIREBASE;
  
  /**
   * Set the current provider for all repositories
   */
  static setProvider(provider: DataProvider): void {
    this.currentProvider = provider;
  }
  
  /**
   * Create blog repository
   */
  static createBlogRepository() {
    if (this.currentProvider === DataProvider.FIREBASE) {
      return new FirebaseBlogRepository();
    }
    return new SupabaseBlogRepository();
  }
  
  /**
   * Create podcast repository
   */
  static createPodcastRepository() {
    if (this.currentProvider === DataProvider.FIREBASE) {
      return new FirebasePodcastRepository();
    }
    return new SupabasePodcastRepository();
  }
  
  /**
   * Create conversation repository
   */
  static createConversationRepository() {
    if (this.currentProvider === DataProvider.FIREBASE) {
      return new FirebaseConversationRepository();
    }
    return new SupabaseConversationRepository();
  }
  
  /**
   * Create agent repository
   */
  static createAgentRepository() {
    if (this.currentProvider === DataProvider.FIREBASE) {
      return new FirebaseAgentRepository();
    }
    return new SupabaseAgentRepository();
  }
  
  /**
   * Create user repository
   */
  static createUserRepository() {
    if (this.currentProvider === DataProvider.FIREBASE) {
      return new FirebaseUserRepository();
    }
    return new SupabaseUserRepository();
  }
}

export {
  updateDataProvider,
  updateFeatureFlag
};

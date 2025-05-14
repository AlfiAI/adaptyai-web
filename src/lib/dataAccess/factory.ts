import { DataProvider } from './config';
import { FirebaseAgentRepository } from './repositories/agentRepository';
import { SupabaseAgentRepository } from './repositories/supabase/agentRepository';
import { FirestoreBlogRepository } from './repositories/blogRepository';
import { FirestorePodcastRepository } from './repositories/podcastRepository';
import { SupabaseBlogRepository } from './repositories/supabase/blogSBRepository';
import { SupabasePodcastRepository } from './repositories/supabase/podcastSBRepository';
import { FirestoreConversationRepository } from './repositories/conversationRepository';
import { SupabaseConversationRepository } from './repositories/supabase/conversationSBRepository';
import { FirestoreUserRepository } from './repositories/userRepository';
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
    return new FirestoreBlogRepository();
  }

  return new SupabaseBlogRepository();
};

/**
 * Get the appropriate repository for podcast data
 */
export const getPodcastRepository = () => {
  const provider = dataConfig.features.podcasts;

  if (provider === DataProvider.FIREBASE) {
    return new FirestorePodcastRepository();
  }

  return new SupabasePodcastRepository();
};

/**
 * Get the appropriate repository for conversation data
 */
export const getConversationRepository = () => {
  const provider = dataConfig.features.conversations;

  if (provider === DataProvider.FIREBASE) {
    return new FirestoreConversationRepository();
  }

  return new SupabaseConversationRepository();
};

/**
 * Get the appropriate repository for user data
 */
export const getUserRepository = () => {
  const provider = dataConfig.features.users;

  if (provider === DataProvider.FIREBASE) {
    return new FirestoreUserRepository();
  }

  return new SupabaseUserRepository();
};

export {
  updateDataProvider,
  updateFeatureFlag
};

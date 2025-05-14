
import { FirebaseConversationRepository } from '../repositories/conversationRepository';
import { SupabaseConversationRepository } from '../repositories/supabase/conversationSBRepository';
import { BaseRepositoryFactory } from './baseRepositoryFactory';
import { DataProvider, getDataProvider } from '../config';

/**
 * Factory for creating conversation repositories
 */
export class ConversationRepositoryFactory extends BaseRepositoryFactory {
  /**
   * Create repository instance for conversation data
   */
  static createConversationRepository() {
    return ConversationRepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseConversationRepository()
      : new FirebaseConversationRepository();
  }
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

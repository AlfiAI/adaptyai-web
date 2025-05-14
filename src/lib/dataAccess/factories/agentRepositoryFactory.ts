
import { FirebaseAgentRepository } from '../repositories/agentRepository';
import { SupabaseAgentRepository } from '../repositories/supabase/agentRepository';
import { BaseRepositoryFactory } from './baseRepositoryFactory';
import { DataProvider, getDataProvider } from '../config';

/**
 * Factory for creating agent repositories
 */
export class AgentRepositoryFactory extends BaseRepositoryFactory {
  /**
   * Create repository instance for agent data
   */
  static createAgentRepository() {
    return AgentRepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseAgentRepository()
      : new FirebaseAgentRepository();
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

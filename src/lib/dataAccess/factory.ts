import { FirebaseAgentRepository } from './repositories/agentRepository';
import { SupabaseAgentRepository } from './repositories/supabase/agentRepository';
import { getDataProvider } from './config';

/**
 * Get repository instance for agent data
 */
export function getAgentRepository() {
  const provider = getDataProvider();
  
  if (provider === 'Supabase') {
    return new SupabaseAgentRepository();
  }
  
  return new FirebaseAgentRepository();
}

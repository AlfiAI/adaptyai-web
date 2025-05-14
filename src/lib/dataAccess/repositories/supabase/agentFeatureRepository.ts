
import { BaseSBRepository } from './baseSBRepository';
import { AgentFeature } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for agent features using Supabase
 */
export class AgentFeatureRepository extends BaseSBRepository<AgentFeature> {
  constructor() {
    super('agent_features');
  }

  /**
   * Get all features for a specific agent
   */
  async getByAgentId(agentId: string): Promise<AgentFeature[]> {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(feature => this.mapToFeature(feature));
    } catch (error) {
      return this.handleError(error, 'get agent features');
    }
  }
  
  /**
   * Map Supabase data to AgentFeature object
   */
  private mapToFeature(data: any): AgentFeature {
    return {
      id: data.id,
      agentId: data.agent_id,
      title: data.title,
      description: data.description,
      icon: data.icon,
      displayOrder: data.display_order
    };
  }

  // Helper method to access the Supabase table
  protected getTable() {
    return supabase.from('agent_features');
  }

  protected tableName = 'agent_features';
}

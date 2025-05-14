
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
   * Create a new feature for an agent
   */
  async createFeature(agentId: string, feature: Omit<AgentFeature, 'id' | 'agentId'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          agent_id: agentId,
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          display_order: feature.displayOrder
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (!data || !data.id) {
        throw new Error('Failed to create feature');
      }
      
      return data.id;
    } catch (error) {
      return this.handleError(error, 'create agent feature');
    }
  }

  /**
   * Update an existing feature
   */
  async updateFeature(featureId: string, feature: Partial<Omit<AgentFeature, 'id' | 'agentId'>>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (feature.title) updateData.title = feature.title;
      if (feature.description) updateData.description = feature.description;
      if (feature.icon) updateData.icon = feature.icon;
      if (feature.displayOrder !== undefined) updateData.display_order = feature.displayOrder;
      
      const { error } = await this.getTable()
        .update(updateData)
        .eq('id', featureId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, 'update agent feature');
    }
  }

  /**
   * Delete a feature
   */
  async deleteFeature(featureId: string): Promise<boolean> {
    try {
      const { error } = await this.getTable()
        .delete()
        .eq('id', featureId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, 'delete agent feature');
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
}

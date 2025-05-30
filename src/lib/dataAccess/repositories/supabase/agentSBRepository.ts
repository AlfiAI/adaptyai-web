
import { BaseSBRepository } from './baseSBRepository';
import { AgentData, AgentInfo } from '../../types';
import { AgentFeatureRepository } from './agentFeatureRepository';
import { AgentFaqRepository } from './agentFaqRepository';
import { AgentBaseRepository } from '../../repositories/baseRepository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for agent data using Supabase
 */
export class SupabaseAgentRepository extends AgentBaseRepository<AgentInfo> {
  private featureRepository: AgentFeatureRepository;
  private faqRepository: AgentFaqRepository;

  constructor() {
    super('Supabase');
    this.featureRepository = new AgentFeatureRepository();
    this.faqRepository = new AgentFaqRepository();
  }

  async getAll(): Promise<AgentInfo[]> {
    try {
      const { data, error } = await this.getTable().select('*');
      
      if (error) throw error;
      
      return data.map(item => this.mapToAgentData(item));
    } catch (error) {
      return this.handleError(error, 'get all agents');
    }
  }

  async getById(id: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Record not found
        }
        throw error;
      }
      
      return this.mapToAgentData(data);
    } catch (error) {
      return this.handleError(error, 'get agent by id');
    }
  }

  async getBySlug(slug: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Record not found
        }
        throw error;
      }
      
      return this.mapToAgentData(data);
    } catch (error) {
      return this.handleError(error, 'get agent by slug');
    }
  }

  async getFeatures(agentId: string) {
    return this.featureRepository.getByAgentId(agentId);
  }

  async getFAQs(agentId: string) {
    return this.faqRepository.getByAgentId(agentId);
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          name: agentData.name,
          title: agentData.title,
          short_description: agentData.shortDescription,
          full_description: agentData.fullDescription,
          avatar_url: agentData.avatarUrl,
          theme_color: agentData.themeColor,
          agent_type: agentData.agentType,
          capabilities: agentData.capabilities,
          slug: agentData.slug
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (!data || !data.id) {
        throw new Error(`Failed to create ${this.tableName}`);
      }
      
      return data.id;
    } catch (error) {
      return this.handleError(error, `create ${this.tableName}`);
    }
  }

  async update(id: string, agentData: Partial<AgentInfo>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (agentData.name !== undefined) updateData.name = agentData.name;
      if (agentData.title !== undefined) updateData.title = agentData.title;
      if (agentData.shortDescription !== undefined) updateData.short_description = agentData.shortDescription;
      if (agentData.fullDescription !== undefined) updateData.full_description = agentData.fullDescription;
      if (agentData.avatarUrl !== undefined) updateData.avatar_url = agentData.avatarUrl;
      if (agentData.themeColor !== undefined) updateData.theme_color = agentData.themeColor;
      if (agentData.agentType !== undefined) updateData.agent_type = agentData.agentType;
      if (agentData.capabilities !== undefined) updateData.capabilities = agentData.capabilities;
      if (agentData.slug !== undefined) updateData.slug = agentData.slug;
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await this.getTable()
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, `update ${this.tableName}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.getTable()
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, `delete ${this.tableName}`);
    }
  }

  /**
   * Maps Supabase table row to AgentData object
   */
  private mapToAgentData(data: any): AgentInfo {
    return {
      id: data.id,
      name: data.name,
      title: data.title,
      shortDescription: data.short_description,
      fullDescription: data.full_description,
      avatarUrl: data.avatar_url,
      themeColor: data.theme_color,
      agentType: data.agent_type,
      capabilities: data.capabilities || [],
      slug: data.slug,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at
    };
  }

  // Helper method from BaseSBRepository to access the Supabase table
  protected getTable() {
    return supabase.from('agents');
  }

  protected tableName = 'agents';
}

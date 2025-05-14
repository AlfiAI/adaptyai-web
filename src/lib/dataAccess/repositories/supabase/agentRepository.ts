
import { BaseSBRepository } from './baseSBRepository';
import { AgentInfo, AgentFeature, AgentFaq } from '../../types';
import { AgentBaseRepository } from '../baseRepository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for agent data using Supabase
 */
export class SupabaseAgentRepository extends AgentBaseRepository<AgentInfo> {
  constructor() {
    super('Supabase');
  }

  async getAll(): Promise<AgentInfo[]> {
    try {
      const { data, error } = await supabase.from('agents').select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        title: item.title,
        shortDescription: item.short_description,
        fullDescription: item.full_description,
        avatarUrl: item.avatar_url,
        themeColor: item.theme_color,
        agentType: item.agent_type,
        capabilities: item.capabilities,
        slug: item.slug,
        createdAt: this.formatTimestamp(item.created_at),
        updatedAt: item.updated_at ? this.formatTimestamp(item.updated_at) : undefined
      }));
    } catch (error) {
      return this.handleError(error, 'get all agents');
    }
  }

  async getById(id: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Record not found
        }
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        agentType: data.agent_type,
        capabilities: data.capabilities,
        slug: data.slug,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, 'get agent by id');
    }
  }

  async getBySlug(slug: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Record not found
        }
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        agentType: data.agent_type,
        capabilities: data.capabilities,
        slug: data.slug,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, 'get agent by slug');
    }
  }

  async getFeatures(agentId: string): Promise<AgentFeature[]> {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(feature => ({
        id: feature.id,
        agentId: feature.agent_id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        displayOrder: feature.display_order
      }));
    } catch (error) {
      return this.handleError(error, 'get agent features');
    }
  }

  async getFAQs(agentId: string): Promise<AgentFaq[]> {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(faq => ({
        id: faq.id,
        agentId: faq.agent_id,
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.display_order,
        createdAt: faq.created_at ? this.formatTimestamp(faq.created_at) : undefined
      }));
    } catch (error) {
      return this.handleError(error, 'get agent FAQs');
    }
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('agents')
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
        throw new Error('Failed to create agent');
      }
      
      return data.id;
    } catch (error) {
      return this.handleError(error, 'create agent');
    }
  }

  async update(id: string, agentData: Partial<AgentInfo>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (agentData.name !== undefined) updateData.name = agentData.name;
      if (agentData.slug !== undefined) updateData.slug = agentData.slug;
      if (agentData.title !== undefined) updateData.title = agentData.title;
      if (agentData.shortDescription !== undefined) updateData.short_description = agentData.shortDescription;
      if (agentData.fullDescription !== undefined) updateData.full_description = agentData.fullDescription;
      if (agentData.agentType !== undefined) updateData.agent_type = agentData.agentType;
      if (agentData.capabilities !== undefined) updateData.capabilities = agentData.capabilities;
      if (agentData.avatarUrl !== undefined) updateData.avatar_url = agentData.avatarUrl;
      if (agentData.themeColor !== undefined) updateData.theme_color = agentData.themeColor;
      
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      return this.handleError(error, 'update agent');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // First delete related features and FAQs
      await supabase.from('agent_features').delete().eq('agent_id', id);
      await supabase.from('agent_faqs').delete().eq('agent_id', id);
      
      // Then delete the agent
      const { error } = await supabase.from('agents').delete().eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      return this.handleError(error, 'delete agent');
    }
  }

  // Helper method to format timestamps
  protected formatTimestamp(timestamp: string | null): string {
    if (!timestamp) return new Date().toISOString();
    return new Date(timestamp).toISOString();
  }
}

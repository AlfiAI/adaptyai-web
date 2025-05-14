
import { supabase } from '@/integrations/supabase/client';
import { AgentBaseRepository } from '../baseRepository';
import { AgentInfo, AgentFeature, AgentFaq } from '../../types';

/**
 * Repository for AI agent information using Supabase
 */
export class SupabaseAgentRepository extends AgentBaseRepository<AgentInfo> {
  constructor() {
    super('Supabase');
  }

  async getAll(): Promise<AgentInfo[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map(agent => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        title: agent.title,
        shortDescription: agent.short_description,
        fullDescription: agent.full_description,
        agentType: agent.agent_type,
        capabilities: agent.capabilities || [],
        avatarUrl: agent.avatar_url,
        themeColor: agent.theme_color,
        createdAt: this.formatTimestamp(agent.created_at),
        updatedAt: agent.updated_at ? this.formatTimestamp(agent.updated_at) : undefined
      })) || [];
    } catch (error) {
      return this.handleError(error, 'getAll agents');
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
          return null;
        }
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        agentType: data.agent_type,
        capabilities: data.capabilities || [],
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, 'getById agent');
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
          return null;
        }
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        agentType: data.agent_type,
        capabilities: data.capabilities || [],
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, 'getBySlug agent');
    }
  }

  async getFeatures(agentId: string): Promise<AgentFeature[]> {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data?.map(feature => ({
        id: feature.id,
        agentId: feature.agent_id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon || undefined,
        displayOrder: feature.display_order
      })) || [];
    } catch (error) {
      return this.handleError(error, 'getFeatures');
    }
  }

  async getFAQs(agentId: string): Promise<AgentFaq[]> {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data?.map(faq => ({
        id: faq.id,
        agentId: faq.agent_id,
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.display_order,
        createdAt: faq.created_at ? this.formatTimestamp(faq.created_at) : undefined
      })) || [];
    } catch (error) {
      return this.handleError(error, 'getFAQs');
    }
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert({
          name: agentData.name,
          slug: agentData.slug,
          title: agentData.title,
          short_description: agentData.shortDescription,
          full_description: agentData.fullDescription,
          agent_type: agentData.agentType,
          capabilities: agentData.capabilities,
          avatar_url: agentData.avatarUrl,
          theme_color: agentData.themeColor,
          created_at: new Date().toISOString(),
        }).select('id').single();

      if (error) {
        throw error;
      }

      return data?.id || '';
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

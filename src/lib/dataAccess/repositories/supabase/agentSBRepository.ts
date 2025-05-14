
import { BaseSBRepository } from './baseSBRepository';
import { AgentData, AgentInfo, AgentFeature, AgentFaq } from '../../types';
import { DataRepository } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for agent data using Supabase
 */
export class SupabaseAgentRepository extends BaseSBRepository<AgentData> implements DataRepository<AgentData> {
  constructor() {
    super('agents');
  }

  async getAll(): Promise<AgentData[]> {
    try {
      const { data, error } = await this.getTable().select('*');
      
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
        createdAt: item.created_at || new Date().toISOString()
      }));
    } catch (error) {
      return this.handleError(error, 'get all agents');
    }
  }

  async getById(id: string): Promise<AgentData | null> {
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
        createdAt: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(error, 'get agent by id');
    }
  }

  async getBySlug(slug: string): Promise<AgentData | null> {
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
        createdAt: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(error, 'get agent by slug');
    }
  }

  async getFeatures(agentId: string) {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        display_order: feature.display_order
      }));
    } catch (error) {
      return this.handleError(error, 'get agent features');
    }
  }

  async getFAQs(agentId: string) {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        display_order: faq.display_order
      }));
    } catch (error) {
      return this.handleError(error, 'get agent FAQs');
    }
  }

  async create(agentData: Omit<AgentData, 'id'>): Promise<string> {
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

  async update(id: string, agentData: Partial<AgentData>): Promise<boolean> {
    try {
      const { error } = await this.getTable()
        .update({
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
}

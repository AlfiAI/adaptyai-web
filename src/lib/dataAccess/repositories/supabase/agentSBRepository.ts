
import { BaseSBRepository } from './baseSBRepository';
import { AgentInfo, AgentFeature, AgentFaq } from '../../types';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAgentRepository extends BaseSBRepository<AgentInfo> {
  constructor() {
    super('agents');
  }
  
  private mapDbToAgentInfo(record: any): AgentInfo {
    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      title: record.title,
      shortDescription: record.short_description,
      fullDescription: record.full_description,
      agentType: record.agent_type,
      capabilities: record.capabilities,
      avatarUrl: record.avatar_url,
      themeColor: record.theme_color,
      createdAt: new Date(record.created_at),
      updatedAt: record.updated_at ? new Date(record.updated_at) : undefined
    };
  }
  
  private mapAgentInfoToDb(agentInfo: Partial<AgentInfo>): any {
    const dbRecord: Record<string, any> = {};
    
    if (agentInfo.name !== undefined) dbRecord.name = agentInfo.name;
    if (agentInfo.slug !== undefined) dbRecord.slug = agentInfo.slug;
    if (agentInfo.title !== undefined) dbRecord.title = agentInfo.title;
    if (agentInfo.shortDescription !== undefined) dbRecord.short_description = agentInfo.shortDescription;
    if (agentInfo.fullDescription !== undefined) dbRecord.full_description = agentInfo.fullDescription;
    if (agentInfo.agentType !== undefined) dbRecord.agent_type = agentInfo.agentType;
    if (agentInfo.capabilities !== undefined) dbRecord.capabilities = agentInfo.capabilities;
    if (agentInfo.avatarUrl !== undefined) dbRecord.avatar_url = agentInfo.avatarUrl;
    if (agentInfo.themeColor !== undefined) dbRecord.theme_color = agentInfo.themeColor;
    
    return dbRecord;
  }
  
  async getAll(): Promise<AgentInfo[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data || []).map(this.mapDbToAgentInfo);
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }
  
  async getById(id: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbToAgentInfo(data);
    } catch (error) {
      console.error(`Error fetching agent with id ${id}:`, error);
      return null;
    }
  }
  
  async getBySlug(slug: string): Promise<AgentInfo | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapDbToAgentInfo(data);
    } catch (error) {
      console.error(`Error fetching agent with slug ${slug}:`, error);
      return null;
    }
  }
  
  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const dbRecord = this.mapAgentInfoToDb(agentData);
      
      const { data, error } = await supabase
        .from('agents')
        .insert(dbRecord)
        .select('id')
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }
  
  async update(id: string, agentData: Partial<AgentInfo>): Promise<boolean> {
    try {
      const dbRecord = this.mapAgentInfoToDb(agentData);
      
      const { error } = await supabase
        .from('agents')
        .update(dbRecord)
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error updating agent ${id}:`, error);
      return false;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting agent ${id}:`, error);
      return false;
    }
  }
  
  // Additional methods for agent features and FAQs
  async getAgentFeatures(agentId: string): Promise<AgentFeature[]> {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(record => ({
        id: record.id,
        agentId: record.agent_id,
        title: record.title,
        description: record.description,
        icon: record.icon,
        displayOrder: record.display_order
      }));
    } catch (error) {
      console.error(`Error fetching features for agent ${agentId}:`, error);
      return [];
    }
  }
  
  async getAgentFaqs(agentId: string): Promise<AgentFaq[]> {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(record => ({
        id: record.id,
        agentId: record.agent_id,
        question: record.question,
        answer: record.answer,
        displayOrder: record.display_order,
        createdAt: record.created_at ? new Date(record.created_at) : undefined
      }));
    } catch (error) {
      console.error(`Error fetching FAQs for agent ${agentId}:`, error);
      return [];
    }
  }
}

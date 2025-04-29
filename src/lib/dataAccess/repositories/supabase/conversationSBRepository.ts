
import { BaseSBRepository } from './baseSBRepository';
import { Conversation, ConversationMessage, ConversationRepository } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for AI assistant conversations using Supabase
 */
export class SupabaseConversationRepository 
  extends BaseSBRepository<Conversation> 
  implements ConversationRepository {
  
  constructor() {
    super('conversations');
  }

  async getAll(): Promise<Conversation[]> {
    try {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      if (!conversationsData || conversationsData.length === 0) {
        return [];
      }
      
      const conversations: Conversation[] = [];
      
      for (const conversationData of conversationsData) {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationData.id)
          .order('timestamp', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        const messages = messagesData?.map(message => ({
          id: message.id,
          role: message.role as 'user' | 'assistant' | 'system',
          content: message.content,
          timestamp: this.formatTimestamp(message.timestamp),
          conversationId: message.conversation_id
        })) || [];
        
        conversations.push({
          id: conversationData.id,
          userId: conversationData.user_id || undefined,
          title: conversationData.title,
          createdAt: this.formatTimestamp(conversationData.created_at),
          updatedAt: this.formatTimestamp(conversationData.updated_at),
          messages
        });
      }
      
      return conversations;
    } catch (error) {
      return this.handleError(error, 'get conversations');
    }
  }

  async getById(id: string): Promise<Conversation | null> {
    try {
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (conversationError) {
        if (conversationError.code === 'PGRST116') {
          return null; // Record not found
        }
        throw conversationError;
      }
      
      if (!conversationData) return null;
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('timestamp', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      const messages = messagesData?.map(message => ({
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
        timestamp: this.formatTimestamp(message.timestamp),
        conversationId: message.conversation_id
      })) || [];
      
      return {
        id: conversationData.id,
        userId: conversationData.user_id || undefined,
        title: conversationData.title,
        createdAt: this.formatTimestamp(conversationData.created_at),
        updatedAt: this.formatTimestamp(conversationData.updated_at),
        messages
      };
    } catch (error) {
      return this.handleError(error, 'get conversation by id');
    }
  }

  async create(conversation: Omit<Conversation, 'id'>): Promise<string> {
    try {
      const { messages, ...conversationData } = conversation;
      
      // Create conversation record
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          user_id: conversationData.userId,
          title: conversationData.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (conversationError) throw conversationError;
      
      if (!newConversation || !newConversation.id) {
        throw new Error('Failed to create conversation');
      }
      
      // Add messages if present
      if (messages && messages.length > 0) {
        const messagesToInsert = messages.map(message => ({
          conversation_id: newConversation.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp instanceof Date 
            ? message.timestamp.toISOString() 
            : typeof message.timestamp === 'string'
              ? message.timestamp
              : new Date().toISOString()
        }));
        
        const { error: messagesError } = await supabase
          .from('messages')
          .insert(messagesToInsert);
        
        if (messagesError) throw messagesError;
      }
      
      return newConversation.id;
    } catch (error) {
      return this.handleError(error, 'create conversation');
    }
  }

  async update(id: string, conversation: Partial<Conversation>): Promise<boolean> {
    try {
      const { messages, ...conversationData } = conversation;
      
      // Update conversation record
      if (Object.keys(conversationData).length > 0) {
        const updates = {
          ...conversationData,
          updated_at: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('conversations')
          .update(updates)
          .eq('id', id);
        
        if (updateError) throw updateError;
      }
      
      // Add new messages if present
      if (messages && messages.length > 0) {
        const newMessages = messages.filter(message => !message.id);
        
        if (newMessages.length > 0) {
          const messagesToInsert = newMessages.map(message => ({
            conversation_id: id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp instanceof Date 
              ? message.timestamp.toISOString() 
              : typeof message.timestamp === 'string'
                ? message.timestamp
                : new Date().toISOString()
          }));
          
          const { error: messagesError } = await supabase
            .from('messages')
            .insert(messagesToInsert);
          
          if (messagesError) throw messagesError;
        }
      }
      
      return true;
    } catch (error) {
      return this.handleError(error, 'update conversation');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Due to cascade delete constraints, only need to delete the conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, 'delete conversation');
    }
  }

  async addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>): Promise<string> {
    try {
      // Insert the new message
      const { data, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp instanceof Date 
            ? message.timestamp.toISOString() 
            : typeof message.timestamp === 'string'
              ? message.timestamp
              : new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (messageError) throw messageError;
      
      if (!data || !data.id) {
        throw new Error('Failed to add message');
      }
      
      // Update the conversation's updated_at timestamp
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (updateError) throw updateError;
      
      return data.id;
    } catch (error) {
      return this.handleError(error, 'add message to conversation');
    }
  }

  async getConversationsForUser(userId: string): Promise<Conversation[]> {
    try {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      if (!conversationsData || conversationsData.length === 0) {
        return [];
      }
      
      const conversations: Conversation[] = [];
      
      for (const conversationData of conversationsData) {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationData.id)
          .order('timestamp', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        const messages = messagesData?.map(message => ({
          id: message.id,
          role: message.role as 'user' | 'assistant' | 'system',
          content: message.content,
          timestamp: this.formatTimestamp(message.timestamp),
          conversationId: message.conversation_id
        })) || [];
        
        conversations.push({
          id: conversationData.id,
          userId: conversationData.user_id,
          title: conversationData.title,
          createdAt: this.formatTimestamp(conversationData.created_at),
          updatedAt: this.formatTimestamp(conversationData.updated_at),
          messages
        });
      }
      
      return conversations;
    } catch (error) {
      return this.handleError(error, 'get conversations for user');
    }
  }
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getConversationRepository } from '@/lib/dataAccess';

interface LexMessage {
  type: 'user' | 'assistant';
  text: string;
}

interface LexState {
  conversationId: string | undefined;
  messages: LexMessage[];
  isOpen: boolean;
  isLoading: boolean;
  hasError: boolean;
  
  setConversationId: (id: string | undefined) => void;
  addMessage: (message: LexMessage) => void;
  setMessages: (messages: LexMessage[]) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
  setIsOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean) => void;
  
  loadConversation: (id: string) => Promise<void>;
}

export const useLexStore = create<LexState>()(
  persist(
    (set, get) => ({
      conversationId: undefined,
      messages: [{
        type: 'assistant',
        text: "Hello! I'm L.E.X., your AI assistant. How can I help you today?"
      }],
      isOpen: false,
      isLoading: false,
      hasError: false,
      
      setConversationId: (id) => set({ conversationId: id }),
      
      addMessage: (message) => set(state => ({ 
        messages: [...state.messages, message] 
      })),
      
      setMessages: (messages) => set({ messages }),
      
      clearMessages: () => set({ 
        messages: [{
          type: 'assistant',
          text: "Hello! I'm L.E.X., your AI assistant. How can I help you today?"
        }] 
      }),
      
      toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
      
      setIsOpen: (open) => set({ isOpen: open }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setHasError: (error) => set({ hasError: error }),
      
      loadConversation: async (id) => {
        try {
          const conversationRepo = getConversationRepository();
          const conversation = await conversationRepo.getById(id);
          
          if (conversation && conversation.messages.length > 0) {
            // Convert conversation messages to chat messages format
            const chatMessages = conversation.messages.map(msg => ({
              type: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
              text: msg.content
            }));
            
            // Only set messages if we have conversation history
            if (chatMessages.length > 0) {
              set({ messages: chatMessages, conversationId: id });
            }
          }
        } catch (error) {
          console.error('Error loading conversation history:', error);
        }
      },
    }),
    {
      name: 'adapty-lex-storage',
      partialize: (state) => ({ 
        conversationId: state.conversationId,
        messages: state.messages 
      }),
    }
  )
);

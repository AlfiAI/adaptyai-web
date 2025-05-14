import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToOpenRouter, Message } from '@/lib/openrouter';
import { getConversationRepository } from '@/lib/dataAccess';
import { ChatMessage } from './types';

export const useLexChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      text: "Hello! I'm L.E.X., your AI assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      
      try {
        const conversationRepo = getConversationRepository();
        const conversation = await conversationRepo.getById(conversationId);
        
        if (conversation && conversation.messages.length > 0) {
          const chatMessages = conversation.messages.map(msg => ({
            type: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
            text: msg.content
          }));
          
          if (chatMessages.length > 1) {
            setMessages(chatMessages);
          }
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };
    
    loadConversation();
  }, [conversationId]);

  const sendMessage = async (messageText: string) => {
    const userMessage = { type: 'user' as const, text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Format messages for OpenRouter API
      const formattedMessages: Message[] = messages.map(msg => ({
        role: msg.type === 'assistant' ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: userMessage.text
      });
      
      // Send to OpenRouter
      const { content, conversationId: newConversationId } = await sendMessageToOpenRouter(
        formattedMessages, 
        conversationId
      );
      
      // Update conversation ID if we got a new one
      if (newConversationId && newConversationId !== 'error' && newConversationId !== 'fallback') {
        setConversationId(newConversationId);
      }
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: content
      }]);
    } catch (error) {
      console.error('Error sending message to L.E.X.:', error);
      setHasError(true);
      
      toast({
        title: "Couldn't send message",
        description: "Please try again later.",
        variant: "destructive"
      });
      
      // Add fallback message
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length < 2) return;
    
    // Remove the error message
    setMessages(prev => prev.slice(0, -1));
    
    // Get the last user message
    let lastUserMessage: ChatMessage | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        lastUserMessage = messages[i];
        break;
      }
    }
    
    if (lastUserMessage) {
      sendMessage(lastUserMessage.text);
    }
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    conversationId,
    hasError,
    sendMessage,
    handleRetry
  };
};

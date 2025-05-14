// Note: In a production environment, this key should be stored securely in environment variables
const OPENROUTER_API_KEY = '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';

// Import the getConversationRepository from dataAccess index
import { getConversationRepository } from '@/lib/dataAccess';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToOpenRouter = async (
  messages: Message[], 
  conversationId?: string
): Promise<{ content: string, conversationId: string }> => {
  try {
    console.log('Sending message to OpenRouter:', messages);
    
    // Add system instructions if not present
    if (!messages.some(m => m.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: "You are L.E.X. (Logic and Emotional eXperience), an AI assistant for Adapty AI. You help answer questions about AI technologies, Adapty AI's services, and how to implement ethical AI solutions. Keep responses concise, friendly, and focused on providing value. Adapty AI specializes in custom AI agents including Waly (workflow optimization), Adam (data analysis), Mina (marketing insights), and Leo (learning & development)."
      });
    }
    
    // First, try to save the messages to the conversation repository
    try {
      const conversationRepo = getConversationRepository();
      
      // Create or update conversation
      let finalConversationId = conversationId;
      
      if (!finalConversationId) {
        // Create new conversation with optional userId field
        finalConversationId = await conversationRepo.create({
          title: messages.find(m => m.role === 'user')?.content.substring(0, 50) || 'New Conversation',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
          userId: undefined // Make userId optional in the type
        });
      }
      
      // Add user message
      const userMessage = messages.find(m => m.role === 'user' && m.content);
      if (userMessage) {
        await conversationRepo.addMessage(finalConversationId, {
          role: 'user',
          content: userMessage.content,
          timestamp: new Date()
        });
      }
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://adaptyai.agency',
          'X-Title': 'Adapty AI L.E.X. Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: messages,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API error:', response.status, errorData);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected response format from OpenRouter:', data);
        throw new Error('Unexpected response format from OpenRouter');
      }
      
      const assistantResponse = data.choices[0].message.content;
      
      // Save assistant response to conversation
      await conversationRepo.addMessage(finalConversationId, {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      });
      
      return { 
        content: assistantResponse,
        conversationId: finalConversationId
      };
    } catch (error) {
      console.error('Error with conversation repository:', error);
      // Fall back to just making the API call without saving conversation
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://adaptyai.agency',
          'X-Title': 'Adapty AI L.E.X. Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: messages,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return { 
        content: data.choices[0].message.content,
        conversationId: conversationId || 'fallback'
      };
    }
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    
    // Provide a fallback response if API fails
    return {
      content: "I'm having trouble connecting to my knowledge base right now. Please try again later or contact Adapty AI directly for assistance.",
      conversationId: conversationId || 'error'
    };
  }
};

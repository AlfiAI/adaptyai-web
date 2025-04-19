
const OPENROUTER_API_KEY = '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';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToOpenRouter = async (messages: Message[]): Promise<string> => {
  try {
    console.log('Sending message to OpenRouter:', messages);
    
    // Add system instructions if not present
    if (!messages.some(m => m.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: "You are L.E.X. (Logic and Emotional eXperience), an AI assistant for Adapty AI. You help answer questions about AI technologies, Adapty AI's services, and how to implement ethical AI solutions. Keep responses concise, friendly, and focused on providing value."
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
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    
    // Provide a fallback response if API fails
    return "I'm having trouble connecting to my knowledge base right now. Please try again later or contact Adapty AI directly for assistance.";
  }
};

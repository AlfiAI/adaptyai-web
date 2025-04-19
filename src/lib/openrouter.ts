
const OPENROUTER_API_KEY = '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';

export const sendMessageToOpenRouter = async (messages: any[]) => {
  try {
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
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    throw error;
  }
};

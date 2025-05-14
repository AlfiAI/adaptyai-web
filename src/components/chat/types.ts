
export interface ChatMessage {
  type: 'user' | 'assistant';
  text: string;
}

export interface AgentChatMessage extends ChatMessage {
  agentId?: string;
  agentName?: string;
}

export interface ChatSession {
  id: string;
  messages: AgentChatMessage[];
}

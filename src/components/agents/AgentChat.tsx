
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentInfo } from '@/lib/dataAccess/types';

type Message = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
};

type AgentChatProps = {
  agent: AgentInfo;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const AgentChat: React.FC<AgentChatProps> = ({ agent, isExpanded = false, onToggleExpand }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: `Hi, I'm ${agent.name}. ${agent.shortDescription} How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response (would connect to n8n/OpenRouter in production)
    setTimeout(() => {
      // Simulate different responses for different agents
      let responseContent = '';
      
      switch (agent.agentType) {
        case 'aviation':
          responseContent = "I can help you navigate aviation compliance regulations. Would you like me to explain the latest updates to Part 135 operations or discuss safety management systems?";
          break;
        case 'insurance':
          responseContent = "I'm analyzing your insurance needs. I can help evaluate policy coverage, identify gaps, or explain complex terms. What specific insurance question do you have?";
          break;
        case 'sustainability':
          responseContent = "I specialize in ESG reporting and sustainability strategies. I can guide you through regulatory frameworks or help develop eco-friendly initiatives. What sustainability challenge are you facing?";
          break;
        case 'cybersecurity':
          responseContent = "I'm monitoring for security threats. Would you like me to assess your current security posture, explain zero-trust architecture, or discuss incident response planning?";
          break;
        case 'operator':
          responseContent = "I'm Lex, your guide to the Adapty AI ecosystem. I can direct you to specialized agents like Mina (aviation), Mary (insurance), Waly (sustainability), or Adam (cybersecurity). What do you need help with?";
          break;
        default:
          responseContent = "I'm here to assist you. What would you like to know?";
      }
      
      const agentMessage: Message = {
        id: Date.now().toString(),
        role: 'agent',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div 
      className="bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden flex flex-col"
      style={{ 
        height: isExpanded ? '500px' : '400px',
        maxWidth: isExpanded ? '600px' : '400px',
        width: '100%'
      }}
    >
      {/* Chat header */}
      <div 
        className="px-4 py-3 border-b border-gray-700 flex items-center justify-between"
        style={{ backgroundColor: `${agent.themeColor}20` }}
      >
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 border-2" style={{ borderColor: agent.themeColor }}>
            <div className="w-full h-full flex items-center justify-center font-bold" 
                 style={{ backgroundColor: `${agent.themeColor}40`, color: agent.themeColor }}>
              {agent.name.charAt(0)}
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm text-gray-100">{agent.name}</h3>
            <p className="text-xs text-gray-400">{agent.title}</p>
          </div>
        </div>
        {onToggleExpand && (
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {isExpanded ? 'Minimize' : 'Expand'}
          </Button>
        )}
      </div>
      
      {/* Messages container */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-adapty-aqua/20 text-white' 
                    : `text-white ${agent.themeColor ? `bg-opacity-20` : 'bg-gray-700'}`
                }`}
                style={message.role !== 'user' ? { backgroundColor: `${agent.themeColor}20` } : {}}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="max-w-[80%] px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: `${agent.themeColor}20` }}
              >
                <div className="flex space-x-1 items-center">
                  <div className="typing-dot"></div>
                  <div className="typing-dot animation-delay-200"></div>
                  <div className="typing-dot animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-3 flex gap-2">
        <Textarea
          placeholder={`Ask ${agent.name} a question...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="resize-none bg-gray-900 border-gray-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      
      <style>
        {`
          .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${agent.themeColor || '#3CDFFF'};
            animation: typing 1.5s infinite ease-in-out;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
};

export default AgentChat;

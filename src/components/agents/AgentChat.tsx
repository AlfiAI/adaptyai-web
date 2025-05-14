
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AgentInfo } from '@/lib/dataAccess/types';
import { AgentChatMessage } from '@/components/chat/types';
import { useToast } from '@/hooks/use-toast';

interface AgentChatProps {
  agent: AgentInfo;
}

const AgentChat: React.FC<AgentChatProps> = ({ agent }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    { 
      type: 'assistant', 
      text: `Hi, I'm ${agent.name}, your ${agent.title}. How can I help you today?`,
      agentId: agent.id,
      agentName: agent.name
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: AgentChatMessage = {
      type: 'user',
      text: input,
      agentId: agent.id,
      agentName: 'User'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API to get the agent's response
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        let response: string;
        
        // Simple response logic based on agent type
        if (agent.agentType === 'aviation') {
          response = "As an aviation compliance specialist, I can help you navigate regulations and ensure your operations meet all safety standards.";
        } else if (agent.agentType === 'insurance') {
          response = "I specialize in analyzing insurance policies and identifying optimal coverage for your specific needs.";
        } else if (agent.agentType === 'sustainability') {
          response = "I can help your organization develop and implement effective ESG strategies and reporting frameworks.";
        } else if (agent.agentType === 'cybersecurity') {
          response = "I can identify potential security vulnerabilities and recommend best practices to protect your digital assets.";
        } else {
          response = "I'm here to assist you with any questions about our AI agents and services.";
        }
        
        const assistantMessage: AgentChatMessage = {
          type: 'assistant',
          text: response,
          agentId: agent.id,
          agentName: agent.name
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Header */}
      <div 
        className="p-4 flex items-center gap-3 border-b border-gray-700"
        style={{ backgroundColor: `${agent.themeColor}10` }}
      >
        <div 
          className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium"
          style={{ backgroundColor: `${agent.themeColor}30`, color: agent.themeColor }}
        >
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt={agent.name} className="rounded-full" />
          ) : (
            agent.name.charAt(0)
          )}
        </div>
        <div>
          <h3 className="font-bold" style={{ color: agent.themeColor }}>{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.title}</p>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div 
            key={i} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-gray-700 text-white' 
                  : `${agent.themeColor}15 border border-gray-700`
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: `${agent.themeColor}30`, color: agent.themeColor }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: agent.themeColor }}>
                    {agent.name}
                  </span>
                </div>
              )}
              <p className={message.type === 'assistant' ? 'text-gray-200' : ''}>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] rounded-lg p-3 ${agent.themeColor}15 border border-gray-700`}>
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: `${agent.themeColor}30`, color: agent.themeColor }}
                >
                  {agent.name.charAt(0)}
                </div>
                <span className="text-xs font-medium" style={{ color: agent.themeColor }}>
                  {agent.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <div className="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder={`Ask ${agent.name} a question...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-gray-800 border-gray-700 focus-visible:ring-adapty-aqua"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            style={{ backgroundColor: agent.themeColor }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          This is a demo chat. In a production environment, this would connect to our AI systems.
        </p>
      </div>
      
      <style jsx global>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: ${agent.themeColor};
          color: ${agent.themeColor};
          box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          animation: dot-typing 1.5s infinite linear;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
          16.667% {
            box-shadow: 9984px -5px 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
          33.333% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
          50% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px -5px 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
          66.667% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
          83.333% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px -5px 0 0 ${agent.themeColor};
          }
          100% {
            box-shadow: 9984px 0 0 0 ${agent.themeColor}, 9994px 0 0 0 ${agent.themeColor}, 10004px 0 0 0 ${agent.themeColor};
          }
        }
      `}</style>
    </div>
  );
};

export default AgentChat;

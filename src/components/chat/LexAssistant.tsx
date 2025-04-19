
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToOpenRouter, Message } from '@/lib/openrouter';
import { Loader2, X } from 'lucide-react';

interface ChatMessage {
  type: 'user' | 'assistant';
  text: string;
}

const LexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      text: "Hello! I'm L.E.X., your AI assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = { type: 'user' as const, text: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
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
      const response = await sendMessageToOpenRouter(formattedMessages);
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: response
      }]);
    } catch (error) {
      console.error('Error sending message to L.E.X.:', error);
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] mb-4 animate-slide-up shadow-[0_0_20px_rgba(0,255,247,0.2)] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/213caa2e-dffa-4921-a27e-2614469d9a30.png"
                alt="L.E.X. Avatar"
                className="w-8 h-8 rounded-full"
              />
              <h3 className="text-lg font-medium glow-text m-0">L.E.X. Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-adapty-aqua"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-[300px] overflow-y-auto mb-4 p-3 bg-black/30 rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start mb-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                {msg.type === 'assistant' && (
                  <img
                    src="/lovable-uploads/213caa2e-dffa-4921-a27e-2614469d9a30.png"
                    alt="L.E.X. Avatar"
                    className="w-6 h-6 rounded-full mr-2 mt-1"
                  />
                )}
                <div className={`p-2 rounded-lg max-w-[80%] ${
                  msg.type === 'assistant' 
                    ? 'bg-adapty-aqua/10 text-white border border-adapty-aqua/20' 
                    : 'bg-adapty-aqua text-black'
                }`}>
                  <p className="m-0 text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start mb-3">
                <img
                  src="/lovable-uploads/213caa2e-dffa-4921-a27e-2614469d9a30.png"
                  alt="L.E.X. Avatar"
                  className="w-6 h-6 rounded-full mr-2 mt-1"
                />
                <div className="bg-adapty-aqua/10 text-white p-2 rounded-lg border border-adapty-aqua/20">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <p className="m-0 text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80"
              type="submit"
              disabled={isLoading}
            >
              Send
            </Button>
          </form>
        </Card>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="w-14 h-14 rounded-full bg-transparent border-adapty-aqua animate-pulse-glow"
                onClick={() => setIsOpen(true)}
                data-lex-toggle="true"
              >
                <img
                  src="/lovable-uploads/213caa2e-dffa-4921-a27e-2614469d9a30.png"
                  alt="L.E.X. Avatar"
                  className="w-12 h-12 rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Ask L.E.X.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default LexAssistant;

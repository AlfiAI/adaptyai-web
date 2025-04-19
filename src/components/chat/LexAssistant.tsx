
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const LexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "Hello! I'm L.E.X., your AI assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = { type: 'user', text: message };
    setMessages([...messages, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would send a request to OpenRouter API
      // For now we'll simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: "I'm here to help with any questions about Adapty AI. What would you like to know about our services or technology?"
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message to L.E.X.:', error);
      toast({
        title: "Couldn't send message",
        description: "Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] mb-4 animate-slide-up p-4">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
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
                    ? 'bg-adapty-aqua/10 text-white' 
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
                <div className="bg-adapty-aqua/10 text-white p-2 rounded-lg">
                  <p className="m-0 text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua"
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

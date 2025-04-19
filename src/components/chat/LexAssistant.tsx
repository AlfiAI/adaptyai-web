
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] mb-4 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/6cd462eb-ca9c-4ea7-a2bf-6adf273252fa.png"
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
            <div className="flex items-start mb-3">
              <img
                src="/lovable-uploads/6cd462eb-ca9c-4ea7-a2bf-6adf273252fa.png"
                alt="L.E.X. Avatar"
                className="w-6 h-6 rounded-full mr-2 mt-1"
              />
              <div className="bg-adapty-aqua/10 text-white p-2 rounded-lg max-w-[80%]">
                <p className="m-0 text-sm">Hello! I'm L.E.X., your AI assistant. How can I help you today?</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua"
            />
            <Button className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80">
              Send
            </Button>
          </div>
        </Card>
      ) : (
        <Button 
          className="w-14 h-14 rounded-full bg-adapty-aqua text-black animate-pulse-glow"
          onClick={() => setIsOpen(true)}
        >
          <img
            src="/lovable-uploads/6cd462eb-ca9c-4ea7-a2bf-6adf273252fa.png"
            alt="L.E.X. Avatar"
            className="w-8 h-8 rounded-full"
          />
        </Button>
      )}
    </div>
  );
};

export default LexAssistant;

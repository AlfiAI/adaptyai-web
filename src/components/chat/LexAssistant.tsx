
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, MessageSquare } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInputForm from './ChatInputForm';
import { useLexChat } from './useLexChat';

const LexAssistant = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    conversationId,
    hasError,
    sendMessage,
    handleRetry
  } = useLexChat();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] mb-4 animate-slide-up shadow-[0_0_20px_rgba(0,255,247,0.2)] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/8a61a1a9-32d1-44df-ab93-d4d6dfae9992.png"
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

          <ChatMessageList 
            messages={messages} 
            isLoading={isLoading} 
            hasError={hasError} 
            onRetry={handleRetry} 
          />

          <ChatInputForm 
            isLoading={isLoading} 
            onSendMessage={sendMessage} 
          />
          
          {conversationId && conversationId !== 'error' && conversationId !== 'fallback' && (
            <div className="mt-2 flex justify-center">
              <p className="text-xs text-gray-400">
                <MessageSquare className="inline h-3 w-3 mr-1" />
                Conversation saved
              </p>
            </div>
          )}
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
                  src="/lovable-uploads/8a61a1a9-32d1-44df-ab93-d4d6dfae9992.png"
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

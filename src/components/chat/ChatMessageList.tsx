
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';
import ChatLoadingMessage from './ChatLoadingMessage';
import { ChatMessage } from './types';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

const ChatMessageList = ({ messages, isLoading, hasError, onRetry }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="h-[300px] overflow-y-auto mb-4 p-3 bg-black/30 rounded-md">
      {messages.map((msg, index) => (
        <ChatMessageItem key={index} message={msg} />
      ))}
      
      {isLoading && <ChatLoadingMessage />}
      
      {hasError && (
        <div className="flex justify-center my-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="text-xs border-adapty-aqua/40 text-adapty-aqua hover:bg-adapty-aqua/10"
          >
            <Loader2 className="h-3 w-3 mr-1" /> Retry message
          </Button>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;

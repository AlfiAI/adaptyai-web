
import React from 'react';
import { ChatMessage } from './types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  return (
    <div className={`flex items-start mb-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
      {message.type === 'assistant' && (
        <img
          src="/lovable-uploads/8a61a1a9-32d1-44df-ab93-d4d6dfae9992.png"
          alt="L.E.X. Avatar"
          className="w-6 h-6 rounded-full mr-2 mt-1"
        />
      )}
      <div className={`p-2 rounded-lg max-w-[80%] ${
        message.type === 'assistant' 
          ? 'bg-adapty-aqua/10 text-white border border-adapty-aqua/20' 
          : 'bg-adapty-aqua text-black'
      }`}>
        <p className="m-0 text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessageItem;

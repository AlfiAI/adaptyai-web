
import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatInputFormProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInputForm = ({ isLoading, onSendMessage }: ChatInputFormProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
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
  );
};

export default ChatInputForm;

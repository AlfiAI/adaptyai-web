
import React from 'react';
import { Loader2 } from 'lucide-react';

const ChatLoadingMessage = () => {
  return (
    <div className="flex items-start mb-3">
      <img
        src="/lovable-uploads/8a61a1a9-32d1-44df-ab93-d4d6dfae9992.png"
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
  );
};

export default ChatLoadingMessage;

// src/components/AIChatButton/ChatInput.tsx
import React, { useState, KeyboardEvent } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <input
          id="chat-input"
          name="chat-message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={disabled ? "Even geduld..." : "Typ je bericht..."}
          className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
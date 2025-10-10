// src/components/AIChatButton/ChatInput.tsx
import React, { useState, KeyboardEvent, useCallback, memo } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { cc, cn, colors } from '@/styles/shared';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = memo(({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, disabled, onSendMessage]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className={cn('p-4', cc.divider.horizontal, 'border-gray-100')}>
      <div className={cn(cc.flex.start, 'gap-2')}>
        <input
          id="chat-input"
          name="chat-message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={disabled ? "Even geduld..." : "Typ je bericht..."}
          className={cn(
            'flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 px-4 py-2 disabled:opacity-50',
            cc.border.circle,
            colors.primary.focus,
            'focus:ring-2 focus:ring-primary/50'
          )}
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={cn(
            'p-2 hover:bg-gray-100 disabled:opacity-50',
            colors.primary.text,
            cc.border.circle,
            cc.transition.colors
          )}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
// ChatMessage.tsx
import React from 'react';
import { Message } from './types';
import { cc, cn, colors } from '@/styles/shared';

interface ChatMessageProps {
  message: Message;
  onActionClick: (actionText: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
  const isAssistant = message.sender === 'assistant';
  
  // Split content om links te vinden
  const contentParts = React.useMemo(() => {
    // Check voor actie-links in het bericht (opmaak: "Klik hier om: [actie]")
    const actionRegex = /Klik hier om: (.*?)(?:\n|$)/;
    const actionMatch = message.content.match(actionRegex);
    
    if (actionMatch) {
      const parts = message.content.split(actionRegex);
      return {
        mainContent: parts[0],
        actionText: actionMatch[1],
        hasActionLink: true
      };
    }
    
    return {
      mainContent: message.content,
      hasActionLink: false
    };
  }, [message.content]);
  
  // Format tekst met regeleinden voor betere leesbaarheid
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className={cn(cc.flex.start, isAssistant ? 'justify-start' : 'justify-end')}>
      <div className={cn(
        'rounded-2xl p-4 max-w-[80%]',
        isAssistant ? 'bg-gray-100' : cn(colors.primary.bg, 'text-white')
      )}>
        <p className={isAssistant ? 'text-gray-800' : 'text-white'}>
          {formatContent(contentParts.mainContent)}
        </p>
        
        {contentParts.hasActionLink && contentParts.actionText && (
          <button 
            onClick={() => onActionClick(contentParts.actionText!)}
            className={cn(
              'mt-3 px-4 py-2 text-white font-medium cursor-pointer',
              colors.primary.bg,
              colors.primary.hover,
              cc.border.rounded,
              cc.transition.colors,
              cc.text.small
            )}
          >
            {contentParts.actionText}
          </button>
        )}
        
        <span className={cn('opacity-70 mt-2 block', cc.text.small)}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
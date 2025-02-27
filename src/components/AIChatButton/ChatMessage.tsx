// ChatMessage.tsx
import React from 'react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`
        rounded-2xl p-4 max-w-[80%]
        ${isAssistant ? 'bg-gray-100' : 'bg-primary text-white'}
      `}>
        <p className={isAssistant ? 'text-gray-800' : 'text-white'}>
          {formatContent(contentParts.mainContent)}
        </p>
        
        {contentParts.hasActionLink && (
          <button 
            className="mt-3 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
          >
            {contentParts.actionText}
          </button>
        )}
        
        <span className="text-xs opacity-70 mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
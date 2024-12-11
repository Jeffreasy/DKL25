import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.sender === 'assistant';
  
  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`
        rounded-2xl p-4 max-w-[80%]
        ${isAssistant ? 'bg-gray-100' : 'bg-primary text-white'}
      `}>
        <p className={isAssistant ? 'text-gray-800' : 'text-white'}>
          {message.content}
        </p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage; 
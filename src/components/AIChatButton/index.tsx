import { useState } from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import type { Message } from './types';

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: "Welkom bij de DKL Assistant! 👋\n\nDeze chat functie is momenteel in ontwikkeling en zal binnenkort beschikbaar zijn. Je kunt dan hier terecht voor al je vragen over De Koninklijke Loop.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-40">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-2xl w-[320px] sm:w-[380px] animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between border-b border-primary-dark/10">
            <div className="flex items-center gap-2">
              <SmartToyIcon className="text-white" />
              <span className="text-white font-heading font-semibold text-lg">DKL Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              aria-label="Sluit chat"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Chat container */}
          <div className="h-[450px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div className="flex justify-center mt-8">
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
                  🚀 Binnenkort beschikbaar!
                </div>
              </div>
            </div>

            {/* Disabled input */}
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gray-100 rounded-full p-3 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Chat functionaliteit komt binnenkort beschikbaar!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat button met "coming soon" badge */}
      <button
        onClick={toggleChat}
        className="group p-4 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in relative"
        aria-label="Open AI chat"
      >
        <SmartToyIcon 
          sx={{ fontSize: 28 }} 
          className="transition-transform group-hover:scale-110" 
        />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
      </button>
    </div>
  );
};

export default AIChatButton; 
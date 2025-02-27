// src/components/AIChatButton/AIChatButton.tsx
import { useState, useEffect, useRef } from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import { Message } from './types';
import { getIntroMessage, processMessage } from './aiChatService';

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Is de chat volledig actief? (Niet langer "Komt binnenkort beschikbaar")
  // Zet deze op true om de chat volledig te activeren!
  const isChatActive = true;
  
  // Startpunt suggesties
  const initialSuggestions = [
    "Wanneer is De Koninklijke Loop?",
    "Hoe kan ik meedoen?",
    "Welke afstanden zijn er?",
    "Is de route rolstoelvriendelijk?"
  ];

  // Functie om suggesties te genereren op basis van context
  const generateSuggestions = (userMessage: string, responseMessage: string): string[] => {
    // Eenvoudige implementatie - baseer het op de laatste interactie
    if (responseMessage.includes("afstand")) {
      return ["Is de 2,5 km iets voor mij?", "Hoe pittig is de 6 km?", "Ben ik klaar voor de 10 km?"];
    } else if (responseMessage.includes("deelname") || responseMessage.includes("meedoen")) {
      return ["Wanneer sluit de inschrijving?", "Moet je betalen om mee te doen?", "Hoeveel mensen kunnen maximaal meelopen?"];
    } else if (responseMessage.includes("goede doel") || responseMessage.includes("sponsor")) {
      return ["Welk goed doel steunen we?", "Hoe kan ik doneren?", "Kan een bedrijf sponsoren?"];
    } else {
      // Standaardsuggesties als we geen specifieke context kunnen afleiden
      return [
        "Wanneer is de Koninklijke Loop?",
        "Welke afstanden kan ik kiezen?",
        "Is er hulp tijdens de loop?"
      ];
    }
  };

  // Initialiseer chatgeschiedenis
  useEffect(() => {
    // Alleen initialiseren als de chat actief is
    if (isChatActive) {
      // Voeg welkomstbericht toe bij eerste render
      setMessages([getIntroMessage()]);
      setSuggestions(initialSuggestions);
    } else {
      // Toon "komt binnenkort beschikbaar" bericht als chat niet actief is
      setMessages([{
        id: uuidv4(),
        content: "Welkom bij de DKL Assistant! 👋\n\nDeze chat functie is momenteel in ontwikkeling en zal binnenkort beschikbaar zijn. Je kunt dan hier terecht voor al je vragen over De Koninklijke Loop.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
      // Geen suggesties bij niet-actieve chat
      setSuggestions([]);
    }
  }, [isChatActive]);

  // Scroll automatisch naar beneden bij nieuwe berichten
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Verberg suggesties tijdens gesprek
    setSuggestions([]);
    
    // Voeg gebruikersbericht toe
    const userMessage: Message = {
      id: uuidv4(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Toon typing indicator
    setIsTyping(true);
    
    try {
      // Verwerk bericht en krijg antwoord
      const response = await processMessage(text);
      
      // Voeg assistentantwoord toe
      setMessages(prev => [...prev, response]);
      
      // Toon nieuwe suggesties na een korte pauze
      setTimeout(() => {
        // Genereer relevante suggesties op basis van context
        const contextualSuggestions = generateSuggestions(text, response.content);
        setSuggestions(contextualSuggestions);
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Voeg foutbericht toe
      setMessages(prev => [...prev, {
        id: uuidv4(),
        content: "Sorry, er is iets misgegaan. Probeer het later nog eens.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
      
      // Reset suggesties naar standaard
      setSuggestions(initialSuggestions);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-100">
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
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Toon suggesties als de gebruiker nog geen bericht heeft verzonden of na een assistentantwoord */}
              {!isTyping && suggestions.length > 0 && isChatActive && (
                <div className="mt-2">
                  <SuggestionChips 
                    suggestions={suggestions} 
                    onSelect={handleSendMessage} 
                  />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input voor berichten of "Binnenkort beschikbaar" message */}
            {isChatActive ? (
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isTyping} 
              />
            ) : (
              <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-100 rounded-full p-3 text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    Chat functionaliteit komt binnenkort beschikbaar!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat button */}
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
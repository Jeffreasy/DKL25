// src/components/AIChatButton/AIChatButton.tsx
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import { Message } from './types';
import { getIntroMessage, processMessage } from './aiChatService';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { cc, cn, colors, animations } from '@/styles/shared';

// Memoized suggestion mapping to prevent recreation on every render
const suggestionMap: Record<string, string[]> = {
  // FAQ Contexts (based on category titles)
  faq_over_het_evenement: ["Wanneer is de loop?", "Waar is de loop precies?", "Is het toegankelijk?"],
  faq_deelname: ["Wat kost meedoen?", "Tot wanneer inschrijven?", "Is er begeleiding mogelijk?"],
  faq_looproutes: ["Vertel meer over de 15 km", "Hoe zwaar is de 6 km?", "Wat is de kortste afstand?"],
  faq_ondersteuning: ["Zijn er rustpunten?", "Is er EHBO aanwezig?", "Kan ik helpen als vrijwilliger?"],
  faq_goede_doel_sponsoring: ["Hoe kan ik doneren?", "Welk doel steunen jullie?", "Kan mijn bedrijf sponsoren?"],
  faq_contact: ["Hoe neem ik contact op?"], // Could link to contact form action

  // Schedule Contexts
  schedule_full: ["Wat is de starttijd van de 10km?", "Wanneer is het inhuldigingsfeest?", "Zijn er rustpunten?"],
  schedule_dist_15km: ["Starttijd 15km?", "Rustpunt 15km?", "Finish tijd?"],
  schedule_dist_10km: ["Starttijd 10km?", "Rustpunt 10km?", "Finish tijd?"],
  schedule_dist_6km: ["Starttijd 6km?", "Rustpunt 6km?", "Finish tijd?"],
  schedule_dist_2_5km: ["Starttijd 2,5km?", "Waar is de start van 2,5km?", "Finish tijd?"],
  schedule_type_start: ["Starttijd 15km?", "Starttijd 10km?", "Starttijd 6km?", "Starttijd 2,5km?"],
  schedule_type_finish: ["Wanneer is de finish?", "Waar is de finish precies?", "Is er daarna een feest?"],
  schedule_type_rustpunt: ["Waar zijn de rustpunten?", "Is er eten/drinken bij rustpunten?"],
  schedule_type_feest: ["Hoe laat begint het feest?", "Waar is het feest?"],
  schedule_start_15km: ["Is er een rustpunt voor de 15km?", "Wanneer vertrekt de bus voor 15km?"], // More specific examples
  schedule_start_10km: ["Is er een rustpunt voor de 10km?", "Wanneer vertrekt de bus voor 10km?"],
  schedule_start_6km: ["Is er een rustpunt voor de 6km?", "Wanneer vertrekt de bus voor 6km?"],
  schedule_start_2_5km: ["Is er een rustpunt voor de 2,5km?", "Wanneer vertrekt de bus voor 2,5km?"],
  schedule_filtered: ["Toon het volledige programma", "Wat is de starttijd van 10km?", "Wanneer is de finish?"],
  schedule_nomatch: ["Toon het volledige programma", "Hoe kan ik inschrijven?", "Wat zijn de afstanden?"],

  // General/Fallback Contexts
  greeting: ["Wat is de datum van de loop?", "Hoe kan ik inschrijven?", "Wat zijn de afstanden?"],
  thanks: ["Wat zijn de afstanden?", "Kan ik doneren?", "Is er hulp tijdens de loop?"],
  help: ["Wat zijn de afstanden?", "Hoe kan ik inschrijven?", "Toon het programma"],
  no_match: ["Toon het programma", "Hoe kan ik inschrijven?", "Wat zijn de afstanden?", "Vertel over het goede doel"],
  // Default fallback (should ideally not be hit often)
  default: ["Wanneer is De Koninklijke Loop?", "Hoe kan ik meedoen?", "Welke afstanden zijn er?"]
};

const AIChatButton = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('AIChatButton');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Is de chat volledig actief? (Niet langer "Komt binnenkort beschikbaar")
  // Zet deze op true om de chat volledig te activeren!
  const isChatActive = true;
  
  // Startpunt suggesties (Wordt nu minder gebruikt, meer als fallback)
  const initialSuggestions = [
    "Wanneer is De Koninklijke Loop?",
    "Hoe kan ik meedoen?",
    "Welke afstanden zijn er?",
    "Is de route rolstoelvriendelijk?"
  ];

  // Memoized function to generate suggestions based on context hint
  const generateSuggestions = useCallback((contextHint: string): string[] => {
    console.log("Context Hint for Suggestions:", contextHint);
    // Find suggestions in the map, fallback to default or initial suggestions
    return suggestionMap[contextHint] || suggestionMap['default'] || initialSuggestions;
  }, []);

  // Initialiseer chatgeschiedenis
  useEffect(() => {
    // Alleen initialiseren als de chat actief is
    if (isChatActive) {
      // Voeg welkomstbericht toe bij eerste render
      setMessages([getIntroMessage()]);
      setSuggestions(initialSuggestions);
      trackEvent('chat', 'chat_initialized');
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
      trackEvent('chat', 'chat_not_available');
    }
  }, [isChatActive]);

  // Scroll automatisch naar beneden bij nieuwe berichten
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(!isOpen);
    trackInteraction(isOpen ? 'chat_closed' : 'chat_opened');
  }, [isOpen, trackInteraction]);

  const handleSendMessage = useCallback(async (text: string) => {
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

    // Update messages state immediately with user message
    setMessages(prev => [...prev, userMessage]);

    // Toon typing indicator
    setIsTyping(true);

    try {
      // Verwerk bericht en krijg antwoord + context hint
      const { response: assistantMessage, contextHint } = await processMessage(text);

      // Voeg assistentantwoord toe
      // Gebruik een functionele update om zeker te zijn van de laatste state
      setMessages(prev => [...prev, assistantMessage]);

      // Track successful message exchange
      trackInteraction('message_sent', text);
      trackInteraction('message_received', assistantMessage.content);

       // Toon nieuwe suggesties na een korte pauze (na het tonen van het antwoord)
       // Nu gebaseerd op contextHint
      setTimeout(() => {
        const contextualSuggestions = generateSuggestions(contextHint);
        setSuggestions(contextualSuggestions);
        setIsTyping(false); // Stop typing indicator when suggestions are shown
      }, 700); // Small delay after message appears

    } catch (error) {
      console.error("Error processing message:", error);

      // Track error
      trackInteraction('error', 'message_processing_failed');

      // Voeg foutbericht toe
      setMessages(prev => [...prev, {
        id: uuidv4(),
        content: "Sorry, er is iets misgegaan bij het verwerken van je vraag. Probeer het later nog eens.", // Improved error message
        sender: 'assistant',
        timestamp: new Date()
      }]);

      // Reset suggesties naar standaard bij fout
       setSuggestions(initialSuggestions);
       setIsTyping(false); // Ensure typing indicator stops on error
    }
    // Removed finally block as setIsTyping is handled within try/catch setTimeout
  }, [trackInteraction, generateSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    trackInteraction('suggestion_clicked', suggestion);
    handleSendMessage(suggestion);
  }, [trackInteraction, handleSendMessage]);

  // Handler voor actieknoppen in berichten
  const handleActionClick = useCallback((actionText: string) => {
    trackInteraction('action_clicked', actionText);
    const normalizedAction = actionText.toLowerCase();

    if (normalizedAction === 'schrijf je nu in') {
      navigate('/aanmelden');
      setIsOpen(false);
    } else if (normalizedAction === 'open contactformulier') {
      navigate('/contact');
      setIsOpen(false);
    } else {
      console.warn(`Unhandled chat action: ${actionText}`);
      // Optioneel: stuur een bericht terug dat de actie niet bekend is
      // handleSendMessage(`Ik weet niet hoe ik "${actionText}" moet uitvoeren.`);
    }
  }, [trackInteraction, navigate]);

  return (
    <div className={cn('fixed bottom-28 right-4 sm:right-8', cc.zIndex.max)}>
      {isOpen && (
        <div className={cn('absolute bottom-full right-0 mb-4 bg-white rounded-2xl w-[320px] sm:w-[380px] overflow-hidden', cc.shadow.xl, animations.fadeIn)}>
          {/* Header */}
          <div className={cn(colors.primary.bg, 'p-4 border-b border-primary-dark/10', cc.flex.between)}>
            <div className={cn(cc.flex.start, 'gap-2')}>
              <SmartToyIcon className="text-white" />
              <span className={cn('text-white font-semibold', cc.text.h5, cc.typography.heading)}>DKL Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className={cn('text-white hover:bg-white/10 p-1.5', cc.border.circle, cc.transition.colors)}
              aria-label="Sluit chat"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Chat container */}
          <div className={cn('h-[450px]', cc.flex.col)}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <ChatMessage 
                    key={message.id} 
                    message={message} 
                    onActionClick={handleActionClick}
                />
              ))}
              
              {isTyping && (
                <div className={cc.flex.start}>
                  <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                    <div className={cn(cc.flex.start, 'space-x-2')}>
                      <div className={cn('w-2 h-2 bg-gray-400', cc.border.circle, 'animate-bounce')} style={{ animationDelay: '0s' }}></div>
                      <div className={cn('w-2 h-2 bg-gray-400', cc.border.circle, 'animate-bounce')} style={{ animationDelay: '0.2s' }}></div>
                      <div className={cn('w-2 h-2 bg-gray-400', cc.border.circle, 'animate-bounce')} style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Toon suggesties als de gebruiker nog geen bericht heeft verzonden of na een assistentantwoord */}
              {!isTyping && suggestions.length > 0 && isChatActive && (
                <div className="mt-2">
                  <SuggestionChips 
                    suggestions={suggestions} 
                    onSelect={handleSuggestionClick} 
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
              <div className={cn('p-4', cc.divider.horizontal, 'border-gray-100')}>
                <div className={cn('bg-gray-100 p-3 text-center', cc.border.circle)}>
                  <p className={cn(cc.text.small, 'text-gray-500')}>
                    Chat functionaliteit komt binnenkort beschikbaar!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat button - Adjusted for responsiveness */}
      <button
        onClick={toggleChat}
        className={cn(
          'group p-3 md:p-4 text-white relative',
          colors.primary.bg,
          colors.primary.hover,
          cc.border.circle,
          cc.shadow.lg,
          cc.transition.base,
          'hover:-translate-y-1',
          cc.shadow.xl,
          animations.fadeIn
        )}
        aria-label="Open AI chat"
      >
        {/* Adjusted icon size */}
        <SmartToyIcon 
          sx={{ fontSize: { xs: 24, md: 28 } }} 
          className="transition-transform group-hover:scale-110" 
        />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
      </button>
    </div>
  );
});

AIChatButton.displayName = 'AIChatButton';

export default AIChatButton;
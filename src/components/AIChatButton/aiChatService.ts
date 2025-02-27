// src/components/AIChatButton/aiChatService.ts
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';
// Importeer de faqData van de juiste locatie
import { faqData } from '../../pages/contact/components/faq.data';

// Helper functions voor betere zoekopdrachten
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Verwijder accenten
    .replace(/[^\w\s]/g, '') // Verwijder leestekens
    .trim();
};

const filterStopwords = (words: string[]): string[] => {
  const dutchStopwords = [
    'de', 'het', 'een', 'en', 'is', 'dat', 'dit', 'van', 'te', 'in', 'op', 'voor',
    'met', 'zijn', 'er', 'aan', 'niet', 'ook', 'om', 'als', 'dan', 'bij', 'nog',
    'maar', 'of', 'wel', 'door', 'wat', 'waar', 'wie', 'hoe', 'wanneer', 'waarom'
  ];
  
  return words.filter(word => !dutchStopwords.includes(word) && word.length > 2);
};

// Calculate similarity score between query and FAQ item
const calculateSimilarity = (
  query: string,
  faqItem: {question: string, answer: string}
): number => {
  const normalizedQuery = normalizeText(query);
  const normalizedQuestion = normalizeText(faqItem.question);
  
  // Direct match
  if (normalizedQuestion === normalizedQuery) {
    return 1.0;
  }
  
  // Contains match
  if (normalizedQuestion.includes(normalizedQuery) || normalizedQuery.includes(normalizedQuestion)) {
    return 0.9;
  }
  
  // Word overlap
  const queryWords = filterStopwords(normalizedQuery.split(' '));
  const questionWords = filterStopwords(normalizedQuestion.split(' '));
  
  if (queryWords.length === 0) return 0;
  
  let matchCount = 0;
  
  for (const queryWord of queryWords) {
    for (const questionWord of questionWords) {
      if (queryWord === questionWord || 
          (queryWord.length > 3 && questionWord.includes(queryWord)) || 
          (questionWord.length > 3 && queryWord.includes(questionWord))) {
        matchCount++;
        break;
      }
    }
  }
  
  return matchCount / queryWords.length;
};

// Enhanced search function
const searchFAQ = (query: string): { 
  answer: string, 
  actionText?: string, 
  action?: boolean,
  category?: string,
  confidence: number 
} | null => {
  if (!query.trim()) return null;
  
  let bestMatch = null;
  let highestScore = 0;
  let matchedCategory = '';
  
  // Doorzoek alle FAQ categorieën en vragen
  for (const category of faqData) {
    for (const item of category.questions) {
      const score = calculateSimilarity(query, item);
      
      if (score > highestScore && score > 0.3) {
        highestScore = score;
        bestMatch = item;
        matchedCategory = category.title;
      }
    }
  }
  
  if (bestMatch) {
    return {
      answer: bestMatch.answer,
      actionText: bestMatch.actionText,
      action: bestMatch.action,
      category: matchedCategory,
      confidence: highestScore
    };
  }
  
  return null;
};

// Detecteer de intentie van een bericht
const detectIntent = (message: string): string => {
  const normalizedMessage = normalizeText(message);
  
  // Begroeting
  if (/^(hallo|hoi|hey|goedemorgen|goedemiddag|goedenavond|hee|hi)/.test(normalizedMessage)) {
    return 'greeting';
  }
  
  // Bedanken
  if (/^(dank|bedankt|thanks|dankjewel|dankuwel)/.test(normalizedMessage) || 
      normalizedMessage.includes('dank je') || 
      normalizedMessage.includes('dank u')) {
    return 'thanks';
  }
  
  // Afscheid
  if (/^(doei|tot ziens|bye|dag|tot later)/.test(normalizedMessage)) {
    return 'farewell';
  }
  
  // Hulp vragen
  if (/^(help|hulp|assistentie)/.test(normalizedMessage)) {
    return 'help';
  }
  
  // Standaard is FAQ zoeken
  return 'faq';
};

// Genereer introductie bericht
export const getIntroMessage = (): Message => {
  return {
    id: uuidv4(),
    content: "Welkom bij de DKL Assistant! 👋\n\nIk kan je helpen met vragen over De Koninklijke Loop. Vraag me gerust over het evenement, inschrijving, routes, of andere details!",
    sender: 'assistant',
    timestamp: new Date()
  };
};

// Verwerk het bericht van de gebruiker en genereer een passend antwoord
export const processMessage = async (message: string): Promise<Message> => {
  // Kleine vertraging om verwerking te simuleren (variabel voor natuurlijker gevoel)
  const typingDelay = 500 + Math.floor(Math.random() * 1000); 
  await new Promise(resolve => setTimeout(resolve, typingDelay));
  
  // Detecteer intentie
  const intent = detectIntent(message);
  let responseContent: string;
  
  switch (intent) {
    case 'greeting':
      responseContent = "Hoi! Leuk dat je contact opneemt. Waarmee kan ik je helpen rondom De Koninklijke Loop?";
      break;
      
    case 'thanks':
      responseContent = "Graag gedaan! Kan ik je nog ergens anders mee helpen?";
      break;
      
    case 'farewell':
      responseContent = "Bedankt voor je berichtje! Als je later nog vragen hebt over De Koninklijke Loop, help ik je graag weer.";
      break;
      
    case 'help':
      responseContent = "Ik ben de DKL Assistant en kan je helpen met vragen over De Koninklijke Loop. Je kunt me vragen stellen over:\n\n• Het evenement (datum, locatie, etc.)\n• Deelname en inschrijving\n• De verschillende looproutes\n• Ondersteuning tijdens de loop\n• Doneren en sponsoring";
      break;
      
    case 'faq':
    default:
      // Zoek in FAQ naar relevant antwoord
      const faqResult = searchFAQ(message);
      
      if (faqResult && faqResult.confidence > 0.6) {
        // Hoge zekerheid antwoord
        responseContent = faqResult.answer;
        
        // Voeg actie prompt toe indien beschikbaar
        if (faqResult.action && faqResult.actionText) {
          responseContent += `\n\nKlik hier om: ${faqResult.actionText}`;
        }
      } else if (faqResult && faqResult.confidence > 0.3) {
        // Lage zekerheid antwoord
        responseContent = `Ik denk dat dit je vraag beantwoordt:\n\n${faqResult.answer}`;
        
        if (faqResult.action && faqResult.actionText) {
          responseContent += `\n\nKlik hier om: ${faqResult.actionText}`;
        }
        
        responseContent += "\n\nAls dit niet antwoord geeft op je vraag, kun je je vraag misschien anders formuleren?";
      } else {
        // Geen antwoord gevonden
        responseContent = "Excuses, ik kan je vraag niet direct beantwoorden. Je kunt vragen stellen over het evenement, inschrijving, routes, of ondersteuning. Of je kunt contact opnemen met de organisatie via het contactformulier.";
      }
      break;
  }
  
  return {
    id: uuidv4(),
    content: responseContent,
    sender: 'assistant',
    timestamp: new Date()
  };
};
// src/components/AIChatButton/aiChatService.ts
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';
// Importeer de lokale kopie van faqData
import { faqData } from './faq.data';
// Importeer de nieuwe schedule data
import { scheduleData, ScheduleItem } from './schedule.data';

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
    'maar', 'of', 'wel', 'door',
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
  
  // Check for exact matches with suggestion chips
  // This is the key fix - check if the query exactly matches suggestion chips
  if (query === faqItem.question) {
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

// Function to get a context hint from FAQ data
const getFaqContextHint = (categoryTitle: string | undefined): string => {
  if (!categoryTitle) return 'faq_general';
  // Create a simple hint from the category title
  return `faq_${normalizeText(categoryTitle).replace(/\s+/g, '_')}`;
}

// Enhanced search function for FAQ
const searchFAQ = (query: string): {
  answer: string,
  actionText?: string,
  action?: boolean,
  category?: string,
  confidence: number,
  contextHint: string // Added context hint
} | null => {
  if (!query.trim()) return null;

  // First check for exact match with suggestion chips
  for (const category of faqData) {
    for (const item of category.questions) {
      if (item.question === query) {
        return {
          answer: item.answer,
          actionText: item.actionText,
          action: item.action,
          category: category.title,
          confidence: 1.0,
          contextHint: getFaqContextHint(category.title) // Generate hint
        };
      }
    }
  }

  // If no exact match, proceed with similarity search
  let bestMatch = null;
  let highestScore = 0;
  let matchedCategory = '';

  // Doorzoek alle FAQ categorieën en vragen
  for (const category of faqData) {
    for (const item of category.questions) {
      // Consider matching against answer text as well for more robustness? (Maybe later)
      const score = calculateSimilarity(query, item);

      if (score > highestScore && score > 0.3) { // Keep threshold for now
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
      confidence: highestScore,
      contextHint: getFaqContextHint(matchedCategory) // Generate hint
    };
  }

  return null;
};

// Function to extract relevant keywords (like distance) from query
const extractScheduleKeywords = (normalizedQuery: string): { distance?: string, type?: string } => {
    const keywords: { distance?: string, type?: string } = {};
    const distanceMatch = normalizedQuery.match(/(\b\d+([,\.]\d+)?\s?(?:km|kilometer)\b)/);
    if (distanceMatch) {
        // Extract just the number part for easier matching
        const numMatch = distanceMatch[1].match(/\d+([,\.]\d+)?/);
        if (numMatch) keywords.distance = numMatch[0].replace(',', '.'); // Standardize decimal point
    }

    if (normalizedQuery.includes('start')) keywords.type = 'start';
    else if (normalizedQuery.includes('finish') || normalizedQuery.includes('eind')) keywords.type = 'finish';
    else if (normalizedQuery.includes('aanvang')) keywords.type = 'aanvang';
    else if (normalizedQuery.includes('vertrek')) keywords.type = 'vertrek';
    else if (normalizedQuery.includes('rustpunt')) keywords.type = 'rustpunt';
    else if (normalizedQuery.includes('feest')) keywords.type = 'feest';
    else if (normalizedQuery.includes('aanwezig')) keywords.type = 'aanwezig';
    else if (normalizedQuery.includes('aankomst')) keywords.type = 'aankomst';


    return keywords;
}

// Enhanced search function for the schedule
const searchSchedule = (query: string): { items: ScheduleItem[], contextHint: string } => {
  const normalizedQuery = normalizeText(query);
  const queryWords = filterStopwords(normalizedQuery.split(' '));
  const extractedKeywords = extractScheduleKeywords(normalizedQuery);

  let contextHint = 'schedule_general'; // Default hint

  // Handle general queries for the full schedule
  if (normalizedQuery.includes('schema') || normalizedQuery.includes('programma') || normalizedQuery.includes('tijden') || normalizedQuery.includes('gehele')) {
    return { items: scheduleData, contextHint: 'schedule_full' }; // Specific hint for full schedule
  }

  // Filter based on extracted keywords and general query words
  let results = scheduleData.filter(item => {
    const normalizedDescription = normalizeText(item.event_description);
    const normalizedCategory = normalizeText(item.category);

    // Match specific distance if mentioned
    let distanceMatch = true;
    if (extractedKeywords.distance) {
        // Check if the description contains the specific distance (e.g., "10km", "15 km")
        const distanceRegex = new RegExp(`\\b${extractedKeywords.distance.replace('.', '[\\.,]')}\\s?(?:km|kilometer)\\b`);
        distanceMatch = distanceRegex.test(normalizedDescription);
    }

    // Match specific event type if mentioned
    let typeMatch = true;
    if (extractedKeywords.type) {
        // Use category for primary type matching, allow description as fallback
        typeMatch = normalizedCategory.includes(extractedKeywords.type) || normalizedDescription.includes(extractedKeywords.type);
    }

    // Match general keywords from the query
    let keywordMatch = queryWords.length === 0 || queryWords.some(word =>
        normalizedDescription.includes(word) ||
        normalizedCategory.includes(word)
    );

    // Include item if it matches distance (if specified), type (if specified), and general keywords
    // If a specific distance or type was mentioned, make those matches mandatory
    if (extractedKeywords.distance && extractedKeywords.type) {
        return distanceMatch && typeMatch;
    } else if (extractedKeywords.distance) {
         return distanceMatch && keywordMatch; // Match distance AND other keywords
    } else if (extractedKeywords.type) {
         return typeMatch && keywordMatch; // Match type AND other keywords
    } else {
         // Only general keywords
        return keywordMatch || normalizedDescription.includes(normalizedQuery); // Also check full query substring
    }
  });

  // Generate context hint based on search results/keywords
   if (results.length > 0) {
       if (extractedKeywords.distance && extractedKeywords.type) {
            contextHint = `schedule_${extractedKeywords.type}_${extractedKeywords.distance.replace('.', '_')}km`;
       } else if (extractedKeywords.distance) {
            contextHint = `schedule_dist_${extractedKeywords.distance.replace('.', '_')}km`;
       } else if (extractedKeywords.type) {
            contextHint = `schedule_type_${extractedKeywords.type}`;
       } else if (results.length < scheduleData.length) {
           // If filtered but no specific keywords matched, use a generic filtered hint
           contextHint = 'schedule_filtered';
       }
   } else {
       // If no results, try a broader search (fallback - could re-run with looser criteria if needed)
       // For now, just return empty with general hint
       contextHint = 'schedule_nomatch';
   }


  return { items: results, contextHint };
};


// Enhanced formatting for schedule responses
const formatScheduleResponse = (result: { items: ScheduleItem[], contextHint: string }, query: string): string => {
    const { items, contextHint } = result;
    const normalizedQuery = normalizeText(query);

    if (items.length === 0) {
        return "Ik kon geen specifieke informatie over dat deel van het programma vinden. Probeer je vraag anders te formuleren, of vraag naar het volledige programma.";
    }

    // Handle full schedule request
    if (contextHint === 'schedule_full') {
        let response = "Hier is het volledige programma voor De Koninklijke Loop 2026:\n\n";
        items.forEach(item => {
            response += `• ${item.time}: ${item.event_description}`;
            // Voeg details toe indien beschikbaar
            if (item.details) {
                response += `\n  (${item.details})`;
            }
            response += `\n`;
        });
        response += "\nLet op: Tijden zijn indicatief en kunnen licht afwijken.";
        return response;
    }

    // Handle specific queries resulting in 1-4 items
    if (items.length <= 4) {
        let response = "";
        if (items.length === 1) {
            // response = "Ik heb het volgende gevonden in het programma:\n"; // More concise now
            const item = items[0];
             // Try to make it more conversational
             if (normalizedQuery.includes('wanneer') || normalizedQuery.includes('hoe laat')) {
                response = `De "${item.event_description}" is om ${item.time}.`;
             } else {
                 // General case for single item
                 response = `Om ${item.time} is het volgende programma-onderdeel: ${item.event_description}.`;
             }
             // Add details if available
             if (item.details) {
                 response += `\nDetails: ${item.details}`;
             }
        } else {
            response = "Ik heb deze relevante tijden gevonden in het programma:\n\n";
            items.forEach(item => {
                response += `• ${item.time}: ${item.event_description}`;
                // Voeg details toe indien beschikbaar
                if (item.details) {
                    response += `\n  (${item.details})`;
                }
                response += `\n`;
            });
        }
        return response;
    }

    // Handle queries resulting in > 4 items (too many specific results)
    if (items.length > 4) {
        let response = "Ik heb meerdere programma-onderdelen gevonden die relevant lijken:\n\n";
        items.slice(0, 4).forEach(item => { // Show first 4
            response += `• ${item.time}: ${item.event_description}`;
             // Voeg details toe indien beschikbaar (beknopt hier?)
             if (item.details) {
                 // Misschien alleen een hint geven dat er details zijn?
                 // response += ` (meer info beschikbaar)`; 
                 // Of toch de details tonen:
                 response += `\n  (${item.details})`; 
             }
             response += `\n`;
        });
        response += `• ... en nog ${items.length - 4} andere.\n`;
        response += "\nKun je je vraag specifieker maken (bijvoorbeeld door een afstand te noemen)? Of vraag naar het volledige programma.";
        return response;
    }

     // Fallback (shouldn't really happen with current logic)
    return "Er ging iets mis bij het ophalen van het programma.";
};


// Detect intent (minor adjustments maybe needed based on testing)
const detectIntent = (message: string): string => {
  const normalizedMessage = normalizeText(message);

  // Prioritize specific intents first
  if (/^(hallo|hoi|hey|goedemorgen|goedemiddag|goedenavond|hee|hi)/.test(normalizedMessage)) {
    return 'greeting';
  }
  if (/^(dank|bedankt|thanks|dankjewel|dankuwel)/.test(normalizedMessage) ||
      normalizedMessage.includes('dank je') ||
      normalizedMessage.includes('dank u')) {
    return 'thanks';
  }
  if (/^(doei|tot ziens|bye|dag|tot later)/.test(normalizedMessage)) {
    return 'farewell';
  }
   if (/^(help|hulp|assistentie|wat kan je)/.test(normalizedMessage)) {
    return 'help';
  }

  // Schedule intent - slightly stricter? Look for time/distance keywords primarily
  const scheduleKeywords = ['schema', 'programma', 'tijd', 'tijden', 'uur', 'starttijd', 'eindtijd', 'finish', 'start', 'wanneer begint', 'hoe laat', 'planning', 'rustpunt', 'aanvang', 'vertrek', 'feest'];
  // Check for distance AND/OR schedule keywords
  if (/\b\d{1,2}\s?(?:km|kilometer)\b/.test(normalizedMessage) || scheduleKeywords.some(keyword => normalizedMessage.includes(keyword)) || /\d{1,2}[:u]\d{2}/.test(normalizedMessage)) {
      // Further check: does it look like a schedule question rather than general FAQ?
      // If it contains schedule keywords OR a distance/time, assume schedule for now.
      // We rely on the fallback logic in processMessage if FAQ is a better match.
      return 'schedule';
  }

  // Default to FAQ
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

// Process message with refined logic and context hint return
export const processMessage = async (message: string): Promise<{ response: Message, contextHint: string }> => {
  // Simulate delay
  const typingDelay = 500 + Math.floor(Math.random() * 1000);
  await new Promise(resolve => setTimeout(resolve, typingDelay));

  const intent = detectIntent(message);
  let responseContent: string;
  let contextHint = 'general'; // Default context hint

  switch (intent) {
    case 'greeting':
      responseContent = "Hoi! Leuk dat je contact opneemt. Waarmee kan ik je helpen rondom De Koninklijke Loop?";
      contextHint = 'greeting';
      break;

    case 'thanks':
      responseContent = "Graag gedaan! Kan ik je nog ergens anders mee helpen?";
      contextHint = 'thanks';
      break;

    case 'farewell':
      responseContent = "Bedankt voor je berichtje! Als je later nog vragen hebt over De Koninklijke Loop, help ik je graag weer.";
      contextHint = 'farewell';
      break;

    case 'help':
      responseContent = "Ik ben de DKL Assistant en kan je helpen met vragen over De Koninklijke Loop. Je kunt me vragen stellen over:\n\n• Het evenement (datum, locatie, etc.)\n• Deelname en inschrijving\n• De verschillende looproutes\n• Ondersteuning tijdens de loop\n• Doneren en sponsoring\n• Het programma en specifieke tijden"; // Added program here
       contextHint = 'help';
      break;

    case 'schedule': {
        const scheduleResult = searchSchedule(message);
        responseContent = formatScheduleResponse(scheduleResult, message);
        contextHint = scheduleResult.contextHint; // Use hint from search function
        // If schedule search yields no results despite intent, maybe try FAQ as fallback?
        if (scheduleResult.items.length === 0) {
            const faqResult = searchFAQ(message);
            if (faqResult && faqResult.confidence > 0.5) { // Higher confidence needed for fallback
                 responseContent = faqResult.answer;
                 if (faqResult.action && faqResult.actionText) {
                    responseContent += `\n\nKlik hier om: ${faqResult.actionText}`;
                 }
                 contextHint = faqResult.contextHint;
            } else {
                 // Keep the original "no schedule info found" message
                 responseContent = "Ik kon geen specifieke informatie over dat deel van het programma vinden. Probeer je vraag anders te formuleren, of vraag naar het volledige programma.";
                 contextHint = 'schedule_nomatch';
            }
        }
        break;
      }

    case 'faq':
    default: {
      const faqResult = searchFAQ(message);

      if (faqResult && faqResult.confidence >= 0.6) { // Keep 0.6 threshold for high confidence
        responseContent = faqResult.answer;
        if (faqResult.action && faqResult.actionText) {
          responseContent += `\n\nKlik hier om: ${faqResult.actionText}`;
        }
        contextHint = faqResult.contextHint;
      } else {
        // Fallback: Try schedule search if FAQ confidence is low or no match
        const scheduleResult = searchSchedule(message);
        if (scheduleResult.items.length > 0 && scheduleResult.contextHint !== 'schedule_full') { // Don't fallback to full schedule unless asked
           // Only use schedule fallback if it found something specific
            responseContent = formatScheduleResponse(scheduleResult, message);
            contextHint = scheduleResult.contextHint;
        } else if (faqResult && faqResult.confidence > 0.3) { // Use lower confidence FAQ if schedule also failed
          responseContent = `Ik denk dat dit je vraag beantwoordt:\n\n${faqResult.answer}`;
          if (faqResult.action && faqResult.actionText) {
            responseContent += `\n\nKlik hier om: ${faqResult.actionText}`;
          }
          responseContent += "\n\nAls dit niet klopt, kun je je vraag misschien anders formuleren?";
          contextHint = faqResult.contextHint + "_lowconf"; // Indicate low confidence
        } else {
          // Final fallback: No answer found
          responseContent = "Excuses, ik kon geen duidelijk antwoord vinden op je vraag. Probeer het misschien anders te formuleren. Je kunt vragen naar het evenement, inschrijving, routes, ondersteuning of het programma.";
          contextHint = 'no_match';
        }
      }
      break;
    }
  }

  const responseMessage: Message = {
    id: uuidv4(),
    content: responseContent,
    sender: 'assistant',
    timestamp: new Date()
  };

  return { response: responseMessage, contextHint };
};
// src/components/AIChatButton/SuggestionChips.tsx
import React from 'react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full px-3 py-1 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
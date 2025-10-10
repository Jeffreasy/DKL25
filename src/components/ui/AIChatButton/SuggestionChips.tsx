// src/components/AIChatButton/SuggestionChips.tsx
import React, { memo, useCallback } from 'react';
import { cc, cn } from '@/styles/shared';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = memo(({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className={cn(cc.flex.wrap, 'gap-2 mt-3 mb-2')}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className={cn(
            cc.chip.secondary,
            cc.text.small
          )}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
});

SuggestionChips.displayName = 'SuggestionChips';

export default SuggestionChips;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CTACard from './CTACard';
import { ctaCardsData } from './data';
import type { CTACardData } from './types';

interface CTACardsProps {
  onInschrijfClick?: () => void;
  onDonatieClick?: () => void;
}

const CTACards: React.FC<CTACardsProps> = ({
  onInschrijfClick,
  onDonatieClick
}) => {
  console.log("Rendering CTACards with props:", { onInschrijfClick, onDonatieClick }); // Debug log

  const navigate = useNavigate();

  const handleAction = (card: CTACardData) => {
    switch (card.actionType) {
      case 'inschrijven':
        onInschrijfClick?.();
        break;
      case 'doneren':
        onDonatieClick?.();
        break;
      case 'navigate':
        if (card.path) {
          navigate(card.path);
        }
        break;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] text-gray-900 font-bold mb-4">
            Kom in actie
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Ontdek hoe je kunt deelnemen aan De Koninklijke Loop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ctaCardsData.map((card, index) => {
            console.log("Rendering card:", card); // Debug log per card
            return (
              <div 
                key={card.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CTACard
                  {...card}
                  onClick={() => handleAction(card)}
                  delay={index * 200}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CTACards; 
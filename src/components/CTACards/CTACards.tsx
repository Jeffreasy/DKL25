import React from 'react';
import { useNavigate } from 'react-router-dom';
import CTACard from './CTACard';
import { ctaCardsData } from './data';
import type { CTACardData } from './types';

interface CTACardsProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const CTACards: React.FC<CTACardsProps> = ({ onInschrijfClick, onDonatieClick }) => {
  const navigate = useNavigate();

  const handleAction = (card: CTACardData) => {
    switch (card.actionType) {
      case 'inschrijven':
        onInschrijfClick();
        break;
      case 'doneren':
        onDonatieClick();
        break;
      case 'navigate':
        if (card.path) navigate(card.path);
        break;
    }
  };

  return (
    <section className="relative py-16 px-5 bg-gray-50 font-['Roboto_Slab'] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/3 to-transparent blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/2 to-transparent blur-[80px] animate-float" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/3 to-transparent transform -rotate-45 animate-slide" />
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/3 to-transparent transform -rotate-45 animate-slide-reverse" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] text-gray-900 font-bold mb-4 tracking-tight">
            Kom in actie
          </h2>
          <div className="relative mx-auto w-16 h-0.5 mb-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shine" />
          </div>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-gray-600">
            Ontdek hoe je kunt deelnemen aan De Koninklijke Loop
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          {ctaCardsData.map((card, index) => (
            <CTACard
              key={index}
              {...card}
              onClick={() => handleAction(card)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTACards; 
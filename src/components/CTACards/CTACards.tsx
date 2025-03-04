import React from 'react';
import { useNavigate } from 'react-router-dom';
import CTACard from './CTACard';
import { ctaCardsData } from './data';
import type { CTACardData } from './types';
import { logEvent } from '../../utils/googleAnalytics'; // Importeer analytics functie

interface CTACardsProps {
  onInschrijfClick: () => void;
  onDonatieClick: () => void;
}

const CTACards: React.FC<CTACardsProps> = ({ onInschrijfClick, onDonatieClick }) => {
  const navigate = useNavigate();

  // Track page section view
  React.useEffect(() => {
    logEvent('section_view', 'cta_section_view', 'kom_in_actie');
  }, []);

  const handleAction = (card: CTACardData) => {
    // Track de CTA klik met de titel en actie type
    logEvent('conversion', 'cta_click', `${card.title}_${card.actionType}`);
    
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
    <section className="py-20 px-5 bg-white font-heading">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-[clamp(2rem,4vw,2.5rem)] text-gray-900 font-bold mb-4">
          Kom in actie
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Ontdek hoe je kunt deelnemen aan De Koninklijke Loop
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {ctaCardsData.map((card, index) => (
          <CTACard
            key={index}
            {...card}
            onClick={() => handleAction(card)}
          />
        ))}
      </div>
    </section>
  );
};

export default CTACards;
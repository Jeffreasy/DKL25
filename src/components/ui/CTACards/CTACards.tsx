import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CTACard from './CTACard';
import { ctaCardsData } from './data';
import type { CTACardData } from './types';
import { logEvent } from '../../utils/googleAnalytics'; // Importeer analytics functie
import { useModal } from '@/contexts/ModalContext'; // Import useModal

interface CTACardsProps {
  onInschrijfClick: () => void;
}

const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl p-8 shadow-lg animate-pulse">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="h-12 bg-gray-200 rounded-full w-2/3 mt-4" />
    </div>
  </div>
);

const CTACards: React.FC<CTACardsProps> = ({ onInschrijfClick }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleDonatieClick } = useModal(); // Get handler from context

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Track page section view and simulate loading
  useEffect(() => {
    logEvent('section_view', 'cta_section_view', 'kom_in_actie');
    
    // Simulate loading for smooth animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAction = async (card: CTACardData) => {
    try {
      logEvent('conversion', 'cta_click', `${card.title}_${card.actionType}`);
      
      switch (card.actionType) {
        case 'inschrijven':
          await onInschrijfClick();
          break;
        case 'doneren':
          console.log("CTACards: Triggering openDonatieModal from context");
          handleDonatieClick();
          break;
        case 'navigate':
          if (card.path) navigate(card.path);
          break;
      }
    } catch (err) {
      console.error('Error handling CTA action:', err);
      setError('Er ging iets mis. Probeer het later opnieuw.');
      logEvent('error', 'cta_action_failed', `${card.title}_${card.actionType}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    logEvent('interaction', 'cta_error_retry', 'retry_clicked');
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-white font-heading relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] text-gray-900 font-bold mb-4">
            Kom in actie
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Ontdek hoe je kunt deelnemen aan De Koninklijke Loop
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div 
            className="max-w-md mx-auto mb-8 px-4 py-3 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm text-red-500 hover:text-red-600 underline block mx-auto"
            >
              Opnieuw proberen
            </button>
          </motion.div>
        )}

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            // Loading skeletons
            [...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))
          ) : (
            // Actual cards
            ctaCardsData.map((card, index) => (
              <CTACard
                key={card.title}
                {...card}
                index={index}
                onClick={() => handleAction(card)}
              />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CTACards);
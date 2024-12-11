import React, { useState } from 'react';
import FAQ from './components/FAQ';
import { ContactModal } from '../../components/modals';

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onInschrijfClick }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handlePrivacyClick = () => {
    console.log('Privacy clicked');
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQ 
          onContactClick={handleContactClick}
          onInschrijfClick={onInschrijfClick}
        />
      </div>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onPrivacyClick={handlePrivacyClick}
      />
    </div>
  );
};

export default Contact; 
import React, { useState } from 'react';
import FAQ from './components/FAQ';
import { ContactModal, PrivacyModal } from '../../components/modals';

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onInschrijfClick }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <FAQ 
        onContactClick={handleContactClick}
        onInschrijfClick={onInschrijfClick}
      />
      
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
      />
      
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default Contact; 
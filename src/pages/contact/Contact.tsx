import React, { useState } from 'react';
import FAQ from './components/FAQ';
import { ContactModal, PrivacyModal } from '../../components/modals';
import { useNavigate } from 'react-router-dom';

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onInschrijfClick }) => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleInschrijfClick = () => {
    navigate('/aanmelden');
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <FAQ 
        onContactClick={handleContactClick}
        onInschrijfClick={handleInschrijfClick}
      />
      
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onPrivacyClick={() => navigate('/privacy')}
      />
      
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default Contact; 
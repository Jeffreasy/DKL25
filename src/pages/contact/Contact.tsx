import React, { useState, useEffect } from 'react';
import FAQ from './components/FAQ';
import { ContactModal } from '../../components/modals';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onInschrijfClick }) => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('contact', 'page_view', 'contact_page');
  }, []);

  const handleInschrijfClick = () => {
    trackEvent('contact', 'inschrijf_click', 'from_contact_page');
    navigate('/aanmelden');
  };

  const handleContactClick = () => {
    trackEvent('contact', 'modal_open', 'contact_form');
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    trackEvent('contact', 'modal_close', 'contact_form');
    setIsContactModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <FAQ 
        onContactClick={handleContactClick}
        onInschrijfClick={handleInschrijfClick}
      />
      
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={handleContactModalClose}
      />
    </div>
  );
};

export default Contact; 
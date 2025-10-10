import React, { useState, useEffect, Suspense, lazy, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';
import { cn, colors } from '@/styles/shared';

// Lazy load heavy components for better performance
const FAQ = lazy(() => import('./components/FAQ'));
const ContactModal = lazy(() =>
  import('../../components/ui/modals/ContactModal').then(module => ({ default: module.ContactModal }))
);

// Optimized section component with intersection observer
const LazySection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}> = memo(({ children, fallback, className, priority = 'medium' }) => {
  const [isVisible, setIsVisible] = useState(priority === 'high');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high') return; // Load immediately

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Load once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: priority === 'medium' ? '100px' : '200px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={sectionRef} className={className}>
      <Suspense fallback={fallback || <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />}>
        {isVisible ? children : (fallback || <div className="h-32 bg-gray-50 rounded-lg" />)}
      </Suspense>
    </div>
  );
});

LazySection.displayName = 'LazySection';

interface ContactProps {
  onInschrijfClick?: () => void;
}

const Contact: React.FC<ContactProps> = memo(({ onInschrijfClick }) => {
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
    <>
      <SEO
        title="Contact & Veelgestelde Vragen (FAQ) | De Koninklijke Loop (DKL)"
        description="Heb je een vraag over De Koninklijke Loop? Vind hier antwoorden op veelgestelde vragen (FAQ) of neem contact met ons op."
      />
      <div className={cn('min-h-screen pt-20', colors.neutral.white)}>
        <LazySection
          priority="high"
          fallback={
            <div className="w-full bg-white text-gray-800 antialiased p-8 rounded-xl shadow-lg">
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse mt-8 w-1/2 mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse h-64"></div>
                ))}
              </div>
            </div>
          }
        >
          <FAQ
            onContactClick={handleContactClick}
            onInschrijfClick={handleInschrijfClick}
          />
        </LazySection>

        {isContactModalOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <ContactModal
              isOpen={isContactModalOpen}
              onClose={handleContactModalClose}
            />
          </Suspense>
        )}
      </div>
    </>
  );
});

Contact.displayName = 'Contact';

export default Contact; 
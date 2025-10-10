import React, { useState, Suspense, lazy, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { useModal } from '../../contexts/ModalContext';
import { cc, cn } from '@/styles/shared';

// Lazy load heavy components for better performance
const PartnerCarrousel = lazy(() => import('../../features/partners/components/PartnerCarousel'));
const HeroSection = lazy(() => import('../../components/sections/Hero/HeroSection'));
const TitleSection = lazy(() => import('../../components/sections/Title/TitleSection'));
const CTACards = lazy(() => import('../../components/ui/CTACards/CTACards'));
const PhotoGallery = lazy(() => import('../../features/gallery/components/GalleryContainer'));
const DKLSocials = lazy(() => import('../../components/sections/Socials/SocialLinks'));
import { DKLSponsors, RadioGallery } from '../../components';
const VideoGallery = lazy(() => import('../../features/video/components').then(module => ({ default: module.VideoGallery })));
const ProgramSection = lazy(() => import('../../features/program/components').then(module => ({ default: module.ProgramSection })));
const InschDoneerButton = lazy(() => import('../../components/ui/buttons/RegisterDonateButton'));

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
    if (priority === 'high') return; // High priority loads immediately

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
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

const Home: React.FC = memo(() => {
  const { handleDonatieClick, handleOpenProgramModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInschrijven = () => {
    navigate('/aanmelden');
  };

  return (
    <>
      <SEO
        route="/"
        isEventPage={true}
        eventName="De Koninklijke Loop (DKL) 2025"
        eventStartDate="2025-05-17T10:00:00+02:00"
        eventDescription="Het unieke, rolstoelvriendelijke wandelevenement (DKL) in Apeldoorn voor en door mensen met een beperking, waarbij gelopen wordt voor het goede doel."
        eventLocationName="Paleis Het Loo, Apeldoorn"
        eventLocationAddress="Koninklijk Park 1, 7315 JA Apeldoorn"
      />
      <div className="bg-white">
        <main>
          {/* High priority sections - load immediately */}
          <LazySection priority="high">
            {/* Visually hidden heading for accessibility and SEO */}
            <h2 className={cc.a11y.srOnly}>Onze Partners</h2>
            <PartnerCarrousel />
          </LazySection>

          <LazySection priority="high">
            <HeroSection />
          </LazySection>

          <LazySection priority="high">
            <TitleSection onInschrijfClick={handleInschrijven} />
          </LazySection>

          <LazySection priority="high">
            <CTACards onInschrijfClick={handleInschrijven} />
          </LazySection>

          {/* Medium priority sections */}
          <LazySection priority="medium">
            <ProgramSection />
          </LazySection>

          <LazySection priority="medium" className="py-12 px-5">
            {/* Visually hidden heading for accessibility and SEO */}
            <h2 className={cc.a11y.srOnly}>Bekijk de Video's</h2>
            <VideoGallery />
          </LazySection>

          {/* Low priority sections - load when scrolled into view */}
          <LazySection priority="low" className="py-12 px-5">
            <h2 className={cn(cc.text.h2, 'text-center text-gray-900 mb-8')}>Foto Impressie</h2>
            <PhotoGallery onModalChange={setIsModalOpen} />
          </LazySection>

          <LazySection priority="low" className="py-12 px-5">
            <h2 className={cn(cc.text.h2, 'text-center text-gray-900 mb-8')}>Luister Terug</h2>
            <RadioGallery
              title="Radio Fragmenten"
              subtitle="Luister naar onze Radio Fragmenten"
              maxItems={2}
            />
          </LazySection>

          <LazySection priority="low">
            <DKLSocials />
          </LazySection>

          <LazySection priority="low" className="py-12 px-5">
            <h2 className={cn(cc.text.h2, 'text-center text-gray-900 mb-8')}>Met Dank Aan Onze Sponsors</h2>
            <DKLSponsors />
          </LazySection>

          <LazySection priority="low">
            <InschDoneerButton
              onInschrijfClick={handleInschrijven}
              isModalOpen={isModalOpen}
            />
          </LazySection>
        </main>
      </div>
    </>
  );
});

Home.displayName = 'Home';

export default Home;
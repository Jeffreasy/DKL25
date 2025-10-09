import React from 'react';
import { useSponsors } from '@/hooks/useSponsors';
import { trackEvent } from '@/utils/googleAnalytics';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { SponsorRow, Sponsor } from '@/features/sponsors';
import { useModal } from '@/contexts/ModalContext';
import { cc, cn, colors, animations } from '@/styles/shared';

const DKLSponsors: React.FC = () => {
  const { sponsors, isLoading, error } = useSponsors();
  const { handleOpenSponsorModal } = useModal();

  const handleSponsorAnalytics = (sponsorName: string) => {
    trackEvent('sponsors', 'sponsor_card_click', sponsorName);
  };

  const handleImageError = (sponsorName: string) => {
    trackEvent('sponsors', 'image_error', sponsorName);
  };

  const handleOpenSponsorModalLocal = (sponsor: SponsorRow) => {
    console.log(`DKLSponsors: Triggering handleOpenSponsorModal(${sponsor.name}) from context`);
    handleSponsorAnalytics(sponsor.name);
    // Map SponsorRow to Sponsor type
    const sponsorData: Sponsor = {
      ...sponsor,
      logo: sponsor.logo_url,
      website: sponsor.website_url || undefined,
      visible: sponsor.visible ?? true
    };
    handleOpenSponsorModal(sponsorData);
  };

  if (isLoading) {
    return (
      <section className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}>
        <div className={cn(cc.container.wide, 'max-w-6xl')}>
          <div className={cn(cc.flex.center, 'h-64')}>
            <LoadingSpinner className={cn('w-12 h-12', colors.primary.text)} />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}>
        <div className={cn(cc.container.wide, 'max-w-6xl')}>
          <div className={cn('text-center', cc.text.error)}>
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('py-20 px-5 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden', cc.typography.heading)}
      aria-labelledby="sponsors-title"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn('absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent blur-[100px]', cc.border.circle, animations.pulseSlow)} />
        <div className={cn('absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-radial from-primary/2 to-transparent blur-[80px]', cc.border.circle, animations.float)} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Title Section */}
        <div className="text-center mb-16 relative">
          <h2 
            id="sponsors-title"
            className={cn(cc.text.h2, 'text-gray-900 font-bold mb-4 tracking-tight')}
          >
            Onze Sponsors
          </h2>
          <p className={cn(cc.text.h5, cc.text.muted, 'max-w-2xl mx-auto mb-8 leading-relaxed')}>
            Deze geweldige partners maken De Koninklijke Loop mogelijk
          </p>
          <div className="relative mx-auto w-16 h-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-45 from-transparent via-primary/40 to-transparent" />
            <div className={cn('absolute inset-0 bg-gradient-45 from-transparent via-primary/20 to-transparent', animations.shine)} />
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className={cn(
                'group relative bg-white rounded-2xl cursor-pointer',
                cc.shadow.lg,
                'hover:shadow-xl',
                cc.transition.base,
                'hover:-translate-y-1',
                animations.slideIn
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleOpenSponsorModalLocal(sponsor)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenSponsorModalLocal(sponsor);
                }
              }}
            >
              {/* Logo Container */}
              <div className={cn('aspect-[3/2] p-8 bg-gray-50 group-hover:bg-gray-100 rounded-t-2xl', cc.flex.center, cc.transition.colors)}>
                <div className={cn('relative w-full h-full', cc.flex.center)}>
                  <img
                    src={sponsor.logo_url}
                    alt={`${sponsor.name} logo`}
                    className={cn('max-w-[85%] max-h-[85%] object-contain group-hover:scale-105', cc.transition.base)}
                    loading="lazy"
                    onError={(e) => {
                      handleImageError(sponsor.name);
                      e.currentTarget.src = '/fallback-logo.png'
                    }}
                  />
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className={cn(cc.text.h4, 'font-bold text-gray-900 mb-3', 'group-hover:text-primary', cc.transition.colors)}>
                  {sponsor.name}
                </h3>
                <p className={cn(cc.text.body, cc.text.muted, 'leading-relaxed line-clamp-3')}>
                  {sponsor.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className={cn('absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-primary/20', cc.transition.colors)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DKLSponsors; 
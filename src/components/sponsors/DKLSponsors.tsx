import React, { useState } from 'react';
import { useSponsors } from '@/hooks/useSponsors';
import { trackEvent } from '@/utils/googleAnalytics';
import LoadingSpinner from '../LoadingSpinner';
import { Sponsor } from './types';
import { useModal } from '@/context/ModalContext';

const DKLSponsors: React.FC = () => {
  const { sponsors, isLoading, error } = useSponsors();
  const { openSponsorModal } = useModal();

  const handleSponsorAnalytics = (sponsorName: string) => {
    trackEvent('sponsors', 'sponsor_card_click', sponsorName);
  };

  const handleImageError = (sponsorName: string) => {
    trackEvent('sponsors', 'image_error', sponsorName);
  };

  const handleOpenSponsorModal = (sponsor: Sponsor) => {
    console.log(`DKLSponsors: Triggering openSponsorModal(${sponsor.name}) from context`);
    handleSponsorAnalytics(sponsor.name);
    openSponsorModal(sponsor);
  };

  if (isLoading) {
    return (
      <section className="py-20 px-5 bg-gradient-to-b from-white to-gray-50 font-heading relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner className="w-12 h-12 text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-5 bg-gradient-to-b from-white to-gray-50 font-heading relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-500">
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
      className="py-20 px-5 bg-gradient-to-b from-white to-gray-50 font-heading relative overflow-hidden"
      aria-labelledby="sponsors-title"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/3 to-transparent blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/2 to-transparent blur-[80px] animate-float" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Title Section */}
        <div className="text-center mb-16 relative">
          <h2 
            id="sponsors-title"
            className="text-[clamp(2rem,4vw,2.75rem)] text-gray-900 font-bold mb-4 tracking-tight"
          >
            Onze Sponsors
          </h2>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Deze geweldige partners maken De Koninklijke Loop mogelijk
          </p>
          <div className="relative mx-auto w-16 h-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-45 from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-45 from-transparent via-primary/20 to-transparent animate-shine" />
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slideIn cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleOpenSponsorModal(sponsor)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenSponsorModal(sponsor);
                }
              }}
            >
              {/* Logo Container */}
              <div className="aspect-[3/2] p-8 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors rounded-t-2xl">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={sponsor.logoUrl}
                    alt={`${sponsor.name} logo`}
                    className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
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
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {sponsor.name}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                  {sponsor.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-primary/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DKLSponsors; 
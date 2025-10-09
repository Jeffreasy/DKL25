import React, { useState } from 'react';
import { usePartners } from '@/hooks/usePartners';
import { PartnerModal } from '@/components/ui/modals/PartnerModal';
import { trackEvent } from '@/utils/googleAnalytics';
import { cc, cn, animations } from '@/styles/shared';

const PartnerCarrousel: React.FC = () => {
  const { partners, isLoading, error } = usePartners();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (partners.length === 0) return null;

  const handlePartnerClick = (partnerId: string, partnerName: string) => {
    trackEvent('partners', 'partner_click', partnerName);
    setSelectedPartnerId(partnerId);
  };

  const handleModalClose = () => {
    trackEvent('partners', 'modal_closed', 'partner_details');
    setSelectedPartnerId(null);
  };

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  return (
    <>
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          {/* Desktop view */}
          <div className={cn('hidden md:flex md:justify-center md:items-center md:gap-12')}>
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => handlePartnerClick(partner.id, partner.name)}
                className={cn('w-32 h-16', cc.flex.center, 'hover:opacity-75', cc.transition.base)}
              >
                <img
                  src={partner.logo ?? undefined}
                  alt={`Logo van ${partner.name}`}
                  className="max-w-full max-h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Mobiele carousel */}
          <div className="md:hidden relative overflow-hidden mx-auto">
            <div className="relative h-16 flex justify-center">
              <div className={cn('absolute flex gap-8', animations.partnerSlide)}>
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex-shrink-0"
                  >
                    <button
                      onClick={() => handlePartnerClick(partner.id, partner.name)}
                      className={cn('w-[100px] h-16', cc.flex.center)}
                    >
                      <img
                        src={partner.logo ?? undefined}
                        alt={`Logo van ${partner.name}`}
                        className="max-w-[80px] max-h-[40px] object-contain"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedPartner && (
        <PartnerModal 
          isOpen={true}
          onClose={handleModalClose}
          partner={selectedPartner}
        />
      )}
    </>
  );
};

export default PartnerCarrousel; 
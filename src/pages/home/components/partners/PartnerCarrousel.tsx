import React, { useState } from 'react';
import { usePartners } from '@/hooks/usePartners';
import { PartnerModal } from '@/components/modals/PartnerModal';
import type { Partner } from '@/types/partner';

const PartnerCarrousel: React.FC = () => {
  const { partners, isLoading, error } = usePartners();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (partners.length === 0) return null;

  return (
    <>
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          {/* Desktop view */}
          <div className="hidden md:flex md:justify-center md:items-center md:gap-12 flex-wrap">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className="w-32 h-16 flex items-center justify-center hover:opacity-75 transition-opacity"
              >
                <img
                  src={partner.logo}
                  alt={`Logo van ${partner.name}`}
                  className="max-w-full max-h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Mobiele carousel */}
          <div className="md:hidden relative overflow-hidden mx-auto">
            <div className="relative h-16 flex justify-center">
              <div className="absolute flex gap-8 animate-partnerSlide">
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex-shrink-0"
                  >
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="w-[100px] h-16 flex items-center justify-center"
                    >
                      <img
                        src={partner.logo}
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
          onClose={() => setSelectedPartner(null)}
          partner={selectedPartner}
        />
      )}
    </>
  );
};

export default PartnerCarrousel; 
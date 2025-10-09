import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { trackEvent } from '@/utils/googleAnalytics';
import { SEO } from '../../components/common/SEO';
import { cc, cn, colors } from '@/styles/shared';

const Privacy: React.FC = () => {
  useEffect(() => {
    trackEvent('privacy', 'page_view', 'privacy_page');
  }, []);

  return (
    <>
      <SEO 
        title="Privacybeleid | De Koninklijke Loop (DKL)"
        description="Lees hier hoe De Koninklijke Loop omgaat met uw privacy en persoonsgegevens."
        route="/privacy"
      />

      <div className={cn('min-h-screen pt-20', colors.neutral.white)}>
        <div className={cn(cc.container.narrow, 'p-4 sm:p-6')}>
          <div className={cn('bg-white rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden', cc.shadow.xl)}>
            <div className={cn(colors.primary.bg, 'p-4 sm:p-6')}>
              <h1 className={cn(cc.text.h3, 'font-bold text-white tracking-tight', cc.typography.heading)}>
                Privacybeleid
              </h1>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <section>
                <h2 className={cn(cc.text.h5, 'font-semibold text-gray-900 mb-3')}>
                  Privacyverklaring De Koninklijke Loop
                </h2>
                <p className={cn(cc.text.body, cc.text.muted, 'mb-4')}>
                  De Koninklijke Loop respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.
                </p>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Gebruik van verzamelde gegevens
                </h3>
                <div className={cn('space-y-3', cc.text.muted)}>
                  <p>Wanneer u zich aanmeldt voor De Koninklijke Loop, vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om:</p>
                  <ul className={cn(cc.list.ul, 'space-y-2')}>
                    <li>De dienst uit te kunnen voeren</li>
                    <li>U te informeren over het evenement</li>
                    <li>Contact met u op te kunnen nemen indien nodig</li>
                    <li>De deelnemersadministratie te kunnen voeren</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Bewaartermijn
                </h3>
                <p className={cc.text.muted}>
                  Wij bewaren uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld.
                </p>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Delen met derden
                </h3>
                <p className={cc.text.muted}>
                  De Koninklijke Loop verstrekt uw persoonsgegevens alléén aan derden indien dit nodig is voor de uitvoering van een overeenkomst met u, of om te voldoen aan een wettelijke verplichting.
                </p>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Cookies
                </h3>
                <p className={cc.text.muted}>
                  Wij verzamelen gegevens voor onderzoek om zo een beter inzicht te krijgen in onze bezoekers, zodat wij onze diensten hierop kunnen afstemmen. Deze website maakt gebruik van cookies om de website te helpen analyseren hoe gebruikers de site gebruiken.
                </p>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Inzage en correctie
                </h3>
                <p className={cc.text.muted}>
                  U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. U kunt een verzoek tot inzage, correctie of verwijdering sturen naar info@dekoninklijkeloop.nl.
                </p>
              </section>

              <section>
                <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                  Contact
                </h3>
                <p className={cc.text.muted}>
                  Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via info@dekoninklijkeloop.nl.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy; 
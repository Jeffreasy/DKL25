import React, { useEffect, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { trackEvent } from '@/utils/googleAnalytics';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { SEO } from '../../components/common/SEO';
import { cc, cn, colors } from '@/styles/shared';

const Privacy: React.FC = memo(() => {
  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('PrivacyPage');

  useEffect(() => {
    trackInteraction('page_view', 'privacy_page');
  }, [trackInteraction]);

  // Memoize static content to prevent recreation
  const privacySections = useMemo(() => [
    {
      title: 'Privacyverklaring De Koninklijke Loop',
      content: 'De Koninklijke Loop respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld.',
      isIntro: true
    },
    {
      title: 'Gebruik van verzamelde gegevens',
      content: 'Wanneer u zich aanmeldt voor De Koninklijke Loop, vragen we u om persoonsgegevens te verstrekken. Deze gegevens worden gebruikt om:',
      list: [
        'De dienst uit te kunnen voeren',
        'U te informeren over het evenement',
        'Contact met u op te kunnen nemen indien nodig',
        'De deelnemersadministratie te kunnen voeren'
      ]
    },
    {
      title: 'Bewaartermijn',
      content: 'Wij bewaren uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld.'
    },
    {
      title: 'Delen met derden',
      content: 'De Koninklijke Loop verstrekt uw persoonsgegevens alléén aan derden indien dit nodig is voor de uitvoering van een overeenkomst met u, of om te voldoen aan een wettelijke verplichting.'
    },
    {
      title: 'Cookies',
      content: 'Wij verzamelen gegevens voor onderzoek om zo een beter inzicht te krijgen in onze bezoekers, zodat wij onze diensten hierop kunnen afstemmen. Deze website maakt gebruik van cookies om de website te helpen analyseren hoe gebruikers de site gebruiken.'
    },
    {
      title: 'Inzage en correctie',
      content: 'U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. U kunt een verzoek tot inzage, correctie of verwijdering sturen naar info@dekoninklijkeloop.nl.'
    },
    {
      title: 'Contact',
      content: 'Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via info@dekoninklijkeloop.nl.'
    }
  ], []);

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
              {privacySections.map((section, index) => (
                <section key={section.title}>
                  {section.isIntro ? (
                    <>
                      <h2 className={cn(cc.text.h5, 'font-semibold text-gray-900 mb-3')}>
                        {section.title}
                      </h2>
                      <p className={cn(cc.text.body, cc.text.muted, 'mb-4')}>
                        {section.content}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className={cn('text-md font-semibold text-gray-900 mb-2')}>
                        {section.title}
                      </h3>
                      <div className={cn('space-y-3', cc.text.muted)}>
                        <p>{section.content}</p>
                        {section.list && (
                          <ul className={cn(cc.list.ul, 'space-y-2')}>
                            {section.list.map((item, listIndex) => (
                              <li key={listIndex}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Privacy.displayName = 'Privacy';

export default Privacy;
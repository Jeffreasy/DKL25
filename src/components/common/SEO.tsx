import { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

type ISO8601Date = string; // ISO 8601 format (e.g., "2025-10-09T12:00:00Z")

interface EventLocationAddress {
  streetAddress: string;
  addressLocality: string;
  postalCode?: string;
  addressCountry?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  images?: string | string[];
  type?: 'website' | 'article';
  route?: string;
  noIndex?: boolean;
  keywords?: string[];
  isEventPage?: boolean;
  eventName?: string;
  eventStartDate?: ISO8601Date;
  eventEndDate?: ISO8601Date;
  eventDescription?: string;
  eventImage?: string;
  eventLocationName?: string;
  eventLocationAddress?: string | EventLocationAddress;
  eventUrl?: string;
}

const defaultKeywords = [
  'DKL',
  'De Koninklijke Loop',
  'DKL 2026',
  'Koninklijke Loop',
  'wandelevenement',
  'wandelen',
  'lopen',
  'rolstoelvriendelijk',
  'toegankelijk',
  'beperking',
  'Apeldoorn',
  'Paleis Het Loo',
  'goed doel',
  'sponsorloop',
  'inclusief evenement',
];

const defaultTitle = 'De Koninklijke Loop 2026';

export const SEO = memo(
  ({
    title = defaultTitle,
    description = 'De Koninklijke Loop 2026 is een uniek sponsorloop in Nederland, mede georganiseerd door mensen met een beperking voor mensen met een beperking. Schrijf je in, steun het goede doel en ervaar een onvergetelijke dag!',
    images = 'https://www.dekoninklijkeloop.nl/images/hero.jpg',
    type = 'website',
    route = '',
    noIndex = false,
    keywords,
    isEventPage = false,
    eventName,
    eventStartDate,
    eventEndDate,
    eventDescription,
    eventImage,
    eventLocationName,
    eventLocationAddress,
    eventUrl,
  }: SEOProps) => {
    // Performance tracking
    const { trackInteraction } = usePerformanceTracking('SEO');

    // Memoize site configuration
    const siteConfig = useMemo(() => ({
      siteBaseUrl: import.meta.env.VITE_SITE_URL || 'https://www.dekoninklijkeloop.nl',
      url: `${import.meta.env.VITE_SITE_URL || 'https://www.dekoninklijkeloop.nl'}${route}`,
      fullTitle: `${title}${title === defaultTitle ? '' : ` | ${defaultTitle}`}`,
      imageArray: Array.isArray(images) ? images : [images],
      keywordsString: [...defaultKeywords, ...(keywords || [])].join(', ')
    }), [route, title, images, keywords]);

    // Memoize date validation function
    const isValidDate = useMemo(() => (date: string | undefined): boolean => !!date && !isNaN(new Date(date).getTime()), []);

    // Memoize event JSON-LD creation
    const eventJsonLd = useMemo(() => {
      if (
        !isEventPage ||
        !eventName ||
        !isValidDate(eventStartDate) ||
        !eventLocationName ||
        !eventLocationAddress
      ) {
        return null;
      }

      const address =
        typeof eventLocationAddress === 'string'
          ? {
              streetAddress: eventLocationAddress.split(', ')[0] || '',
              addressLocality: eventLocationAddress.split(', ')[1] || 'Apeldoorn',
              postalCode: eventLocationAddress.split(', ')[2] || '',
              addressCountry: 'NL',
            }
          : eventLocationAddress;
      const year = eventName.match(/\d{4}/)?.[0] || '';
      const eventData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': `${siteConfig.url}#event`,
        name: eventName,
        alternateName: year ? [`DKL ${year}`, 'DKL', 'De Koninklijke Loop'] : ['DKL', 'De Koninklijke Loop'],
        startDate: eventStartDate,
        endDate: eventEndDate,
        description: eventDescription || description,
        image: [eventImage || siteConfig.imageArray[0]],
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: eventLocationName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: address.streetAddress,
            addressLocality: address.addressLocality,
            postalCode: address.postalCode || '',
            addressCountry: address.addressCountry || 'NL',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: 'DKL - De Koninklijke Loop',
          alternateName: ['DKL', 'De Koninklijke Loop', 'DKL 2026', 'Koninklijke Loop'],
          url: siteConfig.siteBaseUrl,
        },
        url: eventUrl || siteConfig.url,
      };
      if (!eventData.endDate || !isValidDate(eventData.endDate)) {
        delete eventData.endDate;
      }

      trackInteraction('event_jsonld_created', eventName);
      return JSON.stringify(eventData);
    }, [
      isEventPage,
      eventName,
      eventStartDate,
      eventLocationName,
      eventLocationAddress,
      eventEndDate,
      eventDescription,
      description,
      eventImage,
      eventUrl,
      siteConfig,
      isValidDate,
      trackInteraction
    ]);

    return (
      <Helmet htmlAttributes={{ lang: 'nl' }}>
        <title>{siteConfig.fullTitle}</title>
        <meta name="description" content={description} />
        {noIndex && <meta name="robots" content="noindex" />}
        <meta name="keywords" content={siteConfig.keywordsString} />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:title" content={siteConfig.fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        {siteConfig.imageArray.map((img: string, index: number) => (
          <meta key={`og-image-${index}`} property="og:image" content={img} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={siteConfig.imageArray[0]} />
        <link rel="canonical" href={siteConfig.url} />
        {eventJsonLd && <script type="application/ld+json">{eventJsonLd}</script>}
      </Helmet>
    );
  }
);

SEO.displayName = 'SEO';
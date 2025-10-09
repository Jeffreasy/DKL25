import { memo } from 'react';
import { Helmet } from 'react-helmet-async';

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
  'De Koninklijke Loop',
  'DKL',
  'wandelevenement',
  'wandelen',
  'lopen',
  'rolstoelvriendelijk',
  'toegankelijk',
  'beperking',
  'Apeldoorn',
  'Paleis Het Loo',
  'goed doel',
];

const defaultTitle = 'De Koninklijke Loop (DKL) 2025';

export const SEO = memo(
  ({
    title = defaultTitle,
    description = 'De Koninklijke Loop (DKL) 2025 is een uniek wandelevenement waar mensen met een beperking wandelen voor het goede doel in Apeldoorn.',
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
    const siteBaseUrl = import.meta.env.VITE_SITE_URL || 'https://www.dekoninklijkeloop.nl';
    const url = `${siteBaseUrl}${route}`;
    const fullTitle = `${title}${title === defaultTitle ? '' : ` | ${defaultTitle}`}`;
    const imageArray = Array.isArray(images) ? images : [images];
    const isValidDate = (date: string | undefined): boolean => !!date && !isNaN(new Date(date).getTime());

    let eventJsonLd = null;
    if (
      isEventPage &&
      eventName &&
      isValidDate(eventStartDate) &&
      eventLocationName &&
      eventLocationAddress
    ) {
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
        '@id': `${url}#event`,
        name: eventName,
        alternateName: year ? `DKL ${year}` : 'DKL',
        startDate: eventStartDate,
        endDate: eventEndDate,
        description: eventDescription || description,
        image: [eventImage || imageArray[0]],
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
          name: 'De Koninklijke Loop',
          alternateName: 'DKL',
          url: siteBaseUrl,
        },
        url: eventUrl || url,
      };
      if (!eventData.endDate || !isValidDate(eventData.endDate)) {
        delete eventData.endDate;
      }
      eventJsonLd = JSON.stringify(eventData);
    }

    return (
      <Helmet htmlAttributes={{ lang: 'nl' }}>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {noIndex && <meta name="robots" content="noindex" />}
        <meta name="keywords" content={[...defaultKeywords, ...(keywords || [])].join(', ')} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        {imageArray.map((img, index) => (
          <meta key={`og-image-${index}`} property="og:image" content={img} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageArray[0]} />
        <link rel="canonical" href={url} />
        {eventJsonLd && <script type="application/ld+json">{eventJsonLd}</script>}
      </Helmet>
    );
  }
);
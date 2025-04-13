import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  route?: string;
  // Props for Event Schema.org
  isEventPage?: boolean;
  eventName?: string;
  eventStartDate?: string; // ISO 8601 format
  eventEndDate?: string;   // Optional ISO 8601 format
  eventDescription?: string;
  eventImage?: string;
  eventLocationName?: string;
  eventLocationAddress?: string;
  eventUrl?: string;
}

export const SEO = ({
  title = 'De Koninklijke Loop 2025',
  description = 'De Koninklijke Loop 2025 is een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel.',
  image = 'https://www.koninklijkeloop.nl/images/hero.jpg',
  type = 'website',
  route = '',
  // Event props destructuring
  isEventPage = false,
  eventName,
  eventStartDate,
  eventEndDate,
  eventDescription,
  eventImage,
  eventLocationName,
  eventLocationAddress,
  eventUrl
}: SEOProps) => {
  const siteBaseUrl = 'https://dekoninklijkeloop.nl'; // Define base URL
  const url = `${siteBaseUrl}${route}`;
  const fullTitle = `${title}${title === 'De Koninklijke Loop 2025' ? '' : ' | De Koninklijke Loop 2025'}`;

  // --- Generate Event JSON-LD --- 
  let eventJsonLd = null;
  if (isEventPage && eventName && eventStartDate && eventLocationName && eventLocationAddress) {
    const eventData = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventName,
      startDate: eventStartDate,
      endDate: eventEndDate, // Will be undefined if not provided, which is fine
      description: eventDescription || description, // Use specific or default description
      image: [
        eventImage || image // Use specific or default image
      ],
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: eventLocationName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: eventLocationAddress.split(', ')[0] || '', // Simple split, adjust if needed
          addressLocality: eventLocationAddress.split(', ')[1] || 'Apeldoorn', // Assume Apeldoorn if not specified
          postalCode: eventLocationAddress.split(', ')[2] || '', // Simple split
          addressCountry: 'NL'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: 'De Koninklijke Loop', // Assuming organization name
        url: siteBaseUrl
      },
      url: eventUrl || url // Use specific or default page URL
      // Optional: Add offers (tickets), performer, etc. if needed
    };
    // Remove undefined endDate if not provided
    if (!eventData.endDate) {
      delete eventData.endDate;
    }
    eventJsonLd = JSON.stringify(eventData);
  }
  // --- End Generate Event JSON-LD ---

  return (
    <Helmet>
      {/* Basis Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Inject Event JSON-LD if available */}
      {eventJsonLd && (
        <script type="application/ld+json">
          {eventJsonLd}
        </script>
      )}
    </Helmet>
  );
}; 
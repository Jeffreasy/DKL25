import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  route?: string;
}

export const SEO = ({
  title = 'De Koninklijke Loop 2025',
  description = 'De Koninklijke Loop 2025 is een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel.',
  image = 'https://www.koninklijkeloop.nl/images/hero.jpg',
  type = 'website',
  route = ''
}: SEOProps) => {
  const url = `https://dekoninklijkeloop.nl${route}`;
  const fullTitle = `${title}${title === 'De Koninklijke Loop 2025' ? '' : ' | De Koninklijke Loop 2025'}`;

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
    </Helmet>
  );
}; 
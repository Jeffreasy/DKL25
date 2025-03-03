import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  route?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export const SEO = ({
  title = 'De Koninklijke Loop 2025',
  description = 'De Koninklijke Loop 2025 is een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel.',
  image = 'https://www.koninklijkeloop.nl/images/hero.jpg',
  type = 'website',
  route = '',
  keywords = ['koninklijke loop', 'hardloopevenement', 'sponsorloop', 'goede doel', 'apeldoorn', 'paleis het loo'],
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
  author = 'De Koninklijke Loop'
}: SEOProps) => {
  const url = `https://dekoninklijkeloop.nl${route}`;
  const fullTitle = `${title}${title === 'De Koninklijke Loop 2025' ? '' : ' | De Koninklijke Loop 2025'}`;

  return (
    <Helmet>
      {/* Basis Meta Tags */}
      <html lang="nl" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="googlebot" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />

      {/* Open Graph */}
      <meta property="og:locale" content="nl_NL" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="De Koninklijke Loop" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@koninklijkeloop" />
      <meta name="twitter:creator" content="@koninklijkeloop" />

      {/* Mobile */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1E40AF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Alternate Languages */}
      <link rel="alternate" href={url} hrefLang="nl-NL" />
      <link rel="alternate" href={url} hrefLang="x-default" />
    </Helmet>
  );
}; 
import fs from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

const SITE_URL = 'https://www.dekoninklijkeloop.nl';

interface Route {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const staticRoutes: Route[] = [
  { path: '', changefreq: 'daily', priority: 1.0 },
  { path: '/over-ons', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.8 },
  { path: '/aanmelden', changefreq: 'daily', priority: 0.9 },
  { path: '/dkl', changefreq: 'weekly', priority: 0.8 },
];

async function generateSitemap(): Promise<void> {
  // Haal alle pagina routes op
  const pages = await globby([
    'src/pages/**/*.tsx',
    '!src/pages/_*.tsx',
    '!src/pages/api',
    '!src/pages/404.tsx',
  ]);

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticRoutes
        .map((route) => {
          return `
            <url>
              <loc>${SITE_URL}${route.path}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${route.changefreq}</changefreq>
              <priority>${route.priority.toFixed(1)}</priority>
            </url>
          `;
        })
        .join('')}
      ${pages
        .map((page: string) => {
          const path = page
            .replace('src/pages', '')
            .replace('.tsx', '')
            .replace('/index', '');
          
          if (staticRoutes.some(route => route.path === path)) return '';
          
          return `
            <url>
              <loc>${SITE_URL}${path}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.5</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const formatted = await prettier.format(sitemap, {
    parser: 'html',
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
}

export default generateSitemap; 
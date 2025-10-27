import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const FONTS_DIR = './public/fonts';

// Google Fonts API - Download WOFF2 files directly
const fonts = [
  {
    family: 'Roboto',
    weights: [300, 400, 500, 700],
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
  },
  {
    family: 'Roboto Slab',
    weights: [300, 400, 500, 700],
    url: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700&display=swap'
  },
  {
    family: 'Roboto Slab Variable',
    weights: ['100..900'],
    url: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap'
  }
];

async function downloadFont(cssUrl, fontName) {
  try {
    console.log(`Fetching CSS for ${fontName}...`);
    
    // Fetch the CSS with user-agent to get WOFF2 format
    const response = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const css = await response.text();
    
    // Extract WOFF2 URLs from the CSS
    const urlMatches = css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g);
    
    let count = 0;
    for (const match of urlMatches) {
      const fontUrl = match[1];
      console.log(`  Downloading: ${fontUrl}`);
      
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      
      // Generate filename based on font name and index
      const filename = `${fontName}-${count}.woff2`;
      const filepath = join(FONTS_DIR, filename);
      
      writeFileSync(filepath, Buffer.from(fontBuffer));
      console.log(`  ✓ Saved: ${filename}`);
      count++;
    }
    
    return count;
  } catch (error) {
    console.error(`Error downloading ${fontName}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('Starting font download...\n');
  
  // Create fonts directory if it doesn't exist
  mkdirSync(FONTS_DIR, { recursive: true });
  
  let totalDownloaded = 0;
  
  for (const font of fonts) {
    const fontSlug = font.family.toLowerCase().replace(/\s+/g, '-');
    const downloaded = await downloadFont(font.url, fontSlug);
    totalDownloaded += downloaded;
    console.log('');
  }
  
  console.log(`✓ Download complete! ${totalDownloaded} fonts downloaded.`);
  console.log('\nNOTE: You may need to update src/index.css with the new filenames.');
}

main();
# 🎨 Render-Blocking CSS Optimization Guide

## Problem
The CSS file `index-CN948vbP.css` blocks first paint, causing 258ms delay.

## Solution: Critical CSS Extraction

### Option 1: Manual Critical CSS (Quick Fix)

Add to `index.html` before the main CSS:

```html
<!-- index.html -->
<head>
  <!-- ... other meta tags ... -->
  
  <!-- CRITICAL CSS - inline above-fold styles -->
  <style>
    /* Reset and base */
    *,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}
    html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:Roboto,system-ui,sans-serif}
    body{margin:0;line-height:inherit;background:#fff;color:#111827}
    
    /* Hero section critical styles */
    .hero-critical{position:relative;height:calc(100vh - 5rem);display:flex;align-items:center;justify-content:center}
    .hero-overlay{background:rgba(31,41,55,0.6);padding:1rem 1.5rem;border-radius:0.5rem;text-align:center;width:100%;max-width:80rem}
    .hero-title{font-size:3rem;font-weight:700;color:#fff;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
    
    /* Orange color system (WCAG AA compliant) */
    .text-orange-600{color:rgb(234 88 12)}
    .bg-orange-600{background-color:rgb(234 88 12)}
    .bg-orange-700{background-color:rgb(194 65 12)}
    
    /* Layout utilities */
    .container{max-width:80rem;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
    .flex{display:flex}
    .flex-col{flex-direction:column}
    .items-center{align-items:center}
    .justify-center{justify-content:center}
    .gap-4{gap:1rem}
    .rounded-full{border-radius:9999px}
    .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)}
    
    /* Prevent flash of unstyled content */
    [x-cloak]{display:none}
  </style>
  
  <!-- Load main CSS asynchronously -->
  <link rel="preload" href="/assets/index-CN948vbP.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/assets/index-CN948vbP.css"></noscript>
</head>
```

### Option 2: Automated Critical CSS (Recommended)

Install critical CSS extraction tool:

```bash
npm install --save-dev critical
```

Create `scripts/extract-critical.js`:

```javascript
const critical = require('critical');
const fs = require('fs');

critical.generate({
  // Base directory
  base: 'dist/',
  
  // HTML source
  src: 'index.html',
  
  // Output
  target: {
    html: 'index.html',
    css: 'critical.css'
  },
  
  // Viewport dimensions
  dimensions: [
    { width: 375, height: 667 },  // Mobile
    { width: 1440, height: 900 }  // Desktop
  ],
  
  // Extract inline
  inline: true,
  
  // Ignore specific rules
  ignore: {
    atrule: ['@font-face'],
    rule: [/\.animation/, /\.motion/],
  },
  
  // Minify
  minify: true,
});
```

Add to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "build:critical": "vite build && node scripts/extract-critical.js"
  }
}
```

### Option 3: Vite Plugin (Best for Production)

Install plugin:

```bash
npm install --save-dev vite-plugin-critical
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import critical from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    react(),
    critical({
      criticalUrl: 'https://www.dekoninklijkeloop.nl/',
      criticalPages: [
        { uri: '/', template: 'index' },
        { uri: '/aanmelden', template: 'aanmelden' }
      ],
      criticalConfig: {
        inline: true,
        dimensions: [
          { width: 375, height: 667 },
          { width: 1440, height: 900 }
        ],
        penthouse: {
          timeout: 60000,
          forceInclude: [
            '.hero-*',
            '.text-orange-600',
            '.bg-orange-600'
          ]
        }
      }
    })
  ]
});
```

## Expected Impact

- **FCP Improvement**: 250-300ms faster
- **LCP Improvement**: Additional 250ms faster
- **Performance Score**: +10-15 points

## Testing

After implementing, verify:

```bash
# Build with critical CSS
npm run build:critical

# Test locally
npm run preview

# Run Lighthouse
lighthouse https://localhost:4173 --view
```

Check that:
- [ ] No render-blocking CSS in waterfall
- [ ] FCP occurs within 1.5s
- [ ] Critical styles are inline in `<head>`
- [ ] Full CSS loads after first paint

## Fallback Strategy

If critical CSS causes issues:

1. Keep full CSS as `<link rel="stylesheet">`
2. Use `media="print" onload="this.media='all'"` trick
3. Monitor Core Web Vitals in production

```html
<!-- Fallback approach -->
<link 
  rel="stylesheet" 
  href="/assets/index.css"
  media="print"
  onload="this.media='all';this.onload=null"
>
<noscript>
  <link rel="stylesheet" href="/assets/index.css">
</noscript>
```

## References

- [Critical CSS Guide](https://web.dev/extract-critical-css/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Eliminate Render-Blocking Resources](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/)
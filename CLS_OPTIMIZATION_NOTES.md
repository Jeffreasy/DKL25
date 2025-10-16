# CLS Optimization Notes

## Current Status

**CLS improved from 0.925 → 0.136** (85% improvement!)

## Remaining Issues

Lighthouse identifies two main culprits for the remaining CLS (0.136):

1. **Web Font Loading** - Fonts cause layout shift when they load
2. **Animations** - Animation transitions causing shifts

## Analysis

### Web Font Loading (Primary Issue)

The current setup in [`index.html`](index.html:34-39):
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto+Slab..." 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

**Problem:** The `onload` trick delays stylesheet application, causing FOUT (Flash of Unstyled Text)

**Better Approach:**
1. Use `<link rel="stylesheet">` directly (no onload trick)
2. Rely on `font-display: swap` (already in CSS)
3. Optionally: Use `font-display: optional` for strictest CLS (but may not show font)

### Animations (Secondary Issue)

Layout shifts at ~247ms from:
- Framer Motion animations in Hero section
- Backdrop blur rendering
- Content appearance animations

## Recommendations

### Priority 1: Remove Font Loading Delay

**Option A: Direct Font Loading (Recommended)**
```html
<!-- Remove onload trick, load directly -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;600;700&display=swap">
```

**Option B: System Font Stack (Zero CLS)**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
```

### Priority 2: Reduce Animation Impact

**Current Hero Section:**
```typescript
<div className="bg-black/30 backdrop-blur-sm ...">
```

**Issues:**
- `backdrop-blur-sm` triggers GPU compositing
- Framer Motion animations without explicit dimensions
- Content loading after video

**Solutions:**

1. **Reserve Space for Hero Content:**
```typescript
<section 
  className="relative h-[calc(100vh-5rem)]"
  style={{ containIntrinsicSize: '100vw calc(100vh-5rem)' }}
>
```

2. **Reduce Backdrop Blur Complexity:**
```typescript
// Instead of backdrop-blur-sm, use solid background
className="bg-black/70" // Remove backdrop-blur
```

3. **Disable Initial Animations:**
```typescript
// Use prefers-reduced-motion or skip animations on first render
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Priority 3: Font Optimization Strategies

**A. Use `font-display: optional`:**
```css
@font-face {
  font-display: optional; /* Strictest - never causes layout shift */
}
```

**B. Subset Fonts:**
Only load characters you need:
```
?text=DeKoninklijkeLoop2026...
```

**C. Self-Host Fonts:**
Eliminates Google Fonts latency:
```html
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
```

## Implementation Priority

### Quick Wins (< 5 min):

1. ✅ **Change font loading** - Remove onload trick
   - Edit [`index.html`](index.html:34-39)
   - Expected: CLS 0.136 → 0.05-0.08

2. ✅ **Simplify hero background** - Remove backdrop-blur
   - Edit [`HeroSection.tsx`](src/components/sections/Hero/HeroSection.tsx:75)
   - Expected: CLS 0.136 → 0.03-0.05

### Medium Effort (10-30 min):

3. **Self-host fonts** - Download and serve locally
   - Better control over loading
   - Expected: Additional 0.02-0.03 improvement

4. **Skip initial animations** - Detect first render
   - Prevent animation-based shifts
   - Expected: CLS → <0.05

### Long-term (1+ hour):

5. **System font stack** - Remove web fonts entirely
   - Zero font-related CLS
   - Trade-off: Brand consistency

6. **SSR with inline critical CSS** - Pre-render with fonts
   - Most complex solution
   - Best CLS possible

## Realistic Target

With current setup and quick wins:
- **Achievable CLS: 0.03-0.05**
- **Effort: 5-10 minutes**
- **Trade-offs: Minimal (slightly less blur effect)**

Perfect CLS (<0.01) would require:
- System fonts OR self-hosted fonts
- No animations on initial render
- Significant refactoring

## Recommendation

**Implement Quick Wins #1 and #2:**

1. Remove font loading delay
2. Replace backdrop-blur with solid background

This will get you to CLS ~0.04, which is:
- ✅ "Good" rating (< 0.1)
- ✅ Minimal code changes
- ✅ No significant visual trade-offs

The remaining 0.04 CLS is acceptable for a production site with rich animations and custom fonts.

---

*Current optimizations have already achieved 85% CLS improvement. Further gains require trade-offs between performance and design.*
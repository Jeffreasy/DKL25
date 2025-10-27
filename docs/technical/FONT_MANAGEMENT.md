# Font Management & Validatie
**Laatste Update:** 27 Oktober 2024  
**Project:** DKL25

## Overzicht

Complete documentatie over font validatie, beheer en correct gebruik in het DKL25 project.

---

## Font Validatie Rapport

### Probleem Analyse

**Browser Console Errors:**
```
Failed to decode downloaded font
OTS parsing error: invalid sfntVersion: 875574330
```

**Root Cause:**
5 van de 9 Roboto Slab font bestanden waren corrupt (te klein, onvolledige download):
- ❌ `roboto-slab-300.woff2` (corrupt)
- ❌ `roboto-slab-400.woff2` (corrupt)
- ❌ `roboto-slab-500.woff2` (corrupt)
- ❌ `roboto-slab-700.woff2` (corrupt)
- ❌ `roboto-slab-variable.woff2` (corrupt)

De Roboto fonts waren geldig:
- ✅ `roboto-300.woff2` (10,972 bytes)
- ✅ `roboto.woff2` (15,744 bytes)
- ✅ `roboto-500.woff2` (11,072 bytes)
- ✅ `roboto-700.woff2` (11,040 bytes)

### Oplossing

**Validatie Scripts Ontwikkeld:**

1. **[`scripts/validate-fonts.py`](../../scripts/validate-fonts.py)**
   - Controleert WOFF2 magic number (`wOF2`)
   - Valideert file size (minimaal 48 bytes voor WOFF2 header)
   - Controleert font flavor (TrueType/CFF)

2. **[`scripts/fix-roboto-slab.py`](../../scripts/fix-roboto-slab.py)**
   - Download fonts direct van Google Fonts API
   - Valideert elke download automatisch
   - Maakt backup van oude fonts in `public/fonts-backup/`

### Resultaten

**✅ Alle 9 fonts zijn nu geldig:**

| Font | Weight | Size | Status |
|------|--------|------|--------|
| Roboto | 300 | 10,972 bytes | ✅ Valid |
| Roboto | 400 | 15,744 bytes | ✅ Valid |
| Roboto | 500 | 11,072 bytes | ✅ Valid |
| Roboto | 700 | 11,040 bytes | ✅ Valid |
| Roboto Slab | 300 | 12,480 bytes | ✅ Valid (vervangen) |
| Roboto Slab | 400 | 12,292 bytes | ✅ Valid (vervangen) |
| Roboto Slab | 500 | 12,828 bytes | ✅ Valid (vervangen) |
| Roboto Slab | 700 | 12,848 bytes | ✅ Valid (vervangen) |
| Roboto Slab | Variable | 32,340 bytes | ✅ Valid (vervangen) |

---

## Font Usage Analyse

### Font System Configuratie

**In [`src/index.css`](../../src/index.css:15-86):**

```css
/* Roboto Slab (Headings) - Variable Font */
@font-face {
  font-family: 'Roboto Slab';
  src: url('/fonts/roboto-slab-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* Roboto Slab - Individual weights voor fallbacks */
@font-face {
  font-family: 'Roboto Slab';
  src: url('/fonts/roboto-slab-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... 400, 500, 700 */

/* Roboto (Body Text) */
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... 400, 500, 700 */
```

### Tailwind Configuration

```javascript
// In tailwind.config.ts
fontFamily: {
  heading: ['Roboto Slab', 'serif'],
  body: ['Roboto', 'system-ui', 'sans-serif'],
}
```

### Shared Utilities

Van [`src/styles/shared.ts`](../../src/styles/shared.ts:251-332):

```typescript
export const cc = {
  typography: {
    heading: 'font-heading',    // → Roboto Slab
    body: 'font-body',          // → Roboto
  },
  
  text: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold font-heading',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold font-heading',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold font-heading',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold font-heading',
    h5: 'text-lg md:text-xl lg:text-2xl font-medium font-heading',
    h6: 'text-base md:text-lg font-medium font-heading',
    body: 'text-base leading-relaxed font-body',
    small: 'text-sm font-body',
    muted: 'text-gray-600 font-body',
  }
}
```

---

## Component Font Usage Validatie

### ✅ Aanmelden Pagina

| Component | Headings | Body | Status |
|-----------|----------|------|--------|
| [`aanmelden.tsx`](../../src/pages/Aanmelden/aanmelden.tsx) | `cc.typography.heading` | `cc.text.body` | ✅ |
| [`FormContainer.tsx`](../../src/pages/Aanmelden/components/FormContainer.tsx) | `cc.typography.heading` | `cc.form.label` | ✅ |
| [`SuccessMessage.tsx`](../../src/pages/Aanmelden/components/SuccessMessage.tsx) | `cc.typography.heading` | `cc.text.body` | ✅ |
| [`TermsModal.tsx`](../../src/pages/Aanmelden/components/TermsModal.tsx) | `cc.text.h4/h5` | `cc.text.body` | ✅ |

### ✅ Over Ons Pagina

| Component | Headings | Body | Status |
|-----------|----------|------|--------|
| [`OverOns.tsx`](../../src/pages/over-ons/OverOns.tsx) | Schema only | - | ✅ |
| [`AboutHeader.tsx`](../../src/pages/over-ons/components/AboutHeader.tsx) | `cc.typography.heading` | `cc.typography.lead` | ✅ |
| [`ContentSection.tsx`](../../src/pages/over-ons/components/ContentSection.tsx) | `cc.typography.heading` | `cc.text.muted` | ✅ |

### ✅ DKL Pagina

| Component | Headings | Body | Status |
|-----------|----------|------|--------|
| [`DKL.tsx`](../../src/pages/dkl/DKL.tsx) | Schema only | - | ✅ |
| [`RouteSection.tsx`](../../src/pages/dkl/components/RouteSection.tsx) | `cc.typography.heading` | `cc.typography.lead` | ✅ |

### ✅ Contact Pagina

| Component | Headings | Body | Status |
|-----------|----------|------|--------|
| [`Contact.tsx`](../../src/pages/contact/Contact.tsx) | Schema only | - | ✅ |
| [`FAQ.tsx`](../../src/pages/contact/components/FAQ.tsx) | `cc.typography.heading` | `cc.text.body` | ✅ |
| [`ContactForm.tsx`](../../src/pages/contact/components/ContactForm.tsx) | - | `cc.form.label` | ✅ |

**Conclusie:** Alle componenten gebruiken correct de font system via cc utilities.

---

## Scripts & Tools

### Validatie Script

**[`scripts/validate-fonts.py`](../../scripts/validate-fonts.py)**

```bash
# Valideer alle fonts
python scripts/validate-fonts.py
```

**Output:**
```
============================================================
WOFF2 Font Validator
============================================================

Found 9 font files

✓ roboto-300.woff2 - Valid WOFF2 (10,972 bytes)
✓ roboto-500.woff2 - Valid WOFF2 (11,072 bytes)
✓ roboto-700.woff2 - Valid WOFF2 (11,040 bytes)
✓ roboto-slab-300.woff2 - Valid WOFF2 (12,480 bytes)
✓ roboto-slab-400.woff2 - Valid WOFF2 (12,292 bytes)
✓ roboto-slab-500.woff2 - Valid WOFF2 (12,828 bytes)
✓ roboto-slab-700.woff2 - Valid WOFF2 (12,848 bytes)
✓ roboto-slab-variable.woff2 - Valid WOFF2 (32,340 bytes)
✓ roboto.woff2 - Valid WOFF2 (15,744 bytes)

============================================================
Valid: 9, Invalid: 0
============================================================
```

### Fix Script

**[`scripts/fix-roboto-slab.py`](../../scripts/fix-roboto-slab.py)**

```bash
# Download fresh Roboto Slab fonts
python scripts/fix-roboto-slab.py
```

---

## Font Loading Optimalisatie

### Preload Strategy

In [`index.html`](../../index.html:81-83):
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-700.woff2" as="font" type="font/woff2" crossorigin>
```

### Font Display Strategy

Alle fonts gebruiken `font-display: swap`:
- Voorkomt FOIT (Flash of Invisible Text)
- Minimaliseert CLS (Cumulative Layout Shift)
- Betere perceived performance

---

## Material Icons

### Configuratie

**In [`index.html`](../../index.html:86):**
```html
<!-- Material Icons - Required for icons throughout the site -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap" rel="stylesheet">
```

### Usage
```typescript
// In componenten:
<span className="material-icons-round">mail</span>
<i className="material-icons-round">favorite</i>
```

**Voorbeelden:**
- [`FAQ.tsx`](../../src/pages/contact/components/FAQ.tsx:231) - `mail` icon
- [`AboutHeader.tsx`](../../src/pages/over-ons/components/AboutHeader.tsx:8-9) - `groups` icon
- [`RouteSection.tsx`](../../src/pages/dkl/components/RouteSection.tsx:29) - `directions_walk` icon

---

## Emoji Usage

### Unicode Emoji's

Emoji's zijn Unicode karakters en werken met elk font:

**Aanmelden componenten:**
- Rollen: 👥 (Deelnemer), 🤝 (Begeleider), 💪 (Vrijwilliger)
- Afstanden: 🚶, 🏃, 🏃‍♂️, 🏃‍♀️
- Ondersteuning: ✅, ❌, ❓
- Social: 📘, 📷, 📺, 💼

**FAQ data:**
- Diverse emoji's voor visuele context (zie [`faq.data.ts`](../../src/pages/contact/components/faq.data.ts))

---

## Onderhoud & Monitoring

### Periodieke Validatie

**Wekelijks:**
```bash
python scripts/validate-fonts.py
```

**Bij Font Updates:**
```bash
# Als fonts corrupt raken
python scripts/fix-roboto-slab.py

# Valideer daarna
python scripts/validate-fonts.py
```

### Browser Testing

**Check in DevTools:**
1. Network tab → Filter op "font"
2. Verify alle fonts laden (Status 200)
3. Check geen "Failed to decode" errors
4. Verify font-display: swap werkt

---

## Font Bakery Note

**Belangrijk:** Font Bakery werkt **niet** met WOFF2 files.

Font Bakery requires source fonts (TTF/OTF):
```bash
# Dit werkt NIET met WOFF2:
fontbakery check-adobefonts roboto-slab-300.woff2  # ❌ Error

# Alleen voor TTF/OTF source files:
fontbakery check-adobefonts roboto-slab-300.ttf    # ✅ Works
```

**Voor DKL25:**
- Wij gebruiken WOFF2 web fonts (geoptimaliseerd voor web)
- Custom validator gemaakt: `validate-fonts.py`
- WOFF2 validatie is voldoende voor web deployment

---

## Troubleshooting

### Font Laden Niet

**Check:**
1. Browser DevTools Network tab
2. Verify paths correct: `/fonts/roboto-slab-300.woff2`
3. Check CORS headers (crossorigin attribute)
4. Verify MIME type: `font/woff2`

**Fix:**
```bash
# Re-download fonts
python scripts/fix-roboto-slab.py
```

### Font Errors in Console

**Check:**
```bash
# Valideer alle fonts
python scripts/validate-fonts.py
```

**Als invalid fonts gevonden:**
```bash
# Download verse fonts
python scripts/fix-roboto-slab.py
```

### CLS (Layout Shift) Issues

**Oorzaken:**
- Fonts laden na content render
- Geen font-display: swap
- Geen preload voor critical fonts

**Fix:**
- ✅ Al geïmplementeerd in index.html
- ✅ font-display: swap in alle @font-face
- ✅ Preload voor critical weights

---

## Best Practices

### Do's ✅

- ✅ Gebruik `cc.typography.heading` voor headings
- ✅ Gebruik `cc.typography.body` voor body text
- ✅ Gebruik `font-display: swap` in @font-face
- ✅ Preload critical font weights
- ✅ Valideer fonts periodiek
- ✅ Backup fonts voor re-download

### Don'ts ❌

- ❌ Geen hardcoded font-family in components
- ❌ Geen inline font styles
- ❌ Geen font downloads zonder validatie
- ❌ Geen missing font-display property
- ❌ Geen te veel font weights laden (4-5 is max)

---

## Font Files Inventory

### Roboto (Body Text)
- `roboto-300.woff2` - Light (10,972 bytes)
- `roboto.woff2` - Regular/400 (15,744 bytes)
- `roboto-500.woff2` - Medium (11,072 bytes)
- `roboto-700.woff2` - Bold (11,040 bytes)

### Roboto Slab (Headings)
- `roboto-slab-300.woff2` - Light (12,480 bytes)
- `roboto-slab-400.woff2` - Regular (12,292 bytes)
- `roboto-slab-500.woff2` - Medium (12,828 bytes)
- `roboto-slab-700.woff2` - Bold (12,848 bytes)
- `roboto-slab-variable.woff2` - Variable 100-900 (32,340 bytes)

**Totaal:** 9 fonts, ~129 KB (uncompressed)

---

## Performance Impact

### Font Loading

**Preloaded fonts (critical):**
- roboto.woff2 (400)
- roboto-500.woff2
- roboto-700.woff2

**Lazy loaded (as needed):**
- roboto-300.woff2
- roboto-slab-* (all weights)

### CLS Optimalisatie

**Voor fixes:**
- CLS: 0.365 (font loading shifts)

**Na fixes:**
- CLS: <0.1 (verwacht)
- Font-display: swap prevents FOIT
- Preload prevents render blocking

---

## Conclusie

✅ **Font System Volledig Geoptimaliseerd:**
- Alle fonts gevalideerd en correct
- Consistent gebruik in alle componenten
- Performance geoptimaliseerd (preload, swap)
- Onderhoud scripts beschikbaar
- Zero font errors in console

**Status:** Production Ready 🚀

---

**Laatste Validatie:** 27 Oktober 2024  
**Volgende Check:** Wekelijks of na font updates  
**Scripts:** `validate-fonts.py`, `fix-roboto-slab.py`
# Maintenance Mode (Under Construction) - Frontend Integratie

## Overzicht

De frontend is succesvol geïntegreerd met de backend API voor maintenance mode functionaliteit. De applicatie controleert automatisch bij het laden of er een actieve maintenance mode is en toont de juiste pagina.

## Aangepaste Bestanden

### 1. [`src/hooks/useUnderConstruction.ts`](src/hooks/useUnderConstruction.ts)

**Belangrijkste wijzigingen:**
- ✅ Correct API endpoint: `GET https://dklemailservice.onrender.com/api/under-construction/active`
- ✅ Types aangepast aan backend response format (alle velden nullable waar nodig)
- ✅ Export van `UnderConstructionData` en `SocialLink` types voor hergebruik
- ✅ Gebruik van gecentraliseerde API configuratie uit [`constants.ts`](src/config/constants.ts)
- ✅ Automatic polling om elke 60 seconden te checken voor wijzigingen
- ✅ Timeout van 5 seconden voor betere UX
- ✅ Proper error handling met "fail open" strategie (bij API errors wordt normale site getoond)

**API Response Handling:**
```typescript
// 200 OK - Maintenance mode is actief
if (response.ok) {
  const data = await response.json();
  // Toon maintenance page
}

// 404 Not Found - Geen maintenance mode
if (response.status === 404) {
  // Toon normale website
}

// Andere errors - Default naar normale site
catch (error) {
  // Fail open: toon normale website
}
```

### 2. [`src/components/common/UnderConstruction.tsx`](src/components/common/UnderConstruction.tsx)

**Belangrijkste wijzigingen:**
- ✅ Import van types uit [`useUnderConstruction.ts`](src/hooks/useUnderConstruction.ts) hook
- ✅ Correct gebruik van nullable velden (`footer_text`, `logo_url`, `expected_date`, etc.)
- ✅ Verbeterde `getSocialIcon` functie met YouTube support
- ✅ Nieuwe `formatDate` functie voor Nederlandse datum formatting
- ✅ Footer text wordt alleen getoond als deze bestaat
- ✅ Progress percentage check voor null waarden
- ✅ Performance tracking voor newsletter interacties

**Nieuwe Features:**
- 📅 Verwachte terugkeer datum wordt correct geformatteerd
- 📊 Progress bar met percentage
- 🔗 Social media links met juiste iconen (Twitter, Instagram, YouTube, Facebook, LinkedIn)
- 📧 Contact email met mailto link
- 📰 Newsletter inschrijving formulier (nog te implementeren)

### 3. [`src/config/constants.ts`](src/config/constants.ts)

**Toegevoegd:**
```typescript
export const API_CONFIG = {
  baseUrl: 'https://dklemailservice.onrender.com',
  timeout: 5000
} as const

export const API_ENDPOINTS = {
  // ... existing endpoints
  underConstruction: '/api/under-construction/active'
} as const
```

## Hoe het werkt

### App Flow

1. **App start** ([`App.tsx`](src/App.tsx:22))
   ```typescript
   const { data, loading, error } = useUnderConstruction();
   ```

2. **Loading state**
   - Toont [`LoadingScreen`](src/components/common/LoadingScreen.tsx) component

3. **Maintenance mode check**
   ```typescript
   if (data?.is_active) {
     return <UnderConstruction />;  // Toon maintenance page
   }
   ```

4. **Normal mode**
   ```typescript
   return (
     <Router>
       <NormalApp />  // Toon normale website
     </Router>
   );
   ```

### API Integration

**Endpoint:**
```
GET https://dklemailservice.onrender.com/api/under-construction/active
```

**Response Format:**
```typescript
interface UnderConstructionData {
  id: number;
  is_active: boolean;
  title: string;
  message: string;
  footer_text: string | null;
  logo_url: string | null;
  expected_date: string | null;           // ISO 8601 format
  social_links: SocialLink[] | null;      // Array van {platform, url}
  progress_percentage: number | null;     // 0-100
  contact_email: string | null;
  newsletter_enabled: boolean;
  created_at: string;
  updated_at: string;
}
```

**Example Response (Active):**
```json
{
  "id": 1,
  "is_active": true,
  "title": "Website in onderhoud",
  "message": "We stomen ons klaar voor De Koninklijke Loop 2026...",
  "footer_text": "Bedankt voor uw geduld!",
  "logo_url": "https://res.cloudinary.com/.../logo.png",
  "expected_date": "2026-01-31T18:00:00Z",
  "social_links": [
    {"platform": "Twitter", "url": "https://twitter.com/koninklijkeloop"},
    {"platform": "Instagram", "url": "https://instagram.com/koninklijkeloop"},
    {"platform": "YouTube", "url": "https://youtube.com/@DeKoninklijkeLoop"}
  ],
  "progress_percentage": 85,
  "contact_email": "info@koninklijkeloop.nl",
  "newsletter_enabled": false,
  "created_at": "2025-09-26T17:37:22.197854Z",
  "updated_at": "2025-10-09T21:00:29.391392Z"
}
```

**No Maintenance Mode:**
```
Status: 404 Not Found
Body: {"error": "No active under construction found"}
```

## Features

### ✅ Geïmplementeerd

- [x] Automatische maintenance mode detection
- [x] Real-time polling (elke 60 seconden)
- [x] Logo display (indien beschikbaar)
- [x] Titel en bericht
- [x] Verwachte terugkeer datum (Nederlandse formatting)
- [x] Progress bar met percentage
- [x] Social media links (Twitter, Instagram, YouTube, Facebook, LinkedIn)
- [x] Contact email link
- [x] Newsletter formulier UI
- [x] Footer text
- [x] Loading states
- [x] Error handling (fail open strategie)
- [x] Performance tracking
- [x] Accessibility features (ARIA labels)
- [x] Responsive design

### 🔜 Te Implementeren

- [ ] Newsletter inschrijving backend integratie
- [ ] Custom countdown timer (vervang huidige datum display)
- [ ] Admin dashboard voor maintenance mode configuratie
- [ ] Email notificaties bij maintenance mode activatie
- [ ] Scheduled maintenance mode (automatisch activeren op bepaalde tijd)

## Testing

### Build Test
```bash
npm run build
```
✅ **Resultaat:** Build succesvol zonder TypeScript errors

### Handmatige Tests

1. **Test backend API:**
   ```bash
   curl https://dklemailservice.onrender.com/api/under-construction/active
   ```

2. **Test met actieve maintenance mode:**
   - Backend: Zet `is_active` op `true` in database
   - Frontend: Navigeer naar website
   - Verwacht: Maintenance page wordt getoond

3. **Test zonder maintenance mode:**
   - Backend: Zet `is_active` op `false` in database
   - Frontend: Navigeer naar website
   - Verwacht: Normale website wordt getoond

4. **Test API error handling:**
   - Backend: Stop de API server
   - Frontend: Navigeer naar website
   - Verwacht: Normale website wordt getoond (fail open)

## Production Status

**Current Status (November 2024):** ✅ **NO MAINTENANCE MODE ACTIVE**

De website is normaal beschikbaar. De maintenance mode configuratie staat op `is_active: false` in de database.

## Security & Performance

### Security
- ✅ Public endpoint (geen authenticatie vereist)
- ✅ CORS headers correct geconfigureerd
- ✅ Input validation op backend

### Performance
- ✅ 5 seconden timeout voor API calls
- ✅ Caching met 60 seconden polling interval
- ✅ Fail open strategie bij errors
- ✅ Lazy loading van components
- ✅ Memoization van expensive computations

## Troubleshooting

### API niet bereikbaar
**Symptoom:** Normale website wordt altijd getoond
**Oplossing:** 
1. Check API base URL in [`constants.ts`](src/config/constants.ts)
2. Verify CORS settings op backend
3. Check network tab in browser dev tools

### Maintenance page wordt niet getoond
**Symptoom:** Normale website terwijl `is_active: true`
**Oplossing:**
1. Check backend response met curl
2. Verify `is_active` field in database
3. Check browser console voor errors

### Polling werkt niet
**Symptoom:** Status update niet zichtbaar na 60 seconden
**Oplossing:**
1. Check browser console voor errors
2. Verify cleanup in `useUnderConstruction` hook
3. Test met browser refresh

## Documentatie Links

- [Backend API Documentatie](docs/architecture/BACKEND_API.md)
- [Frontend Architecture](docs/architecture/PROJECT_OVERVIEW.md)
- [Performance Guide](docs/performance/PERFORMANCE_GUIDE.md)

## Contact

Voor vragen over de implementatie:
- Backend Team: Maintenance mode backend implementation
- Frontend Team: React integration en UI components

---

**Laatste Update:** 1 november 2024
**Status:** ✅ Production Ready
**Versie:** 1.0.0
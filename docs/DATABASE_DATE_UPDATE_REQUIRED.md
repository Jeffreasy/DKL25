# DATABASE UPDATE VEREIST: Event Datum Correctie

## Datum: 2 november 2025

## Probleem
De database tabel `title_section_content` bevat een **ONJUISTE** event datum:
- **Huidige waarde**: "17 mei 2026"
- **Correcte waarde**: "16 mei 2026"

## Impact
De event datum die op de website wordt getoond via de EventDetailCard component komt uit de database. Alle code is nu gecorrigeerd naar 16 mei 2026, maar de database moet ook worden bijgewerkt.

## Database Wijzigingen Vereist

### Tabel: `title_section_content`

Update het volgende veld:
- **Veld**: `detail_1_title`
- **Van**: "17 mei 2026"
- **Naar**: "16 mei 2026"

### SQL Query (PostgREST/Supabase)

```sql
UPDATE title_section_content
SET detail_1_title = '16 mei 2026',
    updated_at = NOW()
WHERE detail_1_title = '17 mei 2026';
```

Optioneel, als er ook andere date-gerelateerde velden zijn die de oude datum bevatten, controleer dan ook:
- `event_title` (als deze de datum bevat)
- `event_subtitle` (als deze de datum bevat)
- `image_alt` (als deze de datum bevat)

## Code Wijzigingen Reeds Doorgevoerd

Alle onderstaande code locaties zijn al bijgewerkt naar **16 mei 2026**:

### Gecentraliseerde Configuratie
- ✅ [`src/utils/date/eventDates.ts`](../src/utils/date/eventDates.ts) - EVENT_DATES.main
- ✅ [`src/components/sections/Title/components/CountdownTimer.tsx`](../src/components/sections/Title/components/CountdownTimer.tsx) - TARGET_EVENT_DATE

### Fallback Data
- ✅ [`src/components/sections/Title/TitleSection.tsx`](../src/components/sections/Title/TitleSection.tsx) - DEFAULT_TITLE_DATA

### SEO & Meta Data (12 locaties)
- ✅ `src/pages/dkl/DKL.tsx` - Page meta description + FAQ schema
- ✅ `src/pages/contact/Contact.tsx` - FAQ schema
- ✅ `src/pages/contact/components/faq.data.ts` - FAQ antwoorden
- ✅ `src/pages/Aanmelden/aanmelden.tsx` - Page beschrijving + FAQ schema
- ✅ `src/pages/home/Home.tsx` - Page title + meta beschrijving
- ✅ `src/components/ui/AIChatButton/faq.data.ts` - Chatbot FAQ (2x)

### Content Teksten (5 locaties)
- ✅ `src/pages/dkl/components/RouteSection.tsx` - Route beschrijving
- ✅ `src/pages/Aanmelden/components/TermsModal.tsx` - Voorwaarden (4x)
- ✅ `src/pages/Aanmelden/components/SuccessMessage.tsx` - Bevestigingsberichten (2x)

## Verificatie

Na het uitvoeren van de database update:

1. **Test de website** - Verifieer dat de EventDetailCard nu "16 mei 2026" toont
2. **Check de API response** - 
   ```bash
   curl ${POSTGREST_URL}/title_section_content
   ```
3. **Controleer de browser console** - Zorg dat er geen errors zijn

## Data Flow Overzicht

```
┌─────────────────────────────────────────────────────────┐
│ Database: title_section_content.detail_1_title          │
│ ❌ Moet worden: "16 mei 2026"                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ API: ${POSTGREST_URL}/title_section_content             │
│ (via useTitleSectionData hook)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Component: TitleSection.tsx                             │
│ gebruikt: displayData.detail_1_title                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Component: EventDetailCard.tsx                          │
│ toont: {title} prop in de kaart                         │
└─────────────────────────────────────────────────────────┘
```

## Fallback Gedrag

Als de database **NIET** bereikbaar is, gebruikt de code automatisch de fallback data uit:
- [`TitleSection.tsx:41`](../src/components/sections/Title/TitleSection.tsx:41)

Deze fallback is nu correct ingesteld op **"16 mei 2026"**.

## Actie Vereist

⚠️ **DE DATABASE MOET HANDMATIG WORDEN BIJGEWERKT** ⚠️

Deze wijziging kan niet automatisch worden uitgevoerd en vereist directe toegang tot de database via:
- Supabase Dashboard
- PostgREST API met juiste permissies
- Direct database connectie

## Notitie

De image_url in Cloudinary bevat nog steeds "17_mei" in de bestandsnaam:
```
https://res.cloudinary.com/dgfuv7wif/image/upload/v1760112848/Wij_gaan_17_mei_lopen_voor_hen_3_zllxno_zoqd7z.webp
```

Dit is alleen de bestandsnaam en heeft geen visuele impact. De `image_alt` tekst is wel gecorrigeerd naar "16 mei".

---

**Status**: ⏳ Wachtend op database update  
**Prioriteit**: 🔴 Hoog - Event datum moet correct zijn  
**Verantwoordelijk**: Database Administrator / Backend Team
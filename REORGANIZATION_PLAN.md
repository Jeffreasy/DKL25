# 🔄 DKL25 Component Reorganization Plan

> **Status:** Ready for Execution | **Impact:** Medium-High | **Breaking Changes:** Yes

## 🎯 Doelstellingen

1. Verplaats feature components naar `features/[name]/components/`
2. Reorganiseer `components/` naar `common/`, `layout/`, `ui/`, `sections/`
3. Hernoem components met betere, Engelse namen
4. Update alle imports

---

## 📋 Reorganisatie Mapping

### Feature Components → features/[name]/components/

#### 1. Gallery Feature
```bash
# Van:
src/components/Fotogallerij/
├── ImageModal.tsx
├── MainSlider.tsx
├── NavigationButton.tsx
├── PhotoGallery.tsx
├── ThumbnailSlider.tsx
├── hooks/usePhotoGallery.ts  # Al gemigreerd
├── types.ts                   # Al gemigreerd
└── index.ts

# Naar:
src/features/gallery/components/
├── ImageModal.tsx
├── MainSlider.tsx
├── NavigationButton.tsx
├── PhotoGallery.tsx
├── ThumbnailSlider.tsx
└── index.ts
```

**Nieuwe Namen:**
- `Fotogallerij/` → `gallery/components/`
- `PhotoGallery.tsx` → `GalleryContainer.tsx`
- `MainSlider.tsx` → `MainImageSlider.tsx`
- `ThumbnailSlider.tsx` → `ThumbnailGrid.tsx`
- `NavigationButton.tsx` → `GalleryNavButton.tsx`
- `ImageModal.tsx` → `ImageLightbox.tsx`

#### 2. Video Feature
```bash
# Van:
src/components/video/
├── BackgroundVideo.tsx
├── constants.ts
├── DotIndicator.tsx
├── NavigationButton.tsx
├── types.ts              # Al gemigreerd
├── VideoGallery.tsx
├── VideoSlide.tsx
└── index.ts

# Naar:
src/features/video/components/
├── BackgroundVideo.tsx
├── DotIndicator.tsx
├── NavigationButton.tsx
├── VideoGallery.tsx
├── VideoSlide.tsx
└── index.ts

src/features/video/constants.ts  # Verplaats naar feature root
```

**Nieuwe Namen:**
- `video/` → `video/components/`
- `VideoGallery.tsx` → `VideoGalleryContainer.tsx`
- `VideoSlide.tsx` → `VideoPlayer.tsx`
- `NavigationButton.tsx` → `VideoNavButton.tsx`
- `DotIndicator.tsx` → `VideoIndicator.tsx`

#### 3. Partners Feature
```bash
# Van:
src/components/partners/
└── PartnerCarrousel.tsx

# Naar:
src/features/partners/components/
└── PartnerCarousel.tsx  # Fix spelling: Carrousel → Carousel
```

**Nieuwe Namen:**
- `PartnerCarrousel.tsx` → `PartnerCarousel.tsx` (fix spelling)

#### 4. Sponsors Feature
```bash
# Van:
src/components/sponsors/
├── DKLSponsors.tsx
├── types.ts           # Al gemigreerd
└── index.ts

# Naar:
src/features/sponsors/components/
├── SponsorGrid.tsx    # Hernoem van DKLSponsors
└── index.ts
```

**Nieuwe Namen:**
- `DKLSponsors.tsx` → `SponsorGrid.tsx`

#### 5. Program Feature
```bash
# Van:
src/components/programma/
├── components/
│   ├── ProgramItem.tsx
│   ├── ProgramModal.tsx
│   └── SidebarTrigger/
├── hooks/useProgramSchedule.ts  # Al gemigreerd
├── types.ts                      # Al gemigreerd
├── ProgramSection.tsx
└── index.ts

# Naar:
src/features/program/components/
├── ProgramItem.tsx
├── ProgramModal.tsx
├── ProgramSection.tsx
├── SidebarTrigger/
│   ├── DesktopTrigger.tsx
│   ├── MobileTrigger.tsx
│   ├── TabletTrigger.tsx
│   └── index.ts
└── index.ts
```

**Nieuwe Namen:**
- `programma/` → `program/components/`
- `ProgramSection.tsx` → `ProgramSchedule.tsx`

---

### Shared Components → components/[category]/

#### Common Components
```bash
src/components/common/
├── ErrorBoundary.tsx
├── LoadingScreen.tsx
├── LoadingSpinner.tsx
├── ScrollToTopButton.tsx
└── SEO.tsx
```

#### Layout Components
```bash
src/components/layout/
├── Layout.tsx
├── Navbar/
│   ├── Navbar.tsx
│   ├── MobileMenu.tsx
│   ├── NavIcon.tsx
│   ├── NavItem.tsx
│   ├── SocialLink.tsx
│   ├── constants.ts
│   ├── types.ts
│   └── index.ts
└── Footer/
    ├── Footer.tsx
    ├── data.ts
    ├── types.ts
    └── index.ts
```

#### UI Components
```bash
src/components/ui/
├── AIChatButton/
│   ├── AIChatButton.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── SuggestionChips.tsx
│   ├── aiChatService.ts
│   ├── faq.data.ts
│   ├── schedule.data.ts
│   ├── types.ts
│   └── index.ts
│
├── CTACards/
│   ├── CTACard.tsx
│   ├── CTACards.tsx
│   ├── data.ts
│   ├── types.ts
│   └── index.ts
│
├── modals/
│   ├── ContactModal.tsx
│   ├── DonatieModal.tsx
│   ├── InschrijfModal.tsx
│   ├── PartnerModal.tsx
│   ├── PrivacyModal.tsx
│   ├── SponsorModal.tsx
│   ├── styles.ts
│   ├── types.ts
│   └── index.ts
│
└── buttons/
    └── RegisterDonateButton.tsx  # Van inschrijfdonatebutton
```

**Nieuwe Namen:**
- `inschrijfdonatebutton/inschdoneerbutton.tsx` → `buttons/RegisterDonateButton.tsx`
- `AIChatButton/` → blijft (al goed)
- `CTACards/` → blijft (al goed)
- `modals/` → blijft (al goed)

#### Section Components
```bash
src/components/sections/
├── Hero/
│   └── HeroSection.tsx
│
├── Title/
│   ├── TitleSection.tsx
│   ├── components/
│   │   ├── EventDetailCard.tsx
│   │   └── SocialMediaSection.tsx
│   └── hooks/
│       ├── useSocialMediaData.ts
│       └── useTitleSectionData.ts
│
├── Socials/
│   ├── SocialLinks.tsx      # Van DKLSocials
│   ├── SocialIcon.tsx
│   ├── types.ts
│   └── index.ts
│
└── Radio/
    ├── RadioGallery.tsx
    ├── RadioPlayer.tsx
    └── index.ts
```

**Nieuwe Namen:**
- `Herosection/HeroSection.tsx` → `sections/Hero/HeroSection.tsx`
- `Socials/DKLSocials.tsx` → `sections/Socials/SocialLinks.tsx`
- `Radiogallerij/` → `sections/Radio/`
- `Title/` → `sections/Title/`

---

## 🔄 Execution Steps

### Fase 1: Feature Components (Breaking Changes)

```bash
# 1. Gallery
mkdir src\features\gallery\components
move src\components\Fotogallerij\*.tsx src\features\gallery\components\
move src\components\Fotogallerij\index.ts src\features\gallery\components\

# 2. Video
mkdir src\features\video\components
move src\components\video\*.tsx src\features\video\components\
move src\components\video\index.ts src\features\video\components\
move src\components\video\constants.ts src\features\video\

# 3. Partners
mkdir src\features\partners\components
move src\components\partners\*.tsx src\features\partners\components\

# 4. Sponsors
mkdir src\features\sponsors\components
move src\components\sponsors\DKLSponsors.tsx src\features\sponsors\components\
move src\components\sponsors\index.ts src\features\sponsors\components\

# 5. Program
mkdir src\features\program\components
xcopy src\components\programma\components\* src\features\program\components\ /E /I
move src\components\programma\ProgramSection.tsx src\features\program\components\
move src\components\programma\index.ts src\features\program\components\
```

### Fase 2: Reorganize Shared Components

```bash
# Common
mkdir src\components\common
move src\components\ErrorBoundary.tsx src\components\common\
move src\components\LoadingScreen.tsx src\components\common\
move src\components\LoadingSpinner.tsx src\components\common\
move src\components\ScrollToTopButton.tsx src\components\common\
move src\components\SEO.tsx src\components\common\
move src\components\OnderConstructie.tsx src\components\common\

# Layout
mkdir src\components\layout
move src\components\Layout.tsx src\components\layout\
move src\components\Navbar src\components\layout\Navbar
move src\components\footer src\components\layout\Footer

# UI
mkdir src\components\ui
move src\components\AIChatButton src\components\ui\AIChatButton
move src\components\CTACards src\components\ui\CTACards
move src\components\modals src\components\ui\modals
mkdir src\components\ui\buttons
move src\components\inschrijfdonatebutton\inschdoneerbutton.tsx src\components\ui\buttons\RegisterDonateButton.tsx

# Sections
mkdir src\components\sections
mkdir src\components\sections\Hero
move src\components\Herosection\HeroSection.tsx src\components\sections\Hero\
move src\components\Title src\components\sections\Title
move src\components\Socials src\components\sections\Socials
move src\components\Radiogallerij src\components\sections\Radio
```

---

## 📝 Import Updates Needed

### Gallery Components
```typescript
// Voor:
import PhotoGallery from '@/components/Fotogallerij/PhotoGallery'

// Na:
import { GalleryContainer } from '@/features/gallery/components'
```

### Video Components
```typescript
// Voor:
import VideoGallery from '@/components/video/VideoGallery'

// Na:
import { VideoGalleryContainer } from '@/features/video/components'
```

### Shared Components
```typescript
// Voor:
import LoadingSpinner from '@/components/LoadingSpinner'

// Na:
import { LoadingSpinner } from '@/components/common'
```

---

## ⚠️ Risico's & Mitigatie

### Hoog Risico
- **Import updates:** Alle imports moeten aangepast
- **Build errors:** Mogelijk tijdelijke build failures

### Mitigatie
1. ✅ Maak backup (git commit)
2. ✅ Test na elke fase
3. ✅ Update imports systematisch
4. ✅ Gebruik find & replace voor imports

---

## ✅ Voordelen

### Code Organisatie
- ✅ Feature components bij feature logic
- ✅ Duidelijke component categorieën
- ✅ Betere discoverability
- ✅ Makkelijker onderhoud

### Developer Experience
- ✅ Voorspelbare locaties
- ✅ Logische grouping
- ✅ Betere IDE navigation
- ✅ Cleaner imports

---

## 📊 Impact Schatting

| Aspect | Impact | Effort |
|--------|--------|--------|
| **File moves** | 50+ files | High |
| **Import updates** | 100+ imports | High |
| **Testing** | All features | High |
| **Breaking changes** | Yes | High |
| **Benefits** | Very High | - |

**Totale Effort:** 2-3 uur
**Totale Impact:** Very Positive

---

## 🚀 Execution Strategy

### Optie A: Incrementeel (Aanbevolen)
1. Verplaats één feature per keer
2. Test na elke feature
3. Fix errors direct
4. Commit na elke succesvolle migratie

### Optie B: Bulk
1. Verplaats alle features tegelijk
2. Update alle imports
3. Test alles
4. Fix alle errors

**Aanbeveling:** Optie A voor veiligheid

---

## 📝 Checklist

### Pre-Execution
- [ ] Git commit huidige state
- [ ] Backup maken
- [ ] Team informeren

### Execution
- [ ] Fase 1: Move gallery components
- [ ] Fase 2: Move video components
- [ ] Fase 3: Move partners components
- [ ] Fase 4: Move sponsors components
- [ ] Fase 5: Move program components
- [ ] Fase 6: Reorganize shared components
- [ ] Fase 7: Rename components
- [ ] Fase 8: Update imports
- [ ] Fase 9: Test application
- [ ] Fase 10: Fix errors

### Post-Execution
- [ ] Full TypeScript check
- [ ] Test all features
- [ ] Update documentation
- [ ] Git commit

---

**Klaar voor Executie:** Ja ✅  
**Geschatte Tijd:** 2-3 uur  
**Risk Level:** Medium (mitigeerbaar)
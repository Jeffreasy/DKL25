# 🔄 DKL25 Frontend Refactoring Guide

> **Versie:** 1.0 | **Status:** Draft | **Laatste Update:** 2025-10-09

Complete guide voor code refactoring, folder structure en best practices voor de DKL25 frontend.

---

## 📋 Inhoudsopgave

- [Overzicht](#-overzicht)
- [Huidige Codebase Analyse](#-huidige-codebase-analyse)
- [Nieuwe Folder Structure](#-nieuwe-folder-structure)
- [Code Refactoring](#-code-refactoring)
- [Utilities & Hooks](#-utilities--hooks)
- [Migration Guide](#-migration-guide)
- [Impact & Results](#-impact--results)

---

## 🎯 Overzicht

De DKL25 frontend codebase zal een complete refactoring ondergaan voor betere schaalbaarheid, onderhoudbaarheid en professionaliteit.

### Huidige Status
- ✅ **Codebase geanalyseerd** - Volledig overzicht beschikbaar
- ✅ **Technische stack** geïdentificeerd
- ✅ **Pijnpunten** gedocumenteerd
- 🔄 **Nieuwe structuur** in ontwikkeling

### Doelstellingen
- 📉 **Code reductie** met 30-40%
- 🏗️ **Professionele folder structuur**
- 🔒 **100% TypeScript type safety**
- 🔄 **Herbruikbare utilities**
- 👥 **Betere developer experience**

---

## 🔍 Huidige Codebase Analyse

### Technische Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase, externe API (Render)
- **UI/UX**: Framer Motion, Material-UI icons, React Router
- **Forms**: React Hook Form, Zod validation
- **Analytics**: Google Analytics 4

### Sterke Punten
✅ Moderne tech stack met TypeScript
✅ Uitgebreide analytics tracking
✅ Responsive design met toegankelijkheid
✅ Lazy loading en performance optimalisaties
✅ Goede error handling en loading states
✅ SEO componenten en structured data

### Pijnpunten
⚠️ **API Configuratie**: `server.ts` script maar bestand ontbreekt
⚠️ **Bundle Grootte**: Veel dependencies - tree shaking nodig
⚠️ **Hardcoded Waarden**: Event datum hardcoded
⚠️ **Form Complexiteit**: Inschrijfform heeft veel velden
⚠️ **Error Boundaries**: Niet overal geïmplementeerd
⚠️ **Image Optimalisatie**: Cloudinary preload strategie

### Code Metrics
- **~85 componenten** verdeeld over features
- **~25 custom hooks** voor state management
- **~15 pagina's** met routing
- **~50+ dependencies** in package.json
- **~500KB** geschatte bundle grootte

---

## 📁 Nieuwe Folder Structure

### Professionele Organisatie

```
src/
├── api/                    # API layer
│   ├── client/             # API clients (Supabase, Email service)
│   ├── endpoints/          # API endpoint definities
│   └── types/              # API-specific types
│
├── components/             # Shared components
│   ├── common/             # Common reusable components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   ├── ui/                 # Base UI components
│   └── media/              # Media components (video, gallery)
│
├── config/                 # Configuration
│   ├── constants.ts        # App constants
│   ├── routes.ts           # Route definitions
│   └── zIndex.ts           # Z-index management
│
├── features/               # Feature modules (domain-driven)
│   ├── auth/               # Authentication
│   ├── gallery/            # Photo/video galleries
│   ├── registration/       # Registration system
│   ├── program/            # Event program
│   ├── sponsors/           # Sponsors management
│   └── contact/            # Contact forms
│
├── hooks/                  # Global custom hooks
│   ├── api/                # API hooks
│   ├── ui/                 # UI hooks
│   └── utils/              # Utility hooks
│
├── lib/                    # Third-party integrations
│   ├── supabase.ts         # Supabase client
│   ├── analytics.ts        # Analytics setup
│   └── email.ts            # Email service
│
├── pages/                  # Page components
│   ├── home/               # Home page
│   ├── registration/       # Registration page
│   ├── about/              # About page
│   └── contact/            # Contact page
│
├── providers/              # Global context providers
│   ├── ModalProvider.tsx   # Modal context
│   └── AuthProvider.tsx    # Auth context
│
├── styles/                 # Global styles
│   ├── globals.css         # Global styles
│   ├── shared.ts           # Shared style utilities
│   └── theme.ts            # Theme configuration
│
├── types/                  # Global TypeScript types
│   ├── api.ts              # API types
│   ├── common.ts           # Common types
│   └── forms.ts            # Form types
│
├── utils/                  # Utility functions
│   ├── api/                # API utilities
│   ├── date/               # Date utilities
│   ├── validation/         # Validation utilities
│   └── format/             # Format utilities
│
└── constants/              # Application constants
    ├── events.ts           # Event data
    ├── navigation.ts       # Navigation config
    └── content.ts          # Static content
```

### Feature Structure Pattern

```
features/[feature-name]/
├── components/             # Feature-specific components
├── hooks/                  # Feature-specific hooks
├── services/               # Feature-specific services
├── types/                  # Feature-specific types
├── utils/                  # Feature-specific utilities
├── constants/              # Feature constants
└── index.ts                # Barrel export
```

### Voordelen

1. ✅ **Feature-First** - Zelfstandige features
2. ✅ **Duidelijke Scheiding** - API, components, features gescheiden
3. ✅ **Schonere Imports** - Barrel exports voor clean code
4. ✅ **Schaalbaarheid** - Makkelijk nieuwe features toevoegen
5. ✅ **Onderhoudbaarheid** - Voorspelbare file locaties

---

## 🔄 Code Refactoring

### Nieuwe Utilities

#### 1. Base Types
**Locatie:** `src/types/base.ts`

```typescript
// Herbruikbare basis types
interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

interface VisibleEntity extends BaseEntity {
  visible: boolean
}

interface OrderedEntity extends VisibleEntity {
  order_number: number
}

interface NamedEntity extends BaseEntity {
  name: string
}

interface LogoEntity extends NamedEntity {
  logo: string
  website?: string
}
```

#### 2. API Service Factory
**Locatie:** `src/lib/api/createApiService.ts`

```typescript
const service = createApiService<Partner>({
  endpoint: 'partners',
  sortBy: 'order_number'
})

export const {
  fetchAll: fetchPartners,
  create: createPartner,
  update: updatePartner,
  delete: deletePartner
} = service
```

#### 3. Form Hook Factory
**Locatie:** `src/hooks/forms/useFormFactory.ts`

```typescript
const useRegistrationForm = createFormHook({
  schema: registrationSchema,
  initialValues: defaultRegistrationValues,
  onSubmit: handleRegistrationSubmit
})
```

#### 4. Image Upload Hook
**Locatie:** `src/hooks/ui/useImageUpload.ts`

```typescript
const { previewUrl, handleFileChange, uploadFile } = useImageUpload({
  maxSizeMB: 2,
  acceptedTypes: ['image/jpeg', 'image/png'],
  uploadFunction: uploadToCloudinary
})
```

#### 5. Modal Manager
**Locatie:** `src/hooks/ui/useModalManager.ts`

```typescript
const modal = useModalManager()

// Gebruik
modal.open('contact')
modal.close('contact')
modal.isOpen('contact')
```

### Additional Hooks

- **useAnalytics** - Analytics tracking
- **useDebounce** - Debounce utility
- **useLocalStorage** - Persistent state
- **useIntersectionObserver** - Intersection detection
- **useSwipe** - Touch/swipe gestures
- **useCountdown** - Countdown timer

---

## 📦 Utilities & Hooks

### API Utilities

#### 1. Request Handler
**Locatie:** `src/utils/api/requestHandler.ts`

```typescript
export const handleApiRequest = async <T>(
  request: Promise<T>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    showToast?: boolean
  }
): Promise<T | null> => {
  try {
    const data = await request
    options?.onSuccess?.(data)
    return data
  } catch (error) {
    const err = error as Error
    options?.onError?.(err)
    if (options?.showToast) {
      toast.error(err.message)
    }
    return null
  }
}
```

#### 2. Cache Manager
**Locatie:** `src/utils/api/cacheManager.ts`

```typescript
const cache = new CacheManager()

export const getCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
): Promise<T> => {
  return cache.get(key, fetcher, ttl)
}
```

### Date Utilities

#### 1. Event Date Handler
**Locatie:** `src/utils/date/eventDates.ts`

```typescript
export const EVENT_DATES = {
  main: new Date('2025-05-17T10:00:00+02:00'),
  registration_deadline: new Date('2025-05-15T23:59:59+02:00'),
  early_bird: new Date('2025-03-01T00:00:00+02:00')
} as const

export const isEventPassed = () => new Date() > EVENT_DATES.main
export const isRegistrationOpen = () => new Date() < EVENT_DATES.registration_deadline
```

#### 2. Countdown Calculator
**Locatie:** `src/utils/date/countdown.ts`

```typescript
export const calculateCountdown = (targetDate: Date) => {
  const diff = targetDate.getTime() - Date.now()

  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}
```

### Validation Utilities

#### 1. Form Validators
**Locatie:** `src/utils/validation/formValidators.ts`

```typescript
export const emailValidator = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Ongeldig e-mailadres'
}

export const phoneValidator = (value: string) => {
  const phoneRegex = /^(\+31|0)[6-9]\d{8}$/
  return phoneRegex.test(value) || 'Ongeldig Nederlands telefoonnummer'
}
```

### Format Utilities

#### 1. Content Formatters
**Locatie:** `src/utils/format/contentFormatters.ts`

```typescript
export const formatParticipantCount = (count: number | null) => {
  if (count === null || count === undefined) return '--'
  return new Intl.NumberFormat('nl-NL').format(count)
}

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(date)
}
```

---

## 📝 Migration Guide

### Component Migreren

```typescript
// Voor: Monolithisch component
const PhotoGallery = () => {
  // 200+ regels logica
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    // API call logica
  }

  return (
    <div>
      {/* 100+ regels JSX */}
    </div>
  )
}

// Na: Feature-based component
const PhotoGallery = () => {
  const { photos, loading, error } = useGalleryData()

  if (loading) return <GallerySkeleton />
  if (error) return <ErrorState error={error} />

  return <GalleryGrid photos={photos} />
}
```

### Hook Migreren

```typescript
// Voor: Complexe hook
const usePhotoGallery = () => {
  // 100+ regels state management
}

// Na: Gespecialiseerde hooks
const useGalleryData = () => {
  return useApi('/api/photos')
}

const useGalleryControls = () => {
  return useGalleryNavigation()
}
```

### Service Migreren

```typescript
// Voor: Inline API calls
const fetchPartners = async () => {
  const { data, error } = await supabase.from('partners').select('*')
  if (error) throw error
  return data
}

// Na: Service layer
const partnerService = createApiService<Partner>({
  endpoint: 'partners',
  sortBy: 'order_number'
})

export const { fetchAll: fetchPartners } = partnerService
```

### Styling Migreren

```typescript
// Voor: Inline Tailwind classes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white rounded-lg shadow-md">

// Na: Shared style utilities
<div className={cc.grid.responsive({ cols: 'photos' })}>
```

---

## 📊 Impact & Results

### Geschatte Verbeteringen

| Aspect | Huidig | Na Refactoring | Verbetering |
|--------|--------|----------------|-------------|
| **Code Regels** | ~15,000 | ~10,000 | -33% |
| **Bundle Grootte** | ~500KB | ~350KB | -30% |
| **Type Safety** | 80% | 100% | +20% |
| **Herbruikbaarheid** | 40% | 80% | +40% |
| **Developer Experience** | 60% | 90% | +30% |

### Nieuwe Utilities

| Utility | Regels | Herbruikbaar |
|---------|--------|--------------|
| Base Types | 150 | ✅ Alle features |
| API Service Factory | 200 | ✅ Alle API calls |
| Form Hook Factory | 180 | ✅ Alle forms |
| Image Upload Hook | 120 | ✅ Alle uploads |
| Modal Manager | 100 | ✅ Alle modals |
| **Totaal** | **750** | **Zeer herbruikbaar** |

### Folder Structure Impact

| Metric | Huidig | Na Refactoring | Verbetering |
|--------|--------|----------------|-------------|
| Folders | 25 | 40+ | Betere organisatie |
| Feature Isolation | 20% | 90% | +70% |
| Import Complexity | Hoog | Laag | +80% |
| Maintenance Cost | Hoog | Laag | +60% |

---

## 🎯 Best Practices

### 1. Feature-First Development

✅ **GOED:**
```
features/gallery/
├── components/
├── hooks/
├── services/
└── types/
```

❌ **VERMIJD:**
```
components/Gallery/
components/GalleryModal/
components/GalleryControls/
```

### 2. API Layer Abstraction

✅ **GOED:**
```typescript
const { data, loading } = useApi('/api/photos')
```

❌ **VERMIJD:**
```typescript
const { data, error } = await supabase.from('photos').select('*')
```

### 3. Shared Utilities

✅ **GOED:**
```typescript
import { cc } from '@/styles/shared'
<div className={cc.grid.photos()}>
```

❌ **VERMIJD:**
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
```

### 4. Type Safety

✅ **GOED:**
```typescript
interface Partner extends LogoEntity {
  tier: 'bronze' | 'silver' | 'gold'
}
```

❌ **VERMIJD:**
```typescript
interface Partner {
  id: string
  name: string
  logo: string
  // etc...
}
```

---

## 📚 Referenties

### Core Files (Na Refactoring)
- `src/types/base.ts` - Base types
- `src/lib/api/createApiService.ts` - API service factory
- `src/hooks/forms/useFormFactory.ts` - Form hook factory
- `src/styles/shared.ts` - Shared style utilities

### Feature Examples
- `src/features/gallery/` - Gallery feature
- `src/features/registration/` - Registration feature
- `src/features/program/` - Program feature

---

## ✅ Implementatie Plan

### Fase 1: Foundation (Week 1-2)
- [ ] Folder structure aanmaken
- [ ] Base types implementeren
- [ ] Shared utilities ontwikkelen
- [ ] Configuration migreren

### Fase 2: Core Features (Week 3-4)
- [ ] Gallery feature refactoren
- [ ] Registration feature refactoren
- [ ] API services migreren

### Fase 3: UI/UX (Week 5-6)
- [ ] Shared components ontwikkelen
- [ ] Styling system implementeren
- [ ] Responsive design optimaliseren

### Fase 4: Testing & Optimization (Week 7-8)
- [ ] Unit tests schrijven
- [ ] Performance optimaliseren
- [ ] Bundle size reduceren

### Fase 5: Documentation & Deployment (Week 9-10)
- [ ] Documentatie bijwerken
- [ ] Migration guide voltooien
- [ ] Deployment testen

---

## 📈 Success Metrics

- ✅ **Code Coverage**: 80%+ unit tests
- ✅ **Bundle Size**: < 400KB gzipped
- ✅ **Lighthouse Score**: 90+ performance
- ✅ **Type Coverage**: 100%
- ✅ **Developer Satisfaction**: 85%+

---

**Versie:** 1.0  
**Laatste Update:** 2025-10-09  
**Status:** Draft - Ready for Implementation
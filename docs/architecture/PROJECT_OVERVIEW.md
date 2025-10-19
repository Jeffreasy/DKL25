# 🏗️ DKL25 Project Overview

**Project:** De Koninklijke Loop 2026 Website  
**Status:** Production Ready  
**Laatste Update:** 2025-10-19

---

## 📋 Inhoudsopgave

1. [Project Beschrijving](#-project-beschrijving)
2. [Architectuur](#-architectuur)
3. [Technologie Stack](#-technologie-stack)
4. [Features](#-features)
5. [Installatie & Setup](#-installatie--setup)
6. [Development](#-development)
7. [Deployment](#-deployment)
8. [Project Structuur](#-project-structuur)

---

## 🎯 Project Beschrijving

De Koninklijke Loop (DKL) is een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel. Deze website ondersteunt het evenement met moderne web technologie.

### Kernwaarden
- **Toegankelijkheid** - Voor iedereen toegankelijk
- **Inclusiviteit** - Voor en door mensen met een beperking
- **Professionaliteit** - Moderne, betrouwbare website
- **Performance** - Snelle, geoptimaliseerde ervaring

---

## 🏗️ Architectuur

Het project bestaat uit twee hoofdcomponenten:

### Frontend (React + TypeScript)
Een moderne React applicatie gebouwd met TypeScript en Vite, die de gebruikersinterface verzorgt voor De Koninklijke Loop.

**Key Features:**
- Modern en toegankelijk design met Tailwind CSS
- Responsive layout voor alle apparaten
- SEO optimalisatie met React Helmet
- Performance monitoring met Google Analytics
- Error boundaries voor graceful error handling

### Backend (Go)
Een robuuste email service geschreven in Go die alle email communicatie verzorgt voor het evenement.

**Key Features:**
- RESTful API endpoints
- PostgreSQL database integratie
- Email notificaties via SMTP
- JWT authenticatie
- Rate limiting & beveiliging

---

## 💻 Technologie Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript 5.x
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **SEO:** React Helmet Async
- **UI Library:** Material-UI (icons)
- **Animation:** Framer Motion
- **Analytics:** Google Analytics 4

### Backend
- **Language:** Go 1.21+
- **Database:** PostgreSQL
- **ORM:** GORM
- **Authentication:** JWT
- **Email:** SMTP
- **Monitoring:** Prometheus + ELK

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Supabase (PostgreSQL)
- **Media:** Cloudinary
- **Version Control:** GitHub

---

## ✨ Features

### Gebruikersgerichte Features
- ✅ **Event Informatie** - Complete event details met countdown
- ✅ **Online Aanmelding** - Volledig digitaal aanmeldproces
- ✅ **Contact & FAQ** - 61 FAQ vragen met AI chatbot
- ✅ **Media Gallerij** - Foto's, video's en radio archief
- ✅ **Route Informatie** - Interactieve Komoot kaart
- ✅ **Partner Overzicht** - Sponsors en partners showcase
- ✅ **Social Media** - Integratie met alle platforms

### Technische Features
- ✅ **SEO Optimalisatie** - 27+ structured data schemas
- ✅ **Performance** - 90+ Lighthouse score
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **PWA Ready** - Progressive Web App ondersteuning
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **Analytics** - Complete event tracking
- ✅ **Email Automation** - Automatische bevestigingsmails

---

## 📦 Installatie & Setup

### Vereisten
- Node.js 18+ en npm/pnpm
- Go 1.21+ (voor backend development)
- PostgreSQL (voor backend development)
- Git

### Frontend Setup

1. **Clone repository:**
```bash
git clone https://github.com/Jeffreasy/DKL25.git
cd DKL25
```

2. **Installeer dependencies:**
```bash
npm install
# of
pnpm install
```

3. **Environment configuratie:**

Maak een `.env` bestand aan:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service
VITE_EMAIL_SERVICE_URL=https://dklemailservice.onrender.com

# Google Analytics
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id

# N8N Webhooks (optioneel)
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
VITE_N8N_WEBHOOK_TEST_URL=your_n8n_test_webhook_url
```

4. **Start development server:**
```bash
npm run dev
```

Website is nu beschikbaar op `http://localhost:5173`

### Backend Setup

Zie [`BACKEND_API.md`](BACKEND_API.md) voor complete backend setup instructies.

---

## 🚀 Development

### Development Server
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Bundle Analysis
```bash
npm run build
# Open dist/stats.html voor bundle analyse
```

---

## 📁 Project Structuur

```
DKL25/
├── public/                  # Statische assets
│   ├── robots.txt          # SEO crawler instructies
│   ├── sitemap.xml         # XML sitemap
│   └── manifest.json       # PWA manifest
│
├── src/                     # Source code
│   ├── components/         # Herbruikbare componenten
│   │   ├── common/        # Algemene componenten
│   │   ├── layout/        # Layout componenten
│   │   ├── sections/      # Pagina secties
│   │   └── ui/            # UI componenten
│   │
│   ├── features/          # Feature modules
│   │   ├── gallery/       # Foto gallerij
│   │   ├── video/         # Video gallerij
│   │   ├── partners/      # Partners management
│   │   ├── sponsors/      # Sponsors management
│   │   └── program/       # Event programma
│   │
│   ├── pages/             # Pagina componenten
│   │   ├── home/          # Homepage
│   │   ├── Aanmelden/     # Aanmeld pagina
│   │   ├── contact/       # Contact pagina
│   │   ├── dkl/           # DKL info pagina
│   │   ├── over-ons/      # Over ons pagina
│   │   └── privacy/       # Privacy pagina
│   │
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functies
│   ├── lib/               # Third-party integraties
│   ├── types/             # TypeScript types
│   ├── config/            # Configuratie
│   ├── styles/            # Styling & design system
│   └── providers/         # Context providers
│
├── docs/                   # 📚 Documentatie
│   ├── architecture/      # Architectuur docs
│   ├── guides/           # Development guides
│   ├── performance/      # Performance docs
│   ├── styling/          # Design system docs
│   ├── seo/              # SEO documentatie
│   └── technical/        # Technische details
│
└── archive/               # Gearchiveerde code

```

Zie [`FOLDER_STRUCTURE.md`](FOLDER_STRUCTURE.md) voor gedetailleerde uitleg.

---

## 🎨 Design System

Het project gebruikt een professioneel design system:

- **Kleuren:** Orange (#ff9328) primary, Blue secondary
- **Typography:** Roboto Slab (headings), Roboto (body)
- **Responsive:** Mobile-first breakpoints
- **Animations:** Framer Motion
- **Icons:** Heroicons v2 + Material Icons

Zie [`../styling/DESIGN_SYSTEM.md`](../styling/DESIGN_SYSTEM.md) voor complete design system.

---

## 🔒 Beveiliging

### Frontend
- Environment variables voor gevoelige data
- Form validatie met Zod
- Error boundaries
- CORS configuratie
- CSP headers

### Backend
- JWT authenticatie
- Rate limiting
- Input validatie
- SQL injection preventie
- HTTPS in productie

---

## 📊 Performance

### Huidige Metrics
- **Lighthouse Score:** 90+
- **Bundle Size:** ~414.5 kB
- **Time to Interactive:** ~1.9s
- **First Contentful Paint:** ~1.6s
- **Cumulative Layout Shift:** <0.1

Zie [`../performance/PERFORMANCE_GUIDE.md`](../performance/PERFORMANCE_GUIDE.md) voor details.

---

## 🔍 SEO

### Implementaties
- **27+ Structured Data schemas**
- **61 FAQ vragen**
- **90+ ARIA attributes**
- **77 internal links**
- **DKL branding in 45+ locaties**

Zie [`../seo/SEO_COMPLETE_GUIDE.md`](../seo/SEO_COMPLETE_GUIDE.md) voor complete SEO strategie.

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Testing
- WAVE Web Accessibility Evaluator
- axe DevTools
- Screen reader testing (NVDA, VoiceOver)

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Automatisch via GitHub integration
git push origin main
```

### Backend (Render)
Zie [`BACKEND_API.md`](BACKEND_API.md) voor deployment instructies.

### Environment Variables
Configureer environment variables in Vercel dashboard:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_GA_MEASUREMENT_ID
- VITE_EMAIL_SERVICE_URL

---

## 📞 Support & Contact

### Development Team
- **Email:** info@dekoninklijkeloop.nl
- **Website:** https://dekoninklijkeloop.nl
- **GitHub:** https://github.com/Jeffreasy/DKL25

### Documentatie
- **Complete Docs:** [`/docs`](../README.md)
- **API Guide:** [`../guides/API_INTEGRATION.md`](../guides/API_INTEGRATION.md)
- **Styling Guide:** [`../styling/DESIGN_SYSTEM.md`](../styling/DESIGN_SYSTEM.md)

---

## 📄 Licentie

Dit project is eigendom van De Koninklijke Loop. Alle rechten voorbehouden.

---

## 🎉 Credits

Ontwikkeld met ❤️ voor De Koninklijke Loop door het development team.

**Ondersteund door:**
- Het Liliane Fonds
- Gemeente Apeldoorn
- Alle vrijwilligers en sponsors

---

**Versie:** 2.0  
**Laatste Update:** 2025-10-19  
**Status:** ✅ Production Ready
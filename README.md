# 🏃 De Koninklijke Loop 2026 (DKL)

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/Jeffreasy/DKL25)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Lighthouse](https://img.shields.io/badge/lighthouse-90+-green.svg)](docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md)
[![Accessibility](https://img.shields.io/badge/WCAG-AA-success.svg)](docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md)

Een moderne, hoogperformante webapplicatie voor De Koninklijke Loop 2026 - een uniek, toegankelijk wandelevenement georganiseerd voor en door mensen met een beperking.

---

## 🌟 Over Het Project

De Koninklijke Loop (DKL) is een inspirerend wandelevenement op **17 mei 2026** waarbij deelnemers over de historische Koninklijke Weg wandelen van Kootwijk naar Apeldoorn. Het evenement is volledig **rolstoeltoegankelijk** en ondersteunt het Liliane Fonds.

**Kernwaarden:**
- 🦽 **Toegankelijkheid:** Voor mensen met en zonder beperking
- 🤝 **Inclusiviteit:** Door en voor mensen met een beperking georganiseerd
- ❤️ **Goed Doel:** Steunt het Liliane Fonds
- 🏃 **Keuze:** 2.5, 6, 10 of 15 KM routes

---

## 🚀 Quick Start

### Installatie

```bash
# Clone repository
git clone https://github.com/Jeffreasy/DKL25.git
cd DKL25

# Installeer dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Maak een `.env` bestand:

```env
# Supabase Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service
VITE_EMAIL_SERVICE_URL=https://dklemailservice.onrender.com

# Analytics
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id

# Cloudinary (Images)
VITE_CLOUDINARY_CLOUD_NAME=dgfuv7wif
```

### Ontwikkel Scripts

```bash
npm run dev          # Development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

---

## 📚 Documentatie

**📖 Complete Docs:** [`docs/README.md`](docs/README.md)

### Categorieën

| Categorie | Documenten | Beschrijving |
|-----------|------------|--------------|
| 🏗️ **[Architecture](docs/architecture/)** | 4 | Project setup, folder structuur, backend API |
| 📚 **[Guides](docs/guides/)** | 4 | Development, refactoring, code quality |
| ⚡ **[Performance](docs/performance/)** | 5 | Lighthouse, optimalisaties, monitoring |
| 🎨 **[Styling](docs/styling/)** | 2 | Design system, color & typography |
| 🔍 **[SEO](docs/seo/)** | 1 | Complete SEO strategie |
| 🔧 **[Technical](docs/technical/)** | 3 | Implementation, events, fonts |

**Totaal:** 19+ professionele documenten

### Quick Reference

**Voor Nieuwe Developers:**
1. Start: [`docs/README.md`](docs/README.md)
2. Architecture: [`docs/architecture/PROJECT_OVERVIEW.md`](docs/architecture/PROJECT_OVERVIEW.md)
3. Folder Structure: [`docs/architecture/FOLDER_STRUCTURE.md`](docs/architecture/FOLDER_STRUCTURE.md)
4. Design System: [`docs/styling/DESIGN_SYSTEM.md`](docs/styling/DESIGN_SYSTEM.md)

**Voor Performance Work:**
- Checklist: [`docs/performance/OPTIMIZATION_CHECKLIST.md`](docs/performance/OPTIMIZATION_CHECKLIST.md)
- Lighthouse: [`docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md`](docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md)
- Complete Guide: [`docs/performance/PERFORMANCE_GUIDE.md`](docs/performance/PERFORMANCE_GUIDE.md)

**Voor Code Quality:**
- Improvements: [`docs/guides/CODE_QUALITY_IMPROVEMENTS.md`](docs/guides/CODE_QUALITY_IMPROVEMENTS.md)
- Refactoring: [`docs/guides/REFACTORING_GUIDE.md`](docs/guides/REFACTORING_GUIDE.md)

**Voor Font/Styling Issues:**
- Font Management: [`docs/technical/FONT_MANAGEMENT.md`](docs/technical/FONT_MANAGEMENT.md)
- Design System: [`docs/styling/DESIGN_SYSTEM.md`](docs/styling/DESIGN_SYSTEM.md)

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18.3 + TypeScript 5.6
- **Build Tool:** Vite 6.0
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 7.1
- **Forms:** React Hook Form + Zod
- **Animation:** Framer Motion
- **Icons:** Material Icons Round

### Backend
- **API:** Go 1.21+ (REST)
- **Database:** PostgreSQL 15 (Supabase)
- **Storage:** Cloudinary
- **Email:** SMTP Service (Render)

### Infrastructure
- **Hosting:** Vercel (Edge Network)
- **CDN:** Cloudinary + Vercel Edge
- **Analytics:** Google Analytics 4
- **Monitoring:** Vercel Analytics

---

## ✨ Features

### Gebruikersfuncties
- ✅ **Online Registratie** - Aanmelden voor 2.5, 6, 10 of 15 KM
- ✅ **Media Galleries** - Foto's en video's van vorige edities
- ✅ **AI Chatbot** - 61 FAQ vragen beantwoorden
- ✅ **Contact Forms** - Direct contact met organisatie
- ✅ **Route Informatie** - Interactieve kaarten en details

### Technische Features
- ✅ **SEO Optimized** - 27+ structured data schemas
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Performance** - 90+ Lighthouse score
- ✅ **PWA Ready** - Service Worker & offline support
- ✅ **Responsive** - Mobile-first design
- ✅ **Type Safe** - 100% TypeScript coverage

---

## 🎯 Performance Metrics

### Lighthouse Scores (Production)

| Metric | Score | Status |
|--------|-------|--------|
| **Performance** | 90+ | ✅ Excellent |
| **Accessibility** | 100 | ✅ Perfect |
| **Best Practices** | 100 | ✅ Perfect |
| **SEO** | 100 | ✅ Perfect |

### Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **LCP** | 2.5s | <2.5s | ✅ Good |
| **FID** | <100ms | <100ms | ✅ Good |
| **CLS** | 0.05 | <0.1 | ✅ Good |

Zie [`docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md`](docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md) voor details.

---

## 🏗️ Project Structuur

```
DKL25/
├── docs/                    # 📚 Complete documentatie
│   ├── architecture/       # Project setup & structuur
│   ├── guides/            # Development guides
│   ├── performance/       # Performance optimalisaties
│   ├── styling/          # Design system
│   ├── seo/              # SEO strategie
│   └── technical/        # Technical details
├── public/                # Statische assets
│   └── fonts/            # Self-hosted fonts (WOFF2)
├── scripts/              # Utility scripts
│   ├── validate-fonts.py      # Font validatie
│   └── fix-roboto-slab.py     # Font repair
├── src/
│   ├── components/       # React componenten
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   ├── sections/    # Page sections
│   │   └── ui/          # UI elements
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Shared styles & utilities
│   └── types/           # TypeScript definitions
└── README.md            # Dit bestand
```

Zie [`docs/architecture/FOLDER_STRUCTURE.md`](docs/architecture/FOLDER_STRUCTURE.md) voor volledige structuur.

---

## 🔧 Development Tools

### Font Management

```bash
# Valideer alle fonts
python scripts/validate-fonts.py

# Fix corrupt fonts
python scripts/fix-roboto-slab.py
```

Zie [`docs/technical/FONT_MANAGEMENT.md`](docs/technical/FONT_MANAGEMENT.md)

### Code Quality

```bash
# Detect code duplication
npx jscpd --min-tokens 50 src/

# Bundle analysis
npm run build -- --analyze
```

Zie [`docs/guides/CODE_QUALITY_IMPROVEMENTS.md`](docs/guides/CODE_QUALITY_IMPROVEMENTS.md)

### Performance Audits

```bash
# Lighthouse audit
lighthouse http://localhost:5173 --view

# Production audit
lighthouse https://www.dekoninklijkeloop.nl --view
```

---

## 🎨 Design System

### Typography
- **Headings:** Roboto Slab (300, 400, 500, 700, Variable)
- **Body:** Roboto (300, 400, 500, 700)
- **Icons:** Material Icons Round

### Color Palette
- **Primary:** Orange (`#c2410c` - WCAG AA compliant)
- **Secondary:** Blue
- **Accessible:** All colors meet WCAG 2.1 AA standards

Zie [`docs/styling/DESIGN_SYSTEM.md`](docs/styling/DESIGN_SYSTEM.md)

---

## 🌐 Deployment

### Productie (Vercel)

```bash
# Automatisch via Git push
git push origin main
```

### Preview Deployment

```bash
# Vercel CLI
vercel deploy
```

Zie [`docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md`](docs/performance/LIGHTHOUSE_OPTIMIZATIONS.md) voor complete deployment guide.

---

## 📊 Project Status

**Versie:** 2.1.0  
**Status:** ✅ Production Ready  
**Laatste Update:** 27 Oktober 2024

### Recent Updates (v2.1.0)

✅ **Font System Overhaul**
- 5 corrupt fonts vervangen en gevalideerd
- Custom WOFF2 validation scripts
- Material Icons fix

✅ **Code Quality Improvements**
- 95% code duplicatie verwijderd (LazySection refactor)
- Shared component architectuur
- TypeScript 100% coverage

✅ **Documentation Reorganization**
- 5 losse MD files → professionele docs/ structuur
- 3 nieuwe comprehensive guides
- Complete indexing & cross-referencing

✅ **Performance Optimizations**
- LCP: -91% render delay improvement
- CLS: -86% improvement
- WCAG AA color contrast compliance

Zie [`docs/DOCUMENTATION_UPDATE_2024-10-27.md`](docs/DOCUMENTATION_UPDATE_2024-10-27.md)

---

## 🤝 Contributing

Voor bijdragen aan dit project:

1. **Fork** de repository
2. **Create** een feature branch (`git checkout -b feature/AmazingFeature`)
3. **Follow** code quality guidelines in [`docs/guides/CODE_QUALITY_IMPROVEMENTS.md`](docs/guides/CODE_QUALITY_IMPROVEMENTS.md)
4. **Commit** met duidelijke messages
5. **Push** naar je branch
6. **Open** een Pull Request

### Code Review Checklist

- [ ] TypeScript types volledig
- [ ] Gebruikt shared utilities (`cc`, `colors`, `animations`)
- [ ] Accessibility WCAG AA compliant
- [ ] Performance tested (Lighthouse)
- [ ] Geen code duplicatie
- [ ] Documentation updated

---

## 📄 Licentie

© 2024-2026 De Koninklijke Loop. Alle rechten voorbehouden.

Dit project is eigendom van De Koninklijke Loop. Gebruik zonder toestemming is niet toegestaan.

---

## 📞 Contact & Support

**Website:** [https://dekoninklijkeloop.nl](https://dekoninklijkeloop.nl)  
**Email:** info@dekoninklijkeloop.nl  
**GitHub:** [https://github.com/Jeffreasy/DKL25](https://github.com/Jeffreasy/DKL25)

**Social Media:**
- [Facebook](https://www.facebook.com/p/De-Koninklijke-Loop-61556315443279/)
- [Instagram](https://www.instagram.com/koninklijkeloop/)
- [YouTube](https://www.youtube.com/@DeKoninklijkeLoop)
- [LinkedIn](https://www.linkedin.com/company/dekoninklijkeloop)

---

## 🙏 Acknowledgments

Gemaakt met ❤️ voor De Koninklijke Loop door het development team.

**Speciale dank aan:**
- 's Heeren Loo voor partnerschap
- Alle vrijwilligers en supporters
- Het Liliane Fonds

---

**Version:** 2.1.0  
**Last Updated:** 27 Oktober 2024  
**Status:** 🚀 Production Ready

**Documentation:** [`docs/`](docs/README.md) | **Issues:** [GitHub Issues](https://github.com/Jeffreasy/DKL25/issues)
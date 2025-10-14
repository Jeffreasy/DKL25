# De Koninklijke Loop 2026

Een moderne webapplicatie voor De Koninklijke Loop 2026, een uniek hardloopevenement waar mensen met een beperking wandelen voor het goede doel.

## 🏗️ Architectuur

Het project bestaat uit twee hoofdcomponenten:

### Frontend (React + TypeScript)
Een moderne React applicatie gebouwd met TypeScript en Vite, die de gebruikersinterface verzorgt voor De Koninklijke Loop.

### Backend (Go)
Een robuuste email service geschreven in Go die alle email communicatie verzorgt voor het evenement.

## 🚀 Frontend Features

- Modern en toegankelijk design met Tailwind CSS
- Responsive layout voor alle apparaten
- Formulieren voor aanmelding en contact met Zod validatie
- Email notificaties via N8N integratie
- Google Analytics tracking
- SEO optimalisatie met React Helmet
- Social media integratie (Facebook, Instagram, YouTube, LinkedIn)
- PDF generatie voor aanmeldbevestigingen
- Error boundaries voor graceful error handling
- Loading states en animaties
- Donatie modal integratie
- Automatische email ophaling en verwerking

## 🛠️ Frontend Technologieën

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zod (form validatie)
- React Helmet (SEO)
- Material UI
- React Hot Toast
- Canvas Confetti
- QRCode
- Date-fns

## 📦 Frontend Installatie

1. Clone de repository:
```bash
git clone [repository-url]
```

2. Installeer dependencies:
```bash
npm install
```

3. Maak een `.env` bestand aan met de volgende variabelen:
```env
# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=dekoninklijkeloop.nl
MAILGUN_FROM=noreply@dekoninklijkeloop.nl

# Supabase Configuration
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url

# N8N Webhooks
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
VITE_N8N_WEBHOOK_TEST_URL=your_n8n_test_webhook_url

# Google Analytics
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id

# Email Service
RESEND_API_KEY=your_resend_api_key
VITE_EMAIL_SERVICE_URL=your_email_service_url
```

4. Start de development server:
```bash
npm run dev
```

## 🏗️ Frontend Project Structuur

```
src/
├── components/         # Herbruikbare componenten
│   ├── Navbar/        # Navigatie component
│   ├── Footer/        # Footer component
│   ├── modals/        # Modal componenten
│   └── ...
├── pages/             # Pagina componenten
│   ├── home/          # Homepage
│   ├── over-ons/      # Over ons pagina
│   ├── contact/       # Contact pagina
│   ├── aanmelden/     # Aanmeld pagina
│   └── ...
├── utils/             # Utility functies
│   ├── emailService.ts    # Email service integratie
│   ├── googleAnalytics.ts # Analytics tracking
│   └── socialScripts.ts   # Social media integratie
├── lib/               # Bibliotheek functies
├── hooks/             # Custom React hooks
├── providers/         # React context providers
├── icons/             # Icon componenten
├── types/             # TypeScript type definities
├── App.tsx            # Hoofdapplicatie component
└── main.tsx           # Applicatie entry point
```

## 📱 Frontend Pagina's

- Home (`/`) - Landing page met event informatie
- Over Ons (`/over-ons`) - Informatie over De Koninklijke Loop
- Contact (`/contact`) - Contactformulier
- FAQ (`/faq`) - Veelgestelde vragen
- Wat is De Koninklijke Loop (`/wat-is-de-koninklijkeloop`) - Informatie over het evenement
- Aanmelden (`/aanmelden`) - Aanmeldformulier
- Privacy (`/privacy`) - Privacybeleid

## 🔒 Frontend Beveiliging

- API keys worden veilig opgeslagen in environment variables
- Form validatie met Zod
- Error boundaries voor graceful error handling
- CORS configuratie voor API calls
- Secure headers en CSP configuratie

## 🧪 Frontend Testing

```bash
npm test
```

## 📦 Frontend Build

```bash
npm run build
```

## 🚀 Backend Features

### Email Service
- Contactformulier emails met automatische bevestigingen
- Aanmeldingsformulier emails met gepersonaliseerde content
- Automatische bevestigingsmails met event-specifieke informatie
- Admin notificaties voor nieuwe aanmeldingen en contactverzoeken
- HTML templates met dynamische content
- Fallback naar plaintext voor betere deliverability

### Authenticatie & Autorisatie
- JWT-gebaseerde authenticatie
- Gebruikersbeheer met rollen (admin, gebruiker)
- Wachtwoord hashing met bcrypt
- Login rate limiting
- Beveiligde wachtwoord reset
- HTTP-only cookies
- Rol-gebaseerde toegangscontrole

### Contact & Aanmelding Beheer
- Beheer van contactformulieren
- Beheer van aanmeldingen
- Antwoorden toevoegen
- Status tracking
- Filtering op status en rol
- Automatische email notificaties

### Beveiliging & Stabiliteit
- Rate limiting per IP en globaal
- CORS beveiliging
- Graceful shutdown
- Retry mechanisme voor failed emails
- Input validatie en sanitization
- Secure SMTP configuratie
- XSS preventie

### Monitoring & Observability
- Prometheus metrics
- ELK logging integratie
- Email metrics per template
- Health check endpoints
- Performance metrics
- Rate limit statistieken
- Error tracking

## 🛠️ Backend Technologieën

- Go 1.21+
- PostgreSQL
- GORM (ORM)
- JWT
- SMTP
- Prometheus
- ELK Stack
- Docker

## 📦 Backend Installatie

1. Clone de repository:
```bash
git clone [repository-url]
cd dklemailservice
```

2. Installeer dependencies:
```bash
go mod download
go mod verify
```

3. Configureer de omgevingsvariabelen in `.env`:
```env
# Algemene SMTP configuratie
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@example.com
SMTP_TLS_ENABLED=true
SMTP_TIMEOUT=10s

# Database configuratie
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=dklemailservice
DB_SSL_MODE=disable

# JWT configuratie
JWT_SECRET=your_jwt_secret_key
JWT_TOKEN_EXPIRY=24h

# Rate Limiting
GLOBAL_RATE_LIMIT=1000
IP_RATE_LIMIT=50
RATE_LIMIT_WINDOW=1h
```

4. Start de service:
```bash
# Development
go run main.go

# Production
go build -ldflags="-s -w" -o dklemailservice
./dklemailservice
```

## 🐳 Docker

### Frontend
```bash
# Build
docker build -t dkl-frontend .

# Run
docker run -p 3000:3000 dkl-frontend
```

### Backend
```bash
# Build
docker build -t dklemailservice .

# Run
docker run -p 8080:8080 --env-file .env dklemailservice
```

## 📊 Monitoring

### Frontend
- Google Analytics voor gebruikersgedrag
- Error tracking met ErrorBoundary
- Performance monitoring

### Backend
- Prometheus metrics
- ELK logging
- Health check endpoints
- Rate limit monitoring

## 📄 Licentie

Dit project is eigendom van De Koninklijke Loop. Alle rechten voorbehouden.

## 👥 Bijdragen

Voor bijdragen, neem contact op met het development team via het contactformulier op de website.

## 📞 Contact

Voor vragen of ondersteuning:
- Email: info@dekoninklijkeloop.nl
- Website: https://dekoninklijkeloop.nl
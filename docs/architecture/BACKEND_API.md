# 🔧 DKL25 Go Backend API Documentation

**Versie:** 2.0
**Status:** Production Ready
**Laatste Update:** 2025-01-19

---

## 📋 Inhoudsopgave

1. [Overzicht](#-overzicht)
2. [Frontend API Reference](#-frontend-api-reference)
3. [Authentication & Authorization](#-authentication--authorization)
4. [System Components](#-system-components)
5. [Database Schema](#-database-schema)
6. [Deployment](#-deployment)

---

## 🎯 Overzicht

Deze Go backend dient als API laag tussen de React frontend en PostgreSQL database voor de DKL25 website. Het biedt directe toegang tot de database via RESTful endpoints met complete authenticatie en autorisatie.

## Technologie Stack

- **Go 1.21+** - Backend taal
- **PostgreSQL** - Database
- **Gorilla Mux** - HTTP router
- **pq** - PostgreSQL driver
- **CORS** - Cross-origin resource sharing
- **JSON** - Data serialisatie

## Database Schema

### Partners Table
```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT,
    website TEXT,
    tier TEXT NOT NULL,
    since DATE NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    order_number INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Photos Table
```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT NOT NULL,
    title TEXT,
    description TEXT,
    visible BOOLEAN DEFAULT TRUE,
    year INTEGER,
    cloudinary_folder TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Albums Table
```sql
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_photo_id UUID REFERENCES photos(id),
    visible BOOLEAN DEFAULT TRUE,
    order_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Album-Photos Junction Table
```sql
CREATE TABLE album_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    order_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Social Links Table
```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    bg_color_class TEXT,
    icon_color_class TEXT,
    order_number INTEGER,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Program Schedule Table
```sql
CREATE TABLE program_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT,
    event_description TEXT NOT NULL,
    icon_name TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    order_number INTEGER NOT NULL,
    time TEXT NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Title Sections Table
```sql
CREATE TABLE title_section_content (
    id INTEGER PRIMARY KEY,
    event_title TEXT NOT NULL,
    event_subtitle TEXT,
    image_url TEXT,
    image_alt TEXT,
    detail_1_title TEXT,
    detail_1_description TEXT,
    detail_2_title TEXT,
    detail_2_description TEXT,
    detail_3_title TEXT,
    detail_3_description TEXT,
    participant_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Social Embeds Table
```sql
CREATE TABLE social_embeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    embed_code TEXT NOT NULL,
    order_number INTEGER,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Partners
- `GET /api/partners` - Haal alle zichtbare partners op
- `GET /api/partners/{id}` - Haal specifieke partner op
- `GET /api/partners?tier={tier}` - Haal partners per tier op

### Photos
- `GET /api/photos` - Haal alle zichtbare fotos op
- `GET /api/photos/{id}` - Haal specifieke foto op
- `GET /api/photos?year={year}` - Haal fotos per jaar op

### Albums
- `GET /api/albums` - Haal alle zichtbare albums op
- `GET /api/albums/{id}` - Haal specifiek album op
- `GET /api/albums/{id}/photos` - Haal fotos van album op

### Social Links
- `GET /api/social-links` - Haal alle zichtbare social links op

### Program Schedule
- `GET /api/program-schedule` - Haal programma schema op
- `GET /api/program-schedule?category={category}` - Haal programma per categorie op

### Title Sections
- `GET /api/title-sections` - Haal titel sectie content op

### Social Embeds
- `GET /api/social-embeds` - Haal social media embeds op

### Email Services
- `POST /api/contact-email` - Verstuur contact email
- `POST /api/aanmelding-email` - Verstuur aanmeldings email

## Configuratie

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=dkl25_db

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5174

# Email Service
EMAIL_SERVICE_URL=https://dklemailservice.onrender.com
```

### Database Connection
```go
package main

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/lib/pq"
)

func connectDB() (*sql.DB, error) {
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_PORT"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
    )

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, err
    }

    if err = db.Ping(); err != nil {
        return nil, err
    }

    return db, nil
}
```

## Project Structuur

```
backend/
├── main.go                 # Hoofdapplicatie
├── handlers/               # HTTP handlers
│   ├── partners.go
│   ├── photos.go
│   ├── albums.go
│   ├── social.go
│   └── email.go
├── models/                 # Database modellen
│   ├── partner.go
│   ├── photo.go
│   ├── album.go
│   └── social.go
├── middleware/             # Middleware
│   ├── cors.go
│   └── logging.go
├── config/                 # Configuratie
│   └── database.go
└── utils/                  # Utilities
    ├── response.go
    └── validation.go
```

## Handler Voorbeeld

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
    "your-project/models"
)

func GetPartners(w http.ResponseWriter, r *http.Request) {
    partners, err := models.GetVisiblePartners()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(partners)
}

func GetPartnerByID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    partner, err := models.GetPartnerByID(id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if partner == nil {
        http.NotFound(w, r)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(partner)
}
```

## Model Voorbeeld

```go
package models

import (
    "database/sql"
    "your-project/config"
)

type Partner struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    Logo        *string `json:"logo"`
    Website     *string `json:"website"`
    Tier        string `json:"tier"`
    Since       string `json:"since"`
    Visible     bool   `json:"visible"`
    OrderNumber int    `json:"order_number"`
}

func GetVisiblePartners() ([]Partner, error) {
    rows, err := config.DB.Query(`
        SELECT id, name, logo, website, tier, since, visible, order_number
        FROM partners
        WHERE visible = true
        ORDER BY order_number ASC
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var partners []Partner
    for rows.Next() {
        var p Partner
        err := rows.Scan(&p.ID, &p.Name, &p.Logo, &p.Website, &p.Tier, &p.Since, &p.Visible, &p.OrderNumber)
        if err != nil {
            return nil, err
        }
        partners = append(partners, p)
    }

    return partners, nil
}
```

## Router Setup

```go
package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "your-project/handlers"
    "your-project/middleware"
)

func main() {
    r := mux.NewRouter()

    // Middleware
    r.Use(middleware.CORS)
    r.Use(middleware.Logging)

    // API routes
    api := r.PathPrefix("/api").Subrouter()

    // Partners
    api.HandleFunc("/partners", handlers.GetPartners).Methods("GET")
    api.HandleFunc("/partners/{id}", handlers.GetPartnerByID).Methods("GET")

    // Photos
    api.HandleFunc("/photos", handlers.GetPhotos).Methods("GET")
    api.HandleFunc("/photos/{id}", handlers.GetPhotoByID).Methods("GET")

    // Albums
    api.HandleFunc("/albums", handlers.GetAlbums).Methods("GET")
    api.HandleFunc("/albums/{id}", handlers.GetAlbumByID).Methods("GET")

    // Social
    api.HandleFunc("/social-links", handlers.GetSocialLinks).Methods("GET")
    api.HandleFunc("/social-embeds", handlers.GetSocialEmbeds).Methods("GET")

    // Program
    api.HandleFunc("/program-schedule", handlers.GetProgramSchedule).Methods("GET")

    // Title sections
    api.HandleFunc("/title-sections", handlers.GetTitleSections).Methods("GET")

    // Email services
    api.HandleFunc("/contact-email", handlers.SendContactEmail).Methods("POST")
    api.HandleFunc("/aanmelding-email", handlers.SendAanmeldingEmail).Methods("POST")

    log.Println("Server starting on :3001")
    log.Fatal(http.ListenAndServe(":3001", r))
}
```

## Deployment

### Development
```bash
go run main.go
```

### Production
```bash
go build -o dkl25-backend
./dkl25-backend
```

### Docker
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

## Testing

```bash
# Run tests
go test ./...

# Test specific endpoint
curl http://localhost:3001/api/partners

# Test with parameters
curl "http://localhost:3001/api/partners?tier=gold"
```

## Monitoring & Logging

- Gebruik structured logging voor alle requests
- Implementeer health check endpoint: `GET /health`
- Log errors naar externe service indien nodig
- Monitor database connection pool

## Security

- Input validatie voor alle endpoints
- SQL injection preventie via prepared statements
- CORS configuratie voor frontend domain
- Rate limiting voor email endpoints
- HTTPS in productie

## Performance

- Database connection pooling
- Query optimalisatie met indexes
- Caching voor statische data
- Gzip compressie voor responses
- Pagination voor grote datasets

---

---

## 📡 Frontend API Reference

### Base URL
```
https://your-domain.com/api
```

### Authentication
Admin endpoints vereisen JWT authenticatie:
```
Authorization: Bearer <your-jwt-token>
```

### Content Types
- Request: `application/json`
- Response: `application/json`

---

### 📸 Albums API

#### Get Visible Albums
```http
GET /api/albums
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Album Title",
    "description": "Album description",
    "cover_photo_id": "uuid",
    "visible": true,
    "order_number": 1,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

#### Admin Endpoints
```http
GET    /api/albums/admin?limit=10&offset=0
GET    /api/albums/{id}
POST   /api/albums
PUT    /api/albums/{id}
DELETE /api/albums/{id}
```

### 🎥 Videos API

#### Get Visible Videos
```http
GET /api/videos
```

**Response:**
```json
[
  {
    "id": "uuid",
    "video_id": "streamable_id",
    "url": "https://streamable.com/e/...",
    "title": "Video Title",
    "thumbnail_url": null,
    "visible": true,
    "order_number": 1
  }
]
```

#### Admin Endpoints
```http
GET    /api/videos/admin
POST   /api/videos
PUT    /api/videos/{id}
DELETE /api/videos/{id}
```

### 🤝 Sponsors API

#### Get Visible Sponsors
```http
GET /api/sponsors
```

#### Admin Endpoints
```http
GET    /api/sponsors/admin
POST   /api/sponsors
PUT    /api/sponsors/{id}
DELETE /api/sponsors/{id}
```

### 📅 Program Schedule API

#### Get Visible Schedule
```http
GET /api/program-schedule
```

#### Admin Endpoints
```http
GET    /api/program-schedule/admin
POST   /api/program-schedule
PUT    /api/program-schedule/{id}
DELETE /api/program-schedule/{id}
```

### 📱 Social Media APIs

#### Social Embeds
```http
GET    /api/social-embeds
GET    /api/social-embeds/admin
POST   /api/social-embeds
PUT    /api/social-embeds/{id}
DELETE /api/social-embeds/{id}
```

#### Social Links
```http
GET    /api/social-links
GET    /api/social-links/admin
POST   /api/social-links
PUT    /api/social-links/{id}
DELETE /api/social-links/{id}
```

---

## 🔐 Authentication & Authorization

### JWT Token Authenticatie

**Token Claims:**
```go
type JWTClaims struct {
    Email string `json:"email"`
    Role  string `json:"role"`
    jwt.RegisteredClaims
}
```

**Environment Variables:**
```bash
JWT_SECRET=your-secret-key-here
JWT_TOKEN_EXPIRY=20m
```

### Authentication Endpoints

```http
POST /api/auth/login           # Login
POST /api/auth/logout          # Logout
POST /api/auth/refresh         # Refresh token
GET  /api/auth/profile         # User profile
POST /api/auth/reset-password  # Reset password
```

### RBAC System

**Rollen:**
- `admin` - Volledige toegang
- `staff` - Beperkte admin toegang
- `user` - Basis toegang

**Permissions:**
- `read`, `create`, `update`, `delete`, `manage`

**Resources:**
- `users`, `roles`, `permissions`, `contacts`, `aanmeldingen`, `emails`, etc.

### Middleware

```go
// Auth verificatie
AuthMiddleware(authService)

// Admin rol check
AdminMiddleware(authService)

// Permission check
PermissionMiddleware(permissionService, "contacts", "manage")

// Rate limiting
RateLimitMiddleware(rateLimiter)
```

---

## 🏗️ System Components

### Services Layer

**EmailService:**
- Template-based email rendering
- Multi-SMTP configuratie
- Rate limiting
- Test mode support

**AuthService:**
- JWT token management
- Refresh token mechanisme
- Password hashing (bcrypt)
- User CRUD operations

**ChatService:**
- Real-time chat via WebSockets
- Channel management
- Message handling

**NotificationService:**
- Telegram notifications
- Priority levels
- Throttling

**PermissionService:**
- RBAC permission checks
- Redis caching (5 min TTL)
- User permissions

### Repository Layer

Data access layer met repository pattern:
- `GebruikerRepository`
- `ContactRepository`
- `AanmeldingRepository`
- `IncomingEmailRepository`
- `ChatChannelRepository`
- `PermissionRepository`
- `RoleRepository`

### WebSocket Hub

Real-time communicatie voor chat:
- Client registratie
- Broadcast berichten
- Connection management
- Concurrent-safe

---

## 💾 Database Schema

### Core Tables

**gebruikers:**
```sql
CREATE TABLE gebruikers (
    id UUID PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    wachtwoord_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'gebruiker',
    is_actief BOOLEAN DEFAULT true,
    newsletter_subscribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**contact_formulieren:**
```sql
CREATE TABLE contact_formulieren (
    id UUID PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bericht TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'nieuw',
    email_verzonden BOOLEAN DEFAULT false,
    test_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**aanmeldingen:**
```sql
CREATE TABLE aanmeldingen (
    id UUID PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefoon VARCHAR(20),
    rol VARCHAR(50) NOT NULL,
    afstand VARCHAR(20),
    ondersteuning TEXT,
    bijzonderheden TEXT,
    terms BOOLEAN NOT NULL,
    status VARCHAR(50) DEFAULT 'nieuw',
    test_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### RBAC Tables

**roles:**
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**permissions:**
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE(resource, action)
);
```

**user_roles:**
```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES gebruikers(id),
    role_id UUID REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);
```

### Chat Tables

**chat_channels:**
```sql
CREATE TABLE chat_channels (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('public', 'private', 'direct')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**chat_messages:**
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id),
    user_id UUID REFERENCES gebruikers(id),
    content TEXT,
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Environment Variables

**Database:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=dklemailservice
DB_SSL_MODE=require
```

**JWT:**
```bash
JWT_SECRET=your-secret-key
JWT_TOKEN_EXPIRY=20m
```

**Email:**
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=password
```

**Server:**
```bash
PORT=3001
CORS_ORIGIN=https://dekoninklijkeloop.nl
```

### Build & Run

**Development:**
```bash
go run main.go
```

**Production:**
```bash
go build -ldflags="-s -w" -o dklemailservice
./dklemailservice
```

**Docker:**
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

---

**Versie:** 2.0
**Laatste Update:** 2025-01-19
**Go Version:** 1.21+
**PostgreSQL Version:** 15+
**Status:** ✅ Production Ready
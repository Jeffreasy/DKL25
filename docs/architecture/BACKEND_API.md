# DKL25 Go Backend API Documentation

## Overzicht

Deze Go backend dient als API laag tussen de React frontend en PostgreSQL database voor de DKL25 website. Het vervangt Supabase en biedt directe toegang tot de database via RESTful endpoints.

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

**Laatste Update:** 2025-10-12
**Go Version:** 1.21+
**PostgreSQL Version:** 15+
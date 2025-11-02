# 🐳 Docker & Redis Integratie Strategie voor DKL25

**Versie:** 1.0  
**Datum:** November 2024  
**Status:** Implementatie Klaar  

---

## 📋 Inhoudsopgave

1. [Executive Summary](#-executive-summary)
2. [Docker Integratie](#-docker-integratie)
3. [Redis Integratie](#-redis-integratie)
4. [Deployment Strategieën](#-deployment-strategieën)
5. [Performance Optimalisaties](#-performance-optimalisaties)
6. [Monitoring & Maintenance](#-monitoring--maintenance)
7. [Migration Plan](#-migration-plan)

---

## 🎯 Executive Summary

### Waarom Docker?

**Huidige situatie:**
- Frontend: Vercel deployment (automatisch via Git)
- Backend: Render deployment (Go service)
- Database: Supabase (hosted PostgreSQL)
- Lokale development: Direct op host machine

**Voordelen Docker:**
- ✅ **Consistente environments** - Dev = Prod
- ✅ **Eenvoudige onboarding** - Developers kunnen snel starten
- ✅ **Geïsoleerde services** - Geen dependency conflicts
- ✅ **Eenvoudig schalen** - Container orchestration
- ✅ **Portabiliteit** - Overal draaien: local, cloud, on-premise

### Waarom Redis?

**Use Cases voor DKL25:**
- ✅ **API Response Caching** - 70-90% snellere response times
- ✅ **Session Management** - Snelle gebruikerssessies
- ✅ **Rate Limiting** - Bescherming tegen abuse
- ✅ **Database Query Cache** - Minder database load
- ✅ **Real-time Features** - Pub/Sub voor live updates
- ✅ **RBAC Caching** - Permissions cache (5 min TTL)

**Performance Impact (verwacht):**
- API endpoints: 50-80% sneller
- Database load: 40-60% reductie
- User experience: Instant responses voor cached data
- Kosten: Lagere database queries = lagere kosten

---

## 🐳 Docker Integratie

### Architectuur Overzicht

```
DKL25 Docker Setup
├── Frontend Container (React + Vite)
│   ├── Development: Hot reload
│   └── Production: Nginx serving static files
├── Backend Container (Go API)
│   ├── Development: Hot reload met Air
│   └── Production: Compiled binary
├── Redis Container
│   ├── Master node
│   └── Optional: Sentinel setup
└── Database (Supabase externe service)
    └── Connection via environment variables
```

### 1. Frontend Dockerfile (Multi-stage)

**Locatie:** [`Dockerfile`](../../Dockerfile)

```dockerfile
# ==============================================
# STAGE 1: Dependencies (Builder)
# ==============================================
FROM node:22-alpine AS deps

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# ==============================================
# STAGE 2: Build (Builder)
# ==============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_EMAIL_SERVICE_URL
ARG VITE_CLOUDINARY_CLOUD_NAME

# Set environment variables
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
ENV VITE_EMAIL_SERVICE_URL=$VITE_EMAIL_SERVICE_URL
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME

# Build application
RUN npm run build

# ==============================================
# STAGE 3: Production (Runner)
# ==============================================
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Backend Dockerfile (Go API)

**Locatie:** [`backend/Dockerfile`](../../backend/Dockerfile)

```dockerfile
# ==============================================
# STAGE 1: Build
# ==============================================
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git make build-base

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" \
    -o /app/dkl-api \
    ./cmd/api

# ==============================================
# STAGE 2: Production
# ==============================================
FROM alpine:latest AS runner

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/dkl-api .

# Copy config files if needed
COPY --from=builder /app/config ./config

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set ownership
RUN chown -R appuser:appgroup /root/

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start application
CMD ["./dkl-api"]
```

### 3. Development Dockerfile (Frontend)

**Locatie:** [`Dockerfile.dev`](../../Dockerfile.dev)

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 4. Nginx Configuration

**Locatie:** [`nginx.conf`](../../nginx.conf)

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache control
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   max;
        application/javascript     max;
        ~image/                    max;
        ~font/                     max;
    }

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        expires $expires;

        # Security
        server_tokens off;

        # SPA routing (React Router)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Static assets caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Disable .git access
        location ~ /\.git {
            deny all;
        }
    }
}
```

### 5. Docker Compose (Complete Setup)

**Locatie:** [`docker-compose.yml`](../../docker-compose.yml)

```yaml
version: '3.9'

services:
  # ==============================================
  # Frontend (React + Vite)
  # ==============================================
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
        VITE_GA_MEASUREMENT_ID: ${VITE_GA_MEASUREMENT_ID}
        VITE_EMAIL_SERVICE_URL: ${VITE_EMAIL_SERVICE_URL}
        VITE_CLOUDINARY_CLOUD_NAME: ${VITE_CLOUDINARY_CLOUD_NAME}
    container_name: dkl-frontend
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    networks:
      - dkl-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`dekoninklijkeloop.nl`)"

  # ==============================================
  # Frontend Development (Hot Reload)
  # ==============================================
  frontend-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: dkl-frontend-dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
      - VITE_EMAIL_SERVICE_URL=${VITE_EMAIL_SERVICE_URL}
      - VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME}
    networks:
      - dkl-network
    profiles:
      - dev

  # ==============================================
  # Backend (Go API)
  # ==============================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dkl-backend
    ports:
      - "3001:3001"
    environment:
      # Database
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_SSL_MODE=${DB_SSL_MODE:-require}
      
      # Redis
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - REDIS_DB=0
      
      # JWT
      - JWT_SECRET=${JWT_SECRET}
      - JWT_TOKEN_EXPIRY=${JWT_TOKEN_EXPIRY:-20m}
      
      # Email
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      
      # Server
      - PORT=3001
      - CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:5173}
    depends_on:
      redis:
        condition: service_healthy
    networks:
      - dkl-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ==============================================
  # Redis Cache
  # ==============================================
  redis:
    image: redis:7-alpine
    container_name: dkl-redis
    ports:
      - "6379:6379"
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --save 60 1
      --loglevel warning
    volumes:
      - redis-data:/data
    networks:
      - dkl-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  # ==============================================
  # Redis Commander (DevelopmentOnly)
  # ==============================================
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: dkl-redis-commander
    environment:
      - REDIS_HOSTS=local:redis:6379:0:${REDIS_PASSWORD}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - dkl-network
    profiles:
      - dev

# ==============================================
# Networks
# ==============================================
networks:
  dkl-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# ==============================================
# Volumes
# ==============================================
volumes:
  redis-data:
    driver: local
```

### 6. Docker Compose voor Development

**Locatie:** [`docker-compose.dev.yml`](../../docker-compose.dev.yml)

```yaml
version: '3.9'

services:
  frontend-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    networks:
      - dkl-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - dkl-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - dkl-network

networks:
  dkl-network:
    driver: bridge
```

### 7. .dockerignore

**Locatie:** [`.dockerignore`](../../.dockerignore)

```
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist
build
.next

# Environment files
.env
.env.local
.env.*.local

# Git
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Testing
coverage
.nyc_output

# Docs
docs
README.md
*.md

# Misc
.DS_Store
Thumbs.db
```

---

## 📦 Redis Integratie

### Architectuur & Strategy

```
Redis Use Cases in DKL25
├── 1. API Response Caching
│   ├── Partners list (TTL: 1 hour)
│   ├── Photos/Albums (TTL: 30 min)
│   ├── Program schedule (TTL: 2 hours)
│   └── Social media content (TTL: 15 min)
├── 2. Database Query Cache
│   ├── Frequently accessed queries
│   └── Expensive join operations
├── 3. Rate Limiting
│   ├── Contact form (5 requests/min)
│   ├── Registration form (3 requests/min)
│   └── API endpoints (100 requests/min)
├── 4. Session Management
│   ├── User sessions (TTL: 24 hours)
│   └── Admin sessions (TTL: 2 hours)
└── 5. RBAC Permissions Cache
    ├── User permissions (TTL: 5 min)
    └── Role hierarchies
```

### 1. Redis Client Setup (Go Backend)

**Locatie:** [`backend/lib/redis.go`](../../backend/lib/redis.go)

```go
package lib

import (
    "context"
    "encoding/json"
    "fmt"
    "time"

    "github.com/redis/go-redis/v9"
)

var (
    RedisClient *redis.Client
    ctx         = context.Background()
)

// RedisConfig holds Redis configuration
type RedisConfig struct {
    Host     string
    Port     string
    Password string
    DB       int
}

// InitRedis initializes Redis client
func InitRedis(config RedisConfig) error {
    RedisClient = redis.NewClient(&redis.Options{
        Addr:         fmt.Sprintf("%s:%s", config.Host, config.Port),
        Password:     config.Password,
        DB:           config.DB,
        DialTimeout:  5 * time.Second,
        ReadTimeout:  3 * time.Second,
        WriteTimeout: 3 * time.Second,
        PoolSize:     10,
        MinIdleConns: 5,
    })

    // Test connection
    _, err := RedisClient.Ping(ctx).Result()
    if err != nil {
        return fmt.Errorf("redis connection failed: %w", err)
    }

    fmt.Println("✅ Redis connected successfully")
    return nil
}

// CacheKey generates a consistent cache key
func CacheKey(prefix string, parts ...string) string {
    key := "dkl:" + prefix
    for _, part := range parts {
        key += ":" + part
    }
    return key
}

// SetCache stores data in Redis with TTL
func SetCache(key string, data interface{}, ttl time.Duration) error {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return fmt.Errorf("marshal error: %w", err)
    }

    return RedisClient.Set(ctx, key, jsonData, ttl).Err()
}

// GetCache retrieves data from Redis
func GetCache(key string, dest interface{}) error {
    data, err := RedisClient.Get(ctx, key).Result()
    if err == redis.Nil {
        return fmt.Errorf("cache miss")
    }
    if err != nil {
        return err
    }

    return json.Unmarshal([]byte(data), dest)
}

// DeleteCache removes cache entry
func DeleteCache(key string) error {
    return RedisClient.Del(ctx, key).Err()
}

// InvalidatePattern deletes all keys matching pattern
func InvalidatePattern(pattern string) error {
    iter := RedisClient.Scan(ctx, 0, pattern, 0).Iterator()
    for iter.Next(ctx) {
        if err := RedisClient.Del(ctx, iter.Val()).Err(); err != nil {
            return err
        }
    }
    return iter.Err()
}
```

### 2. Cache Middleware (Go)

**Locatie:** [`backend/middleware/cache.go`](../../backend/middleware/cache.go)

```go
package middleware

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "your-project/lib"
)

// CacheConfig holds cache configuration
type CacheConfig struct {
    TTL    time.Duration
    Prefix string
}

// CacheMiddleware provides HTTP response caching
func CacheMiddleware(config CacheConfig) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Only cache GET requests
            if r.Method != http.MethodGet {
                next.ServeHTTP(w, r)
                return
            }

            // Generate cache key
            cacheKey := lib.CacheKey(config.Prefix, r.URL.Path, r.URL.RawQuery)

            // Try to get from cache
            var cachedData map[string]interface{}
            err := lib.GetCache(cacheKey, &cachedData)
            if err == nil {
                // Cache hit
                w.Header().Set("Content-Type", "application/json")
                w.Header().Set("X-Cache", "HIT")
                json.NewEncoder(w).Encode(cachedData)
                return
            }

            // Cache miss - create response recorder
            rec := &ResponseRecorder{
                ResponseWriter: w,
                statusCode:     http.StatusOK,
                body:           []byte{},
            }

            // Call next handler
            next.ServeHTTP(rec, r)

            // Only cache successful responses
            if rec.statusCode == http.StatusOK {
                var responseData map[string]interface{}
                if err := json.Unmarshal(rec.body, &responseData); err == nil {
                    lib.SetCache(cacheKey, responseData, config.TTL)
                }
            }

            w.Header().Set("X-Cache", "MISS")
        })
    }
}

// ResponseRecorder records HTTP response
type ResponseRecorder struct {
    http.ResponseWriter
    statusCode int
    body       []byte
}

func (r *ResponseRecorder) Write(b []byte) (int, error) {
    r.body = append(r.body, b...)
    return r.ResponseWriter.Write(b)
}

func (r *ResponseRecorder) WriteHeader(statusCode int) {
    r.statusCode = statusCode
    r.ResponseWriter.WriteHeader(statusCode)
}
```

### 3. Rate Limiting Middleware

**Locatie:** [`backend/middleware/rate_limit.go`](../../backend/middleware/rate_limit.go)

```go
package middleware

import (
    "fmt"
    "net/http"
    "time"

    "your-project/lib"
)

// RateLimitConfig holds rate limit configuration
type RateLimitConfig struct {
    Requests int           // number of requests
    Window   time.Duration // time window
}

// RateLimitMiddleware provides rate limiting
func RateLimitMiddleware(config RateLimitConfig) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Get client IP
            clientIP := r.RemoteAddr

            // Create rate limit key
            key := lib.CacheKey("ratelimit", clientIP, r.URL.Path)

            // Increment counter
            count, err := lib.RedisClient.Incr(lib.ctx, key).Result()
            if err != nil {
                // If Redis fails, allow request
                next.ServeHTTP(w, r)
                return
            }

            // Set expiry on first request
            if count == 1 {
                lib.RedisClient.Expire(lib.ctx, key, config.Window)
            }

            // Check if limit exceeded
            if count > int64(config.Requests) {
                http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
                return
            }

            // Add rate limit headers
            w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", config.Requests))
            w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", config.Requests-int(count)))

            next.ServeHTTP(w, r)
        })
    }
}
```

### 4. Cached Repository Pattern

**Locatie:** [`backend/repositories/partner_repository.go`](../../backend/repositories/partner_repository.go)

```go
package repositories

import (
    "database/sql"
    "fmt"
    "time"

    "your-project/lib"
    "your-project/models"
)

type PartnerRepository struct {
    db *sql.DB
}

// GetVisiblePartners with caching
func (r *PartnerRepository) GetVisiblePartners() ([]models.Partner, error) {
    cacheKey := lib.CacheKey("partners", "visible")

    // Try cache first
    var partners []models.Partner
    err := lib.GetCache(cacheKey, &partners)
    if err == nil {
        return partners, nil
    }

    // Cache miss - query database
    rows, err := r.db.Query(`
        SELECT id, name, logo, website, tier, since, visible, order_number
        FROM partners
        WHERE visible = true
        ORDER BY order_number ASC
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    partners = []models.Partner{}
    for rows.Next() {
        var p models.Partner
        err := rows.Scan(&p.ID, &p.Name, &p.Logo, &p.Website, 
                        &p.Tier, &p.Since, &p.Visible, &p.OrderNumber)
        if err != nil {
            return nil, err
        }
        partners = append(partners, p)
    }

    // Cache the result (1 hour TTL)
    lib.SetCache(cacheKey, partners, 1*time.Hour)

    return partners, nil
}

// InvalidatePartnersCache clears partners cache
func (r *PartnerRepository) InvalidatePartnersCache() error {
    return lib.InvalidatePattern("dkl:partners:*")
}
```

### 5. Session Management

**Locatie:** [`backend/services/session_service.go`](../../backend/services/session_service.go)

```go
package services

import (
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "time"

    "your-project/lib"
)

type SessionService struct{}

type SessionData struct {
    UserID    string                 `json:"user_id"`
    Email     string                 `json:"email"`
    Role      string                 `json:"role"`
    ExpiresAt time.Time              `json:"expires_at"`
    Data      map[string]interface{} `json:"data"`
}

// CreateSession creates a new session
func (s *SessionService) CreateSession(userID, email, role string, ttl time.Duration) (string, error) {
    // Generate session ID
    sessionID, err := generateSessionID()
    if err != nil {
        return "", err
    }

    // Create session data
    session := SessionData{
        UserID:    userID,
        Email:     email,
        Role:      role,
        ExpiresAt: time.Now().Add(ttl),
        Data:      make(map[string]interface{}),
    }

    // Store in Redis
    key := lib.CacheKey("session", sessionID)
    if err := lib.SetCache(key, session, ttl); err != nil {
        return "", err
    }

    return sessionID, nil
}

// GetSession retrieves session data
func (s *SessionService) GetSession(sessionID string) (*SessionData, error) {
    key := lib.CacheKey("session", sessionID)
    
    var session SessionData
    if err := lib.GetCache(key, &session); err != nil {
        return nil, fmt.Errorf("session not found")
    }

    // Check if expired
    if time.Now().After(session.ExpiresAt) {
        s.DestroySession(sessionID)
        return nil, fmt.Errorf("session expired")
    }

    return &session, nil
}

// DestroySession deletes a session
func (s *SessionService) DestroySession(sessionID string) error {
    key := lib.CacheKey("session", sessionID)
    return lib.DeleteCache(key)
}

// Helper: Generate secure session ID
func generateSessionID() (string, error) {
    b := make([]byte, 32)
    if _, err := rand.Read(b); err != nil {
        return "", err
    }
    return base64.URLEncoding.EncodeToString(b), nil
}
```

### 6. RBAC Permission Caching

**Locatie:** [`backend/services/permission_service.go`](../../backend/services/permission_service.go)

```go
package services

import (
    "fmt"
    "time"

    "your-project/lib"
    "your-project/repositories"
)

type PermissionService struct {
    permRepo *repositories.PermissionRepository
}

// HasPermission checks if user has permission (with caching)
func (s *PermissionService) HasPermission(userID, resource, action string) (bool, error) {
    // Check cache first
    cacheKey := lib.CacheKey("permission", userID, resource, action)
    
    var hasPermission bool
    err := lib.GetCache(cacheKey, &hasPermission)
    if err == nil {
        return hasPermission, nil
    }

    // Cache miss - check database
    hasPermission, err = s.permRepo.UserHasPermission(userID, resource, action)
    if err != nil {
        return false, err
    }

    // Cache result (5 minute TTL)
    lib.SetCache(cacheKey, hasPermission, 5*time.Minute)

    return hasPermission, nil
}

// InvalidateUserPermissions clears user permission cache
func (s *PermissionService) InvalidateUserPermissions(userID string) error {
    pattern := fmt.Sprintf("dkl:permission:%s:*", userID)
    return lib.InvalidatePattern(pattern)
}
```

---

## 🚀 Deployment Strategieën

### Optie 1: Docker op Bestaande Infrastructure

**Behoud Vercel + Render, gebruik Docker lokaal:**

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production build testing
docker-compose up --build

# Vercel blijft automatisch deployen via Git
# Render blijft backend hosten
```

**Voordelen:**
- ✅ Minimale wijzigingen in productie
- ✅ Verbeterde lokale development
- ✅ Consistent tussen developers

### Optie 2: Volledige Docker Deployment

**Nieuwe stack met Docker + Redis:**

```yaml
# Production docker-compose.prod.yml
version: '3.9'

services:
  frontend:
    image: dkl-frontend:latest
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
    
  backend:
    image: dkl-backend:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    
  redis:
    image: redis:7-alpine
    deploy:
      replicas: 1
      placement:
        constraints: [node.role == manager]

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### Optie 3: Hybrid (Aanbevolen)

**Docker lokaal, bestaande productie, Redis toegevoegd:**

```
Development: Docker Compose (frontend + backend + redis)
           ↓
Testing:    Docker containers
           ↓
Staging:    Vercel Preview + Render + Redis Cloud
           ↓
Production: Vercel + Render + Redis Cloud (Upstash)
```

---

## ⚡ Performance Optimalisaties

### Redis Caching Strategy

```go
// Cache warmup - pre-populate cache
func WarmupCache() {
    // Partners
    partnersRepo.GetVisiblePartners()
    
    // Photos
    photosRepo.GetVisiblePhotos()
    
    // Program
    programRepo.GetSchedule()
    
    // Social
    socialRepo.GetSocialLinks()
}

// Cache invalidation on updates
func (h *PartnerHandler) UpdatePartner(w http.ResponseWriter, r *http.Request) {
    // Update database
    err := h.repo.Update(partner)
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    
    // Invalidate cache
    h.repo.InvalidatePartnersCache()
    
    w.WriteHeader(http.StatusOK)
}
```

### Expected Performance Improvements

| Metric | Voor Redis | Met Redis | Improvement |
|--------|------------|-----------|-------------|
| **API Response Time** | 200-500ms | 5-20ms | **90-95%** |
| **Database Queries** | 100/min | 20/min | **80%** |
| **Server Load** | Hoog | Laag | **60-70%** |
| **Concurrent Users** | 100 | 500+ | **5x** |

---

## 📊 Monitoring & Maintenance

### Redis Monitoring Commands

```bash
# Connect to Redis
docker exec -it dkl-redis redis-cli -a YOUR_PASSWORD

# Monitor real-time commands
MONITOR

# Get info
INFO stats
INFO memory

# Check keys
KEYS dkl:*
DBSIZE

# Memory usage
MEMORY USAGE dkl:partners:visible

# Clear all cache
FLUSHDB
```

### Health Checks

```go
// Health check endpoint
func HealthCheck(w http.ResponseWriter, r *http.Request) {
    health := map[string]interface{}{
        "status": "healthy",
        "checks": map[string]bool{
            "database": checkDatabase(),
            "redis":    checkRedis(),
        },
    }
    
    json.NewEncoder(w).Encode(health)
}

func checkRedis() bool {
    _, err := lib.RedisClient.Ping(lib.ctx).Result()
    return err == nil
}
```

---

## 🔄 Migration Plan

### Fase 1: Setup (Week 1)

✅ **Taak 1.1:** Docker configuratie maken
- [ ] Maak Dockerfiles (frontend, backend)
- [ ] Maak docker-compose.yml
- [ ] Maak nginx.conf
- [ ] Test lokaal

✅ **Taak 1.2:** Redis setup
- [ ] Voeg Redis toe aan docker-compose
- [ ] Configureer Redis client in backend
- [ ] Test Redis connectivity

### Fase 2: Implementatie (Week 2-3)

✅ **Taak 2.1:** Basis caching
- [ ] Implementeer cache middleware
- [ ] Cache partners endpoint
- [ ] Cache photos endpoint
- [ ] Cache program endpoint

✅ **Taak 2.2:** Rate limiting
- [ ] Implementeer rate limit middleware
- [ ] Beveilig contact form
- [ ] Beveilig registration form

✅ **Taak 2.3:** Session management
- [ ] Implementeer session service
- [ ] Migreer bestaande sessions

### Fase 3: Testing (Week 4)

✅ **Taak 3.1:** Performance testing
- [ ] Load testing (k6, Apache Bench)
- [ ] Measure response times
- [ ] Measure cache hit rates

✅ **Taak 3.2:** Integration testing
- [ ] Test all endpoints
- [ ] Test cache invalidation
- [ ] Test rate limiting

### Fase 4: Deployment (Week 5)

✅ **Taak 4.1:** Production setup
- [ ] Setup Redis Cloud (Upstash)
- [ ] Configure environment variables
- [ ] Deploy backend updates

✅ **Taak 4.2:** Monitoring
- [ ] Setup Redis monitoring
- [ ] Setup alerts
- [ ] Document procedures

### Fase 5: Optimization (Week 6+)

✅ **Taak 5.1:** Fine-tuning
- [ ] Optimize TTL values
- [ ] Optimize cache keys
- [ ] Implement cache warming

✅ **Taak 5.2:** Advanced features
- [ ] Redis Pub/Sub (optioneel)
- [ ] Redis Streams (optioneel)
- [ ] Advanced rate limiting

---

## 📝 Quick Start Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start with Redis Commander
docker-compose --profile dev up

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

### Production

```bash
# Build images
docker-compose build

# Start production
docker-compose up -d

# View stats
docker stats

# Scale services
docker-compose up -d --scale backend=3
```

### Redis Operations

```bash
# Connect to Redis CLI
docker exec -it dkl-redis redis-cli -a PASSWORD

# Flush cache
redis-cli -a PASSWORD FLUSHDB

# Monitor cache
redis-cli -a PASSWORD MONITOR

# Get cache stats
redis-cli -a PASSWORD INFO stats
```

---

## 🎯 Conclusie

### Waarom Dit Implementeren?

1. **Development Verbetering:**
   - Consistente environments
   - Eenvoudige onboarding
   - Parallelle ontwikkeling

2. **Performance Boost:**
   - 90%+ snellere API responses
   - 80% minder database load
   - 5x meer concurrent users

3. **Schaalbaarheid:**
   - Eenvoudig horizontaal schalen
   - Load balancing ready
   - Cloud-agnostic

4. **Kosten Besparing:**
   - Minder database queries
   - Lagere hosting kosten
   - Efficiënter resource gebruik

### Next Steps

1. **Week 1:** Setup lokale Docker environment
2. **Week 2-3:** Implementeer Redis caching
3. **Week 4:** Uitgebreid testen
4. **Week 5:** Production deployment
5. **Week 6+:** Optimalisatie en monitoring

**De implementatie is volledig backwards compatible - je kunt stapsgewijs migreren!** 🚀

---

**Versie:** 1.0  
**Auteur:** DKL Development Team  
**Contact:** info@dekoninklijkeloop.nl  
**Status:** ✅ Ready for Implementation
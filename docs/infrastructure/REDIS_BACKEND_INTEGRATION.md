# 📦 Redis Integratie voor Bestaande Backend

**Voor:** DKL25 Go Backend (Render deployment)  
**Datum:** November 2024  
**Status:** Integration Guide

---

## 🎯 Overzicht

Deze guide laat zien hoe je Redis caching kunt toevoegen aan je **bestaande DKL25 Go backend** die momenteel op Render draait.

**Belangrijke noten:**
- ✅ Je bestaande backend blijft volledig functioneel
- ✅ Redis is een **additionele optimalisatie layer**
- ✅ Backwards compatible - geen breaking changes
- ✅ Stapsgewijze implementatie mogelijk

---

## 📋 Wat Je Hebt (Huidige Setup)

```
Bestaande Backend:
├── Go API op Render (dklemailservice.onrender.com)
├── PostgreSQL database (Supabase)
├── Email service (SMTP)
├── JWT authenticatie
└── RESTful endpoints
```

**Endpoints (zoals gedocumenteerd in [`BACKEND_API.md`](../architecture/BACKEND_API.md)):**
- GET /api/partners
- GET /api/photos
- GET /api/albums
- GET /api/program-schedule
- GET /api/social-links
- POST /api/contact-email
- POST /api/aanmelding-email

---

## 🚀 Wat Redis Toevoegt

### Performance Boost
- **API Response Time:** 200-500ms → 5-20ms (90-95% sneller)
- **Database Queries:** 100/min → 20/min (80% reductie)
- **Concurrent Users:** 100 → 500+ (5x meer)

### Use Cases
1. **Response Caching** - Cache GET endpoint responses
2. **Rate Limiting** - Bescherm tegen abuse
3. **Session Storage** - Snelle session management
4. **Permission Caching** - RBAC permissions cache

---

## 📦 Stap-voor-Stap Implementatie

### Stap 1: Voeg Redis Dependency Toe

**In je bestaande `go.mod`:**

```go
module github.com/your-org/dkl-backend

go 1.21

require (
    // Je bestaande dependencies...
    github.com/gorilla/mux v1.8.1
    github.com/lib/pq v1.10.9
    
    // Voeg Redis toe:
    github.com/redis/go-redis/v9 v9.3.0
)
```

**Run:**
```bash
go mod tidy
```

### Stap 2: Kopieer Redis Library

**Kopieer het bestand:** [`../../backend/lib/redis.go`](../../backend/lib/redis.go)

**Naar jouw backend project:**
```
your-backend/
└── lib/
    └── redis.go  # ← Deze file
```

**Of maak het zelf:**
```go
// lib/redis.go
package lib

import (
    "context"
    "encoding/json"
    "fmt"
    "os"
    "time"

    "github.com/redis/go-redis/v9"
)

var (
    RedisClient *redis.Client
    ctx         = context.Background()
)

func InitRedisFromEnv() error {
    RedisClient = redis.NewClient(&redis.Options{
        Addr:     os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
        Password: os.Getenv("REDIS_PASSWORD"),
        DB:       0,
    })

    _, err := RedisClient.Ping(ctx).Result()
    return err
}

// Zie backend/lib/redis.go voor complete implementatie
```

### Stap 3: Update Main.go

**In je bestaande `main.go`, voeg toe:**

```go
import (
    "your-backend/lib"
)

func main() {
    // Initialiseer Redis (na godotenv.Load())
    if err := lib.InitRedisFromEnv(); err != nil {
        log.Printf("⚠️  Redis failed: %v. Continuing without cache...", err)
    } else {
        log.Println("✅ Redis connected")
    }
    defer lib.CloseRedis()

    // Je bestaande code...
}
```

### Stap 4: Voeg Cache Middleware Toe (Optioneel)

**Kopieer:** [`../../backend/middleware/cache.go`](../../backend/middleware/cache.go)

**Gebruik in je routes:**

```go
// Voor partners endpoint (1 uur cache)
partnersRouter := api.PathPrefix("/partners").Subrouter()
partnersRouter.Use(middleware.CacheMiddleware(middleware.CacheConfig{
    TTL:    1 * time.Hour,
    Prefix: "partners",
}))
partnersRouter.HandleFunc("", yourExistingGetPartnersHandler).Methods("GET")
```

### Stap 5: Environment Variabelen

**Voeg toe aan je `.env`:**

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

---

## 🌐 Redis Hosting Opties

### Optie 1: Upstash (Aanbevolen voor Render)

**Waarom Upstash:**
- ✅ Serverless Redis (pay-per-request)
- ✅ Global edge caching
- ✅ Free tier: 10,000 requests/day
- ✅ Perfecte integratie met Render

**Setup:**
1. Maak account op https://upstash.com
2. Maak nieuwe Redis database
3. Kopieer credentials naar Render environment variables

```env
REDIS_HOST=your-cluster.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password
```

### Optie 2: Redis Cloud

**Setup:**
1. https://redis.com/try-free/
2. Maak cluster
3. Configureer environment variables

### Optie 3: Render Redis Add-on

**Setup:**
1. In Render dashboard → Add Redis instance
2. Link aan je backend service
3. Environment variables worden automatisch toegevoegd

---

## 💡 Minimale Implementatie (Quick Win)

Als je snel wilt starten met minimale code changes:

### 1. Voeg alleen Redis client toe

```go
// In je main.go
import "github.com/redis/go-redis/v9"

var redisClient *redis.Client

func init() {
    redisClient = redis.NewClient(&redis.Options{
        Addr: os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
        Password: os.Getenv("REDIS_PASSWORD"),
    })
}
```

### 2. Cache één veelgebruikt endpoint

```go
func GetPartners(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    cacheKey := "dkl:partners:all"
    
    // Try cache
    cached, err := redisClient.Get(ctx, cacheKey).Result()
    if err == nil {
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("X-Cache", "HIT")
        w.Write([]byte(cached))
        return
    }
    
    // Cache miss - query database
    partners := queryPartnersFromDB() // Je bestaande query
    
    // Cache result (1 uur)
    jsonData, _ := json.Marshal(partners)
    redisClient.Set(ctx, cacheKey, jsonData, 1*time.Hour)
    
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("X-Cache", "MISS")
    json.NewEncoder(w).Encode(partners)
}
```

**Resultaat:** Direct 90%+ snellere responses voor dit endpoint!

---

## 🔄 Deployment op Render

### Optie A: Upstash (Geen Render Changes Nodig)

1. **Setup Upstash Redis**
2. **Voeg environment variables toe in Render:**
   ```
   REDIS_HOST=xxx.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=xxx
   ```
3. **Deploy je backend updates**

### Optie B: Render Redis Instance

1. **In Render Dashboard:**
   - Create New → Redis
   - Select plan (free tier beschikbaar)
   - Link aan backend service

2. **Environment variables worden automatisch toegevoegd**

3. **Deploy backend updates**

---

## 📊 Monitoring

### Redis Stats Endpoint

**Voeg toe aan je backend:**

```go
func RedisStats(w http.ResponseWriter, r *http.Request) {
    stats := map[string]interface{}{
        "connected": redisClient.Ping(ctx).Err() == nil,
    }
    
    if info, err := redisClient.Info(ctx, "stats").Result(); err == nil {
        stats["info"] = info
    }
    
    json.NewEncoder(w).Encode(stats)
}
```

**Access:** `GET /api/redis/stats`

### Upstash Dashboard

- Real-time metrics
- Request count
- Cache hit ratio
- Response times

---

## 🎯 Recommended Implementation Plan

### Week 1: Setup & Test
1. ✅ Setup Upstash Redis account
2. ✅ Kopieer `backend/lib/redis.go`
3. ✅ Update `main.go` met Redis init
4. ✅ Test lokaal met Docker Redis
5. ✅ Deploy naar Render met Upstash

### Week 2: Basic Caching
1. ✅ Cache partners endpoint (1 uur)
2. ✅ Cache photos endpoint (30 min)
3. ✅ Cache program endpoint (2 uur)
4. ✅ Monitor cache hit ratio
5. ✅ Tune TTL values

### Week 3: Advanced Features
1. ⏭️ Add rate limiting (optioneel)
2. ⏭️ Add session caching (optioneel)
3. ⏭️ Add permission caching (optioneel)

---

## 💼 Code Examples (Voor Jouw Backend)

### Example 1: Simple Endpoint Caching

```go
import (
    "context"
    "encoding/json"
    "time"
)

func GetPartnersWithCache(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    cacheKey := "dkl:partners:visible"
    
    // Try cache first
    var partners []Partner
    if cached, err := redisClient.Get(ctx, cacheKey).Bytes(); err == nil {
        json.Unmarshal(cached, &partners)
        w.Header().Set("X-Cache", "HIT")
        json.NewEncoder(w).Encode(partners)
        return
    }
    
    // Query database (je bestaande logic)
    rows, err := db.Query(`
        SELECT id, name, logo, website, tier, since 
        FROM partners 
        WHERE visible = true
        ORDER BY order_number
    `)
    // ... scan results into partners
    
    // Cache for 1 hour
    jsonData, _ := json.Marshal(partners)
    redisClient.Set(ctx, cacheKey, jsonData, 1*time.Hour)
    
    w.Header().Set("X-Cache", "MISS")
    json.NewEncoder(w).Encode(partners)
}
```

### Example 2: Rate Limiting Contact Form

```go
func SendContactEmailWithRateLimit(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    clientIP := r.RemoteAddr
    rateLimitKey := fmt.Sprintf("dkl:ratelimit:contact:%s", clientIP)
    
    // Increment counter
    count, _ := redisClient.Incr(ctx, rateLimitKey).Result()
    
    // Set expiry on first request (1 minute window)
    if count == 1 {
        redisClient.Expire(ctx, rateLimitKey, 1*time.Minute)
    }
    
    // Check limit (5 requests per minute)
    if count > 5 {
        http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
        return
    }
    
    // Je bestaande email logic...
    sendEmail(...)
}
```

---

## 🔗 Handige Resources

### Onze Code Templates
- Redis Client: [`../../backend/lib/redis.go`](../../backend/lib/redis.go)
- Cache Middleware: [`../../backend/middleware/cache.go`](../../backend/middleware/cache.go)
- Rate Limit Middleware: [`../../backend/middleware/rate_limit.go`](../../backend/middleware/rate_limit.go)

### External Resources
- [Redis Go Client Docs](https://redis.uptrace.dev/)
- [Upstash Documentation](https://docs.upstash.com/redis)
- [Render Redis Guide](https://render.com/docs/redis)

---

## ❓ FAQ

**Q: Moet ik mijn hele backend herschrijven?**  
A: Nee! Je kunt Redis incrementeel toevoegen endpoint-per-endpoint.

**Q: Wat gebeurt er als Redis down is?**  
A: De backend blijft werken, maar zonder caching - het valt terug op direct database queries.

**Q: Kost Redis extra?**  
A: Upstash free tier is voldoende voor development. Production: ~$10-20/maand voor enterprise features.

**Q: Kan ik Redis lokaal testen?**  
A: Ja! Gebruik Docker: `docker run -d -p 6379:6379 redis:7-alpine`

**Q: Hoe invalideer ik de cache?**  
A: Bij updates/deletes, gebruik `redisClient.Del()` om cache keys te verwijderen.

---

## 🎯 Conclusie

Redis toevoegen aan je bestaande backend is:
- ✅ **Eenvoudig:** Minimale code changes
- ✅ **Veilig:** Backwards compatible
- ✅ **Krachtig:** 90%+ performance verbetering
- ✅ **Flexibel:** Stapsgewijze implementatie

**Begin klein, meet resultaten, scale op!** 🚀

---

**Questions?** Open een issue op GitHub of contacteer het development team.
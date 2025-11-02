# 📦 Backend Code Templates

**Let op:** Dit zijn **CODE TEMPLATES** voor gebruik in je eigen backend repository!

**Je eigen backend draait al op:** https://dklemailservice.onrender.com

---

## ✅ Wat Zit Hier (Bruikbare Templates)

### [`lib/redis.go`](lib/redis.go) - Redis Client Library ⭐ KOPIEER DIT

**Wat het doet:**
- Redis connection management
- Caching utilities (get/set/delete)
- Counter operations (voor rate limiting)
- Pattern matching (cache invalidation)
- Health checks

**Hoe te gebruiken:**
1. Kopieer dit bestand naar je eigen backend repo
2. Update import paths naar je eigen module
3. Gebruik in je handlers

**Functies:**
```go
InitRedisFromEnv()              // Initialize Redis
CacheKey(prefix, parts...)      // Generate keys
SetCache(key, data, ttl)        // Store with TTL
GetCache(key, &dest)            // Retrieve data
DeleteCache(key)                // Remove key
InvalidatePattern(pattern)      // Clear by pattern
Increment(key)                  // Counters
Ping()                          // Health check
```

### [`middleware/cache.go`](middleware/cache.go) - HTTP Caching ⭐ KOPIEER DIT

**Wat het doet:**
- Automatic response caching voor GET requests
- Smart TTL detection per endpoint
- Cache invalidation bij updates
- Cache control headers

**Hoe te gebruiken:**
```go
import "your-backend/middleware"

// In je router
partnersRouter.Use(middleware.CacheMiddleware(middleware.CacheConfig{
    TTL:    1 * time.Hour,
    Prefix: "partners",
}))

// Of smart caching (auto-detect TTL)
router.Use(middleware.SmartCacheMiddleware())
```

### [`middleware/rate_limit.go`](middleware/rate_limit.go) - Rate Limiting ⭐ KOPIEER DIT

**Wat het doet:**
- IP-based rate limiting
- User-based rate limiting
- Sliding window algorithm
- Token bucket (burst limiting)

**Hoe te gebruiken:**
```go
import "your-backend/middleware"

// Simple IP rate limiting (5 req/min)
contactRouter.Use(middleware.IPRateLimiter(5, 1*time.Minute))

// Burst limiting (allow bursts)
router.Use(middleware.BurstRateLimiter(10, 2, 30*time.Second))
```

---

## 📖 Hoe Dit Te Gebruiken

### Stap 1: Setup Redis

**Render Redis Add-on:**
1. Render Dashboard → New + → Redis
2. Region: Oregon (zelfde als je database)
3. Plan: Starter ($7/mo)
4. Link aan je backend service

**Environment variables worden automatisch toegevoegd:**
```
REDIS_URL=redis://...
```

### Stap 2: Kopieer Code naar Je Backend

**In je eigen backend repository:**

```bash
# Kopieer de libraries
cp DKL25/backend/lib/redis.go your-backend/lib/
cp DKL25/backend/middleware/cache.go your-backend/middleware/
cp DKL25/backend/middleware/rate_limit.go your-backend/middleware/
```

**Update imports:**
```go
// In redis.go, cache.go, rate_limit.go
// Van: github.com/jeffreasy/dkl25/backend/lib
// Naar: your-backend-module/lib
```

### Stap 3: Update Dependencies

**In je `go.mod`:**
```go
require github.com/redis/go-redis/v9 v9.3.0
```

```bash
go mod tidy
```

### Stap 4: Initialize in Main

**In je `main.go`:**
```go
import "your-backend/lib"

func main() {
    // Load environment
    godotenv.Load()
    
    // Initialize Redis
    if err := lib.InitRedisFromEnv(); err != nil {
        log.Println("⚠️ Redis disabled:", err)
    } else {
        log.Println("✅ Redis connected")
    }
    defer lib.CloseRedis()
    
    // Je normale code...
}
```

### Stap 5: Gebruik in Handlers

**Example - Cache een endpoint:**
```go
func GetPartners(w http.ResponseWriter, r *http.Request) {
    cacheKey := "dkl:partners:visible"
    
    // Try cache
    var partners []Partner
    if lib.RedisClient != nil {
        if err := lib.GetCache(cacheKey, &partners); err == nil {
            w.Header().Set("X-Cache", "HIT")
            json.NewEncoder(w).Encode(partners)
            return
        }
    }
    
    // Query database (je bestaande code)
    partners = queryPartnersFromDB()
    
    // Cache result
    if lib.RedisClient != nil {
        lib.SetCache(cacheKey, partners, 1*time.Hour)
    }
    
    w.Header().Set("X-Cache", "MISS")
    json.NewEncoder(w).Encode(partners)
}
```

---

## 📚 Complete Documentatie

**Voor Render-specifieke setup:**
→ [`../RENDER_REDIS_SETUP_GUIDE.md`](../RENDER_REDIS_SETUP_GUIDE.md)

**Voor complete integration guide:**
→ [`../docs/infrastructure/REDIS_BACKEND_INTEGRATION.md`](../docs/infrastructure/REDIS_BACKEND_INTEGRATION.md)

**Voor alle details:**
→ [`../docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md`](../docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md)

---

## ⚠️ Belangrijke Notities

1. **Dit is NIET je productie backend** - Je backend draait op Render
2. **Dit zijn CODE TEMPLATES** - Kopieer naar je eigen backend
3. **De lib/ en middleware/ zijn bruikbaar** - Direct te gebruiken
4. **Update de import paths** - Naar je eigen module naam

---

## 📊 Wat Zit Waar

```
backend/
├── README.md              # Dit bestand - uitleg
├── lib/
│   └── redis.go          # ✅ BRUIKBAAR - Redis client library
└── middleware/
    ├── cache.go          # ✅ BRUIKBAAR - HTTP caching
    └── rate_limit.go     # ✅ BRUIKBAAR - Rate limiting
```

**Alles hier is bedoeld om te kopiëren naar je eigen backend!**

---

**Questions?** Zie [`RENDER_REDIS_SETUP_GUIDE.md`](../RENDER_REDIS_SETUP_GUIDE.md) voor stap-voor-stap instructies specifiek voor jouw Render setup.
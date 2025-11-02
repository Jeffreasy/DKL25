# ⚡ Redis Quick Start - DKL25

**Voor:** Je Render Backend (dklemailservice.onrender.com)  
**Tijd:** 30 minuten  
**Impact:** 90% snellere API

---

## 🎯 Jouw Situatie

**Productie Setup:**
- ✅ Frontend: Vercel (dekoninklijkeloop.nl)
- ✅ Backend: Render (dklemailservice.onrender.com)
- ✅ Database: Render PostgreSQL (Oregon)

**Wat je gaat toevoegen:**
- 🆕 Redis Cache: Render Redis (Oregon - zelfde regio!)

---

## 🚀 Stap-voor-Stap (30 Minuten Totaal)

### Stap 1: Maak Render Redis Instance (10 min)

**In Render Dashboard:**

1. Klik **"New +"** → **"Redis"**

2. **Configuratie:**
   ```
   Name:     dkl-redis
   Region:   Oregon (USA West) ← BELANGRIJK: Zelfde als database!
   Plan:     Starter ($7/month) of Free voor testen
   Memory:   256 MB (genoeg voor cache)
   ```

3. Klik **"Create Redis"**

4. **Wacht tot deployed** (1-2 minuten)

5. **Kopieer Connection Details:**
   - REDIS_HOST (bijv. `red-xxx.oregon-redis.render.com`)
   - REDIS_PORT (6379)
   - REDIS_PASSWORD (wordt gegenereerd)

### Stap 2: Link Redis aan Backend Service (5 min)

**In Render Dashboard:**

1. Ga naar je **backend service** (dklemailservice)

2. **Environment tab**

3. **Add environment variables:**
   ```
   REDIS_HOST=red-xxx.oregon-redis.render.com
   REDIS_PORT=6379
   REDIS_PASSWORD=generated_password_from_redis
   REDIS_DB=0
   ```

4. Klik **"Save Changes"**

**Render zal je service automatisch herstarten!**

### Stap 3: Update Backend Code (15 min)

**In je backend repository (lokaal):**

**3.1. Voeg Redis dependency toe:**

In `go.mod`:
```go
require github.com/redis/go-redis/v9 v9.3.0
```

Terminal:
```bash
go mod tidy
```

**3.2. Kopieer Redis Library:**

Kopieer [`backend/lib/redis.go`](backend/lib/redis.go) van DKL25 repo naar je backend.

**3.3. Update Main.go:**

```go
import "your-backend/lib"

func main() {
    // Na godotenv.Load() of environment setup
    
    // Initialize Redis
    log.Println("🔌 Connecting to Redis...")
    if err := lib.InitRedisFromEnv(); err != nil {
        log.Printf("⚠️  Redis connection failed: %v", err)
        log.Println("⚠️  Continuing without Redis caching...")
    } else {
        log.Println("✅ Redis connected successfully")
    }
    
    // Cleanup bij shutdown
    defer func() {
        if lib.RedisClient != nil {
            lib.CloseRedis()
        }
    }()
    
    // Rest van je code...
    // Je routers, handlers, etc.
}
```

**3.4. Cache één endpoint (test):**

Kies je meest gebruikte endpoint (bijv. partners). Update de handler:

```go
func GetPartners(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    cacheKey := "dkl:partners:visible"
    
    // Probeer cache eerst
    if lib.RedisClient != nil {
        var partners []Partner
        if err := lib.GetCache(cacheKey, &partners); err == nil {
            // Cache HIT!
            w.Header().Set("Content-Type", "application/json")
            w.Header().Set("X-Cache", "HIT")
            w.Header().Set("X-Cache-TTL", "3600")
            json.NewEncoder(w).Encode(partners)
            return
        }
    }
    
    // Cache miss of Redis niet beschikbaar - query database
    // JE BESTAANDE DATABASE QUERY HIER:
    partners := queryPartnersFromDatabase() // Je eigen functie
    
    // Cache het resultaat (1 uur)
    if lib.RedisClient != nil {
        lib.SetCache(cacheKey, partners, 1*time.Hour)
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("X-Cache", "MISS")
    json.NewEncoder(w).Encode(partners)
}
```

**3.5. Commit en Push:**

```bash
git add .
git commit -m "Add Redis caching for partners endpoint"
git push origin main
```

**Render auto-deploys!** (2-3 minuten)

---

## ✅ Test het Resultaat

### Browser DevTools Test

1. **Open je site:** https://dekoninklijkeloop.nl

2. **Open DevTools** (F12) → Network tab

3. **Refresh de pagina**

4. **Bekijk Partners API call:**
   - Eerste keer: Header `X-Cache: MISS` (~250ms response)
   - Tweede keer: Header `X-Cache: HIT` (~10ms response!)

**Als je `X-Cache: HIT` ziet en het is super snel = SUCCESS!** 🎉

### Render Logs Test

**In Render Dashboard:**

1. Ga naar je backend service
2. **Logs tab**
3. Zoek naar:
   ```
   ✅ Redis connected successfully
   ```

**Dit betekent Redis werkt!**

---

## 📈 Verwachte Resultaten

### Voor Partners Endpoint

| Metric | Voor Redis | Met Redis | Verbetering |
|--------|------------|-----------|-------------|
| **Response Time** | 250ms | 10ms | **96% sneller** |
| **DB Queries** | Elke request | 1x per uur | **99% minder** |
| **Server Load** | Hoog | Laag | **60% lager** |

### Voor je Database

**Oregon PostgreSQL:**
- Connections: 90% → 30% gebruikt
- Queries: 100/min → 20/min
- CPU: 60% → 20%

**Mogelijk downgrade database plan = geld besparen!**

---

## 🔄 Volgende Stappen

### Week 1 (Nu)
- ✅ Cache partners endpoint
- ✅ Meet resultaten
- ✅ Verifieer cache werkt

### Week 2
- ✅ Cache photos endpoint (30 min TTL)
- ✅ Cache albums endpoint (30 min TTL)
- ✅ Cache program endpoint (2 uur TTL)

### Week 3
- ✅ Add rate limiting op forms (optioneel)
- ✅ Monitor cache hit ratio
- ✅ Optimize TTL values

---

## 🆘 Troubleshooting

### Redis Connection Failed

**Check:**
1. REDIS_HOST, REDIS_PORT, REDIS_PASSWORD correct in Render?
2. Redis instance deployed en running?
3. Beide services in zelfde region (Oregon)?

**Fix:**
- Herstart backend service in Render
- Check Redis logs in Render dashboard

### Cache Niet Werkend

**Check:**
1. Browser DevTools → geen `X-Cache` header?
2. Render logs → "Redis connected"?
3. Code correct geüpdate?

**Debug:**
```go
// In je handler, log dit:
log.Printf("RedisClient is nil: %v", lib.RedisClient == nil)
log.Printf("Cache key: %s", cacheKey)
```

### Performance Niet Beter

**Check:**
1. Is cache wel HITting? Check `X-Cache` header
2. Test meerdere keren (eerste keer is altijd MISS)
3. Check Render logs voor errors

---

## 💰 Kosten Breakdown

### Render Redis Starter ($7/mo)
- 256 MB memory
- 100 connections
- Managed service
- Same datacenter

**ROI Berekening:**
- Database usage: -80% = mogelijk goedkoper database plan
- Better user experience = meer conversies
- Faster site = better SEO = meer bezoekers

**Verdient zichzelf dubbel terug!**

---

## 📚 Meer Info

**Render-specifieke setup:**
→ [`RENDER_REDIS_SETUP_GUIDE.md`](RENDER_REDIS_SETUP_GUIDE.md)

**Code templates:**
→ [`backend/README.md`](backend/README.md)

**Complete guide:**
→ [`docs/infrastructure/REDIS_BACKEND_INTEGRATION.md`](docs/infrastructure/REDIS_BACKEND_INTEGRATION.md)

---

## 🎯 TL;DR

1. **Render Dashboard:** Create Redis (10 min)
2. **Link aan backend:** Add env vars (5 min)
3. **Update code:** Add library + cache 1 endpoint (15 min)
4. **Deploy:** git push (automatic)
5. **Test:** Check X-Cache header

**30 minuten werk = 90% sneller! START NU!** 🚀

---

**Contact:** info@dekoninklijkeloop.nl  
**Status:** ✅ Ready to Implement
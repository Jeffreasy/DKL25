# 🔧 Total Steps Endpoint - Echte Data Fix

## Het Probleem

```
"Aantal Huidige Deelnemers: 69" ← Demo data

Reden: GET /api/total-steps?year=2025 → 401 Unauthorized
```

De frontend kan geen echte data ophalen want het endpoint vereist authenticatie.

---

## ✅ OPLOSSING 1: Backend Endpoint Public Maken (BESTE)

### Backend Fix (5 minuten)

**Locatie:** Backend `main.go` of `routes/...`

**VOOR (current - wrong):**
```go
// Endpoint requires authentication
protected := api.Group("/", AuthMiddleware(authService))
protected.Get("/total-steps", statsHandler.GetTotalSteps)
```

**NA (correct - should be):**
```go
// Public endpoint - no authentication required
api.Get("/total-steps", statsHandler.GetTotalSteps)
```

**Waarom Public:**
- Total steps is public informatie
- Wordt getoond op public website
- Geen gevoelige data
- Iedereen mag dit zien

**Na backend fix:**
→ Frontend haalt automatisch echte data op  
→ Demo data (69) wordt vervangen door echte count  
→ Geen frontend changes nodig

---

## ✅ OPLOSSING 2: Frontend Authenticated Request (Alternative)

Als het endpoint MOET authenticated blijven, kan de frontend een service account gebruiken.

**Niet aanbevolen want:**
- Public site moet public data krijgen
- Service account credentials in frontend = security risk
- Endpoint moet gewoon public zijn

---

## 🧪 Verificatie Na Backend Fix

### Test Backend Endpoint
```bash
# Should work WITHOUT authentication
curl https://dklemailservice.onrender.com/api/total-steps?year=2025

# Expected response:
{
  "total_steps": 95327,
  "participant_count": 142,
  "year": 2025
}

# NOT: 401 Unauthorized
```

### Test Frontend
1. Rebuild production (npm run build)
2. Redeploy
3. Open site
4. Check "Aantal Huidige Deelnemers"
5. Should show REAL number (not 69)

---

## 📝 Backend Checklist

### In Backend main.go or routes:

```go
// ✅ DO THIS:
// Public endpoints (no auth)
api.Get("/partners", partnerHandler.GetPartners)
api.Get("/sponsors", sponsorHandler.GetSponsors)
api.Get("/photos", photoHandler.GetPhotos)
api.Get("/total-steps", statsHandler.GetTotalSteps)  ← ADD THIS

// Protected endpoints (with auth)
protected := api.Group("/", AuthMiddleware(authService))
protected.Get("/admin/dashboard", adminHandler.Dashboard)
protected.Post("/contacts", contactHandler.Create)
```

### Verify Middleware
```go
// Make sure total-steps endpoint has NO middleware:
app.Get("/api/total-steps", func(c *fiber.Ctx) error {
    year := c.QueryInt("year", time.Now().Year())
    
    // Get real count from database
    count, err := repo.GetParticipantCount(year)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Database error"})
    }
    
    return c.JSON(fiber.Map{
        "total_steps": count.TotalSteps,
        "participant_count": count.ParticipantCount,
        "year": year,
    })
})
```

---

## 🎯 Summary

**Issue:** Total steps endpoint requires auth (401)  
**Impact:** Frontend shows demo data (69)  
**Fix:** Backend moet endpoint public maken  
**Time:** 5 minuten backend change  
**Result:** Echte participant data op website  

**Frontend is ready! Backend moet alleen dit ene endpoint public maken.** 🚀
# 🚨 CORS Fix Required - Backend Configuration

> **Issue:** CORS policy blocking requests from localhost:5174  
> **Impact:** Frontend kan niet communiceren met backend in development  
> **Severity:** 🔴 Critical (blocks all testing)  
> **Solution:** Update backend CORS configuration

---

## 🐛 Problem

De app start succesvol maar alle API calls worden geblokkeerd door CORS:

```
Access to fetch at 'https://dklemailservice.onrender.com/api/partners'
from origin 'http://localhost:5174' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Affected Endpoints
- ❌ `/api/under-construction/active`
- ❌ `/api/partners`
- ❌ `/api/program`
- ❌ `/api/total-steps`
- ❌ Alle andere API endpoints

### What Works
- ✅ App initializes zonder crashes
- ✅ AuthContext en PermissionContext laden correct
- ✅ No import errors
- ✅ UI renders correct
- ✅ Frontend code is correct

### What Doesn't Work
- ❌ API calls worden geblokkeerd door CORS
- ❌ Geen data kan worden geladen
- ❌ Partners sectie toont error: "Er ging iets mis bij het ophalen van de partners"

---

## 🔧 Solution: Update Backend CORS

### Locatie
**Backend File:** `main.go` of `config/cors.go`

### Current CORS Config (vermoedelijk)
```go
app.Use(cors.New(cors.Config{
    AllowOrigins: []string{
        "https://admin.dekoninklijkeloop.nl",
        "https://dekoninklijkeloop.nl",
    },
    AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
    AllowCredentials: true,
}))
```

### Required Fix
```go
app.Use(cors.New(cors.Config{
    AllowOrigins: []string{
        "https://admin.dekoninklijkeloop.nl",
        "https://dekoninklijkeloop.nl",
        "http://localhost:5173",  // ← ADD THIS
        "http://localhost:5174",  // ← ADD THIS
        "http://localhost:3000",  // ← ADD THIS (common dev port)
    },
    AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    AllowHeaders: []string{
        "Origin",
        "Content-Type", 
        "Accept",
        "Authorization",
        "X-Requested-With",
    },
    AllowCredentials: true,
    MaxAge: 12 * 3600, // 12 hour cache for preflight
}))
```

### Environment-Based Solution (Beste Optie)
```go
// Get CORS origins from environment variable
corsOrigins := []string{
    "https://admin.dekoninklijkeloop.nl",
    "https://dekoninklijkeloop.nl",
}

// Add development origins if in development mode
if os.Getenv("ENVIRONMENT") == "development" {
    corsOrigins = append(corsOrigins,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    )
}

app.Use(cors.New(cors.Config{
    AllowOrigins:     corsOrigins,
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
    AllowCredentials: true,
    MaxAge:           12 * 3600,
}))
```

---

## 🚀 Alternative: Development Proxy (Quick Fix)

Als je de backend niet direct kunt aanpassen, gebruik dan een proxy in Vite:

### Update `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dklemailservice.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
```

### Update `.env`
```env
# Use relative URL for proxy
VITE_API_BASE_URL=
```

### Update `apiClient.ts` (tijdelijk)
```typescript
// DEVELOPMENT ONLY: Use relative URL for proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
```

**Nadelen:**
- Alleen voor development
- Production moet nog steeds CORS fixed hebben
- Token refresh werkt mogelijk niet correct via proxy

---

## 📋 Testing Checklist

Na CORS fix:

### 1. Verify CORS Headers
```bash
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://dklemailservice.onrender.com/api/partners \
     -v

# Should return:
# Access-Control-Allow-Origin: http://localhost:5174
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### 2. Test API Calls
Open browser console en run:
```javascript
fetch('https://dklemailservice.onrender.com/api/partners')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Should return: Array of partners (not CORS error)
```

### 3. Restart Frontend
```bash
# Stop dev server (Ctrl+C)
npm run dev

# Open http://localhost:5174
# Should now load partners/program/etc without errors
```

---

## 💡 Why This Happens

CORS (Cross-Origin Resource Sharing) is een security feature van browsers:

1. **Frontend:** http://localhost:5174 (origin A)
2. **Backend:** https://dklemailservice.onrender.com (origin B)
3. **Browser:** "These are different origins, I need permission"
4. **Backend:** Must send `Access-Control-Allow-Origin: http://localhost:5174`
5. **Browser:** "OK, request allowed"

Zonder correcte CORS headers, blokkeert de browser alle requests.

### Development vs Production

**Development:**
- Frontend: http://localhost:5174
- Backend: https://dklemailservice.onrender.com
- **Different origins** → CORS needed

**Production:**
- Frontend: https://dekoninklijkeloop.nl
- Backend: https://dklemailservice.onrender.com
- **Different origins** → CORS needed

**Same Origin (geen CORS):**
- Frontend: https://api.dekoninklijkeloop.nl/app
- Backend: https://api.dekoninklijkeloop.nl/api
- **Same origin** → No CORS needed

---

## 🎯 Recommended Actions

### Optie 1: Fix Backend CORS (BESTE)
1. Update backend CORS config
2. Add localhost:5173, localhost:5174, localhost:3000
3. Deploy backend
4. Test frontend
5. **ETA:** 10 minuten

### Optie 2: Use Vite Proxy (QUICK FIX)
1. Add proxy config to vite.config.ts
2. Update .env to use relative URLs
3. Restart dev server
4. Test frontend
5. **ETA:** 5 minuten
6. **Note:** Production still needs CORS fix

### Optie 3: Run Backend Locally
1. Clone backend repo
2. Run `go run main.go`
3. Update .env: `VITE_API_BASE_URL=http://localhost:8080`
4. No CORS issues on localhost
5. **ETA:** 15 minuten

---

## 📊 Impact Analysis

### Current State
```
Frontend:  ✅ Running (http://localhost:5174)
Backend:   ✅ Running (https://dklemailservice.onrender.com)
Connection: ❌ BLOCKED by CORS
Data:       ❌ Cannot load
Auth:       ⏳ Cannot test (API blocked)
```

### After Fix
```
Frontend:  ✅ Running (http://localhost:5174)
Backend:   ✅ Running (https://dklemailservice.onrender.com)
Connection: ✅ ALLOWED by CORS
Data:       ✅ Loads successfully
Auth:       ✅ Can be tested
```

---

## 🔍 Verification

Na de CORS fix, zou je dit moeten zien in de browser console:

### VOOR (Nu)
```
❌ Access to fetch at 'https://dklemailservice.onrender.com/api/partners' 
   from origin 'http://localhost:5174' has been blocked by CORS policy
```

### NA (Na Fix)
```
✅ Fetching partners from backend...
✅ Partners loaded: [...]
✅ No CORS errors
```

### Network Tab
**VOOR:**
```
Request URL: https://dklemailservice.onrender.com/api/partners
Status: (failed) net::ERR_FAILED
```

**NA:**
```
Request URL: https://dklemailservice.onrender.com/api/partners
Status: 200 OK
Response: [...partner data...]
Headers: Access-Control-Allow-Origin: http://localhost:5174
```

---

## 📞 Next Steps

1. **Contact backend team** of fix CORS config zelf
2. **Add localhost origins** to AllowOrigins
3. **Deploy backend** update
4. **Restart frontend** dev server
5. **Test again** - partners should load

---

**Status:** 🔴 BLOCKED - CORS fix required in backend  
**Priority:** HIGH - Blocks all frontend testing  
**ETA for Fix:** 10-15 minuten  
**Alternative:** Use Vite proxy (5 min quick fix)
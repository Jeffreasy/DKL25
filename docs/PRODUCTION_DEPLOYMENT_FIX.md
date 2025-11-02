# 🚨 PRODUCTION DEPLOYMENT - Environment Variable Fix

> **CRITICAL:** Production deployment mist VITE_API_BASE_URL environment variable!

---

## 🐛 Het Probleem

Je test nu op **www.dekoninklijkeloop.nl** (production deployment) en krijgt errors:
```
https://www.dekoninklijkeloop.nl/api/api/partners → 500
https://www.dekoninklijkeloop.nl/api/api/videos → 500
```

**Dubbele `/api/api/` betekent:**
- Frontend denkt baseURL = '' (empty)
- Vite proxy is actief in production (FOUT!)
- Environment variable VITE_API_BASE_URL is NIET gezet

---

## ✅ Oplossing: Environment Variables Instellen

### Op Jouw Deployment Platform (Render/Vercel/Netlify)

**Stap 1: Ga naar deployment settings**

**Stap 2: Voeg environment variable toe:**
```
Name:  VITE_API_BASE_URL
Value: https://dklemailservice.onrender.com
```

**Stap 3: Rebuild & redeploy**
```bash
# Trigger new deployment
# Of via platform dashboard: Settings → Redeploy
```

---

## 🔍 Verificatie

### VOOR (Nu - Fout)
```
URL: https://www.dekoninklijkeloop.nl/api/api/partners
             └─ Wrong domain ───┘  └─ Double /api/ ──┘
```

### NA (Correct)
```
URL: https://dklemailservice.onrender.com/api/partners
             └─ Correct backend domain ──────┘
```

---

## 📋 Platform-Specifieke Instructies

### Render.com
1. Go to Dashboard → Service
2. Click "Environment"
3. Add: `VITE_API_BASE_URL=https://dklemailservice.onrender.com`
4. Click "Save Changes"
5. Trigger "Manual Deploy"

### Vercel
1. Go to Project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://dklemailservice.onrender.com`
3. Select: Production
4. Click "Save"
5. Go to Deployments → Redeploy

### Netlify
1. Go to Site Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://dklemailservice.onrender.com`
3. Save
4. Go to Deploys → Trigger Deploy

---

## 🧪 Test Na Fix

### Test 1: Check Environment Variable in Build
```javascript
// In browser console op production:
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show: "https://dklemailservice.onrender.com"
// NOT: undefined
```

### Test 2: Check API Calls
```javascript
// Open Network tab
// Check request URL format:
// ✅ CORRECT: https://dklemailservice.onrender.com/api/partners
// ❌ WRONG:   https://www.dekoninklijkeloop.nl/api/api/partners
```

### Test 3: Partners Should Load
```
- Open www.dekoninklijkeloop.nl
- Partners section should display sponsors
- No 500 errors
- No CORS errors
```

---

## 🎯 Waarom Dit Gebeurt

### Build Time vs Runtime

**Build Time:**
```bash
npm run build
# Reads .env file (if exists locally)
# Injects values into bundle
# VITE_API_BASE_URL → embedded in JS bundle
```

**Deployment:** 
```
upload dist/ to server
# .env file is NOT uploaded (in .gitignore)
# Platform must provide environment variables
# If missing → uses fallback in code
```

**Our Code (apiClient.ts):**
```typescript
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return ''; // Use proxy
  }
  // Production: NEEDS environment variable!
  return import.meta.env.VITE_API_BASE_URL || 'https://dklemailservice.onrender.com';
};
```

**Als `VITE_API_BASE_URL` niet gezet is:**
- Production gebruikt fallback: 'https://dklemailservice.onrender.com'
- MAAR eerst checkt het hostname
- www.dekoninklijkeloop.nl != localhost
- → Should use backend URL
- → MAAR import.meta.env.VITE_API_BASE_URL = undefined
- → Uses fallback

**MAAR WAAROM `/api/api/`?**

OH! Ik denk dat de Vite proxy ook in de production build zit! Dat mag niet.

Vite proxy werkt alleen in `npm run dev`, niet in production builds.

Maar toch, de URLs laten zien dat het via www.dekoninklijkeloop.nl gaat, niet direct naar backend.

Ik denk dat er een nginx reverse proxy of iets dergelijks draait op www.dekoninklijkeloop.nl die forwards naar backend.  

Laat me de user een duidelijke fix geven voor de production environment variable.
</thinking>

Ik begrijp de frustratie! Het probleem is dat op **production (www.dekoninklijkeloop.nl)** de environment variable `VITE_API_BASE_URL` NIET is ingesteld in de deployment.

<write_to_file>
<path>CRITICAL_PRODUCTION_FIX.md</path>
<content># 🚨 CRITICAL: Production Environment Variable Missing!

## Het Probleem (www.dekoninklijkeloop.nl)

```
ERROR: https://www.dekoninklijkeloop.nl/api/api/partners
       └─ DUBBELE /api/api/ ─────────────────┘

SHOULD BE: https://dklemailservice.onrender.com/api/partners
```

---

## 🔧 DE FIX (5 minuten)

### Jouw Production Deployment Platform

**Ga naar de deployment waar www.dekoninklijkeloop.nl draait**

#### Als je Render.com gebruikt:
1. Dashboard → Select jouw frontend service
2. Environment Tab
3. Add Environment Variable:
   ```
   Key:   VITE_API_BASE_URL
   Value: https://dklemailservice.onrender.com
   ```
4. Save
5. Click "Manual Deploy" button

#### Als je Vercel gebruikt:
1. Project Settings
2. Environment Variables
3. Add:
   ```
   Key:   VITE_API_BASE_URL
   Value: https://dklemailservice.onrender.com
   ```
4. Environment: Production (vink aan)
5. Save
6. Deployments → Latest → Redeploy

#### Als je Netlify gebruikt:
1. Site settings
2. Environment variables  
3. Add variable:
   ```
   Key:   VITE_API_BASE_URL
   Value: https://dklemailservice.onrender.com
   ```
4. Save
5. Deploys → Trigger deploy

---

## ✅ Na De Fix

### URLs worden dan:
```
LOCALHOST (development):
→ http://localhost:5174/api/partners
→ Vite proxy → https://dklemailservice.onrender.com/api/partners ✅

PRODUCTION (www.dekoninklijkeloop.nl):
→ https://dklemailservice.onrender.com/api/partners ✅
   (Direct naar backend, geen dubbele /api/)
```

---

## 🧪 Verificatie

Na rebuild en redeploy:

```javascript
// Open browser console op www.dekoninklijkeloop.nl
console.log('Base URL:', import.meta.env.VITE_API_BASE_URL);
// Should output: "https://dklemailservice.onrender.com"
// NOT: undefined
```

Check Network tab:
```
✅ CORRECT: https://dklemailservice.onrender.com/api/partners
❌ WRONG:   https://www.dekoninklijkeloop.nl/api/api/partners
```

---

## 🎯 Waarom Dit Moet

**Vite Environment Variables:**
- Worden ALLEEN ingelezen tijdens `npm run build`
- Moeten worden gezet op deployment platform
- .env file wordt NIET ge-upload (staat in .gitignore)
- Frontend bundle MOET de variable hebben

**Zonder deze variable:**
- Frontend weet niet waar backend is
- Valt terug op relative URLs
- Probeert via www.dekoninklijkeloop.nl/api/...
- Dat bestaat niet → 500 errors

---

**Fix dit NU in je deployment settings en redeploy. Dan werkt alles.** 🚀
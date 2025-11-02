# 🚀 Deployment Guide - Backend Migratie

> **Status:** Ready for Testing & Deployment  
> **Datum:** 2025-11-02  
> **Implementatie:** 75% Complete

---

## ✅ Wat is Klaar (13 Files Geïmplementeerd + 4 Ge-update)

### Core Infrastructure ✅
1. [`src/types/auth.ts`](../src/types/auth.ts) - Auth types & interfaces
2. [`src/services/auth/tokenManager.ts`](../src/services/auth/tokenManager.ts) - Token management met auto-refresh
3. [`src/services/api/apiClient.ts`](../src/services/api/apiClient.ts) - Axios client met JWT interceptors
4. [`src/services/api/endpoints.ts`](../src/services/api/endpoints.ts) - Centralized endpoints
5. [`src/services/api/dataService.ts`](../src/services/api/dataService.ts) - Generic CRUD factory
6. [`src/services/auth/authService.ts`](../src/services/auth/authService.ts) - Auth operations
7. [`src/services/email/emailService.ts`](../src/services/email/emailService.ts) - Backend email service

### React Layer ✅
8. [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx) - JWT authentication context
9. [`src/contexts/PermissionContext.tsx`](../src/contexts/PermissionContext.tsx) - RBAC permissions
10. [`src/components/auth/ProtectedRoute.tsx`](../src/components/auth/ProtectedRoute.tsx) - Route guards
11. [`src/components/auth/RequirePermission.tsx`](../src/components/auth/RequirePermission.tsx) - Component guards

### Migrated Services ✅
12. [`src/features/partners/services/partnerService.ts`](../src/features/partners/services/partnerService.ts) - ✅ Gemigreerd naar backend
13. [`src/utils/emailService.ts`](../src/utils/emailService.ts) - ✅ Gemigreerd naar backend

### Updated Files ✅
14. [`src/App.tsx`](../src/App.tsx) - ✅ Wrapped met AuthProvider + PermissionProvider
15. [`src/pages/Aanmelden/components/FormContainer.tsx`](../src/pages/Aanmelden/components/FormContainer.tsx) - ✅ Gebruikt backend API
16. [`package.json`](../package.json) - ✅ Axios dependency toegevoegd
17. [`.env.example`](../.env.example) - ✅ Backend config toegevoegd
18. [`src/types/base.ts`](../src/types/base.ts) - ✅ QueryOptions extended

---

## 🚀 Deployment Stappen

### Stap 1: Install Dependencies
```bash
npm install
```

Dit installeert axios (^1.6.5) die nu in package.json staat.

### Stap 2: Environment Variables

Creëer `.env` file (als die nog niet bestaat):
```bash
# Backend API
VITE_API_BASE_URL=https://dklemailservice.onrender.com

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=

# Environment
VITE_ENVIRONMENT=production
```

Voor development:
```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### Stap 3: Build & Test

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run preview
```

### Stap 4: Verificatie Checklist

Open de app en test:

#### Authentication Flow
- [ ] Open de app (AuthContext initialiseert automatisch)
- [ ] Geen errors in console over missing tokens
- [ ] App laadt zonder crashes

#### Data Fetching
- [ ] Partners worden geladen via backend API
- [ ] Network tab toont requests naar `dklemailservice.onrender.com`
- [ ] Geen Supabase calls meer

#### Form Submission
- [ ] Ga naar aanmelden pagina
- [ ] Vul formulier in
- [ ] Submit werkt via backend API
- [ ] Bevestigingsmail wordt verstuurd via backend

#### Email
- [ ] Contact formulier werkt via backend
- [ ] Email notificaties werken

---

## 🔄 Overige Services Te Migreren

**Nog te doen (optioneel):** Deze services gebruiken mogelijk nog oude patterns:

### 1. Sponsors Service
**File:** `src/features/sponsors/services/...` (als bestaat)

**Pattern:**
```typescript
import { createDataService } from '../../../services/api/dataService';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

const service = createDataService(API_ENDPOINTS.sponsors);

export const sponsorService = {
  fetchVisible: () => service.fetchVisible(),
  fetchAll: () => service.fetchAll({ sortBy: 'order_number', sortOrder: 'asc' }),
  // etc.
};
```

### 2. Photos Service
**File:** `src/features/gallery/services/...` (als bestaat)

**Pattern:**
```typescript
import { createDataService } from '../../../services/api/dataService';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

const service = createDataService(API_ENDPOINTS.photos);
```

### 3. Videos Service
**Pattern:** Zelfde als Photos

### 4. Albums Service  
**Pattern:** Zelfde als Photos

### Quick Migration Command
Voor elk bestand dat `supabase.from()` gebruikt:

```bash
# Zoek alle bestanden
grep -r "supabase.from" src/

# Of in Windows PowerShell
Get-ChildItem -Path src -Recurse -Filter *.ts* | Select-String "supabase.from"
```

Vervang dan:
```typescript
// OLD:
const { data } = await supabase.from('table_name').select('*');

// NEW:
import { createDataService } from '@/services/api/dataService';
const service = createDataService('/api/endpoint');
const data = await service.fetchAll();
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### 1. **Page Load Test**
```
✓ Open homepage
✓ Check console - no errors
✓ Check Network tab - requests go to backend
✓ App renders correctly
```

#### 2. **Partners Test**
```
✓ Navigate to partners section
✓ Partners load successfully
✓ Images display correctly
✓ No Supabase requests in Network tab
```

#### 3. **Registration Test**
```
✓ Navigate to /aanmelden
✓ Fill out form
✓ Submit form
✓ Check Network - POST to /api/aanmeldingen
✓ Verify confirmation email sent
✓ No errors in console
```

#### 4. **Contact Form Test**
```
✓ Navigate to contact section
✓ Fill out form
✓ Submit form
✓ Check Network - POST to /api/contact-email
✓ Success message shows
```

#### 5. **Performance Test**
```
✓ Check page load time
✓ Check API response times
✓ No console warnings
✓ No memory leaks
```

### Automated Testing (Optional)

**Test File:** `tests/backend-migration.test.ts`

```typescript
import { apiClient } from '@/services/api/apiClient';
import { authService } from '@/services/auth/authService';
import { emailService } from '@/services/email/emailService';

describe('Backend Migration', () => {
  test('API Client initializes correctly', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.getBaseURL()).toBe(process.env.VITE_API_BASE_URL);
  });

  test('Auth service methods exist', () => {
    expect(authService.login).toBeDefined();
    expect(authService.logout).toBeDefined();
    expect(authService.getProfile).toBeDefined();
  });

  test('Email service methods exist', () => {
    expect(emailService.sendContactEmail).toBeDefined();
    expect(emailService.sendRegistrationEmail).toBeDefined();
  });
});
```

Run tests:
```bash
npm test
```

---

## 🐛 Troubleshooting

### Issue: "Module not found: axios"
**Solution:**
```bash
npm install
```

### Issue: "VITE_API_BASE_URL is undefined"
**Solution:**
1. Check `.env` file exists
2. Restart dev server: `npm run dev`
3. Verify variable format: `VITE_API_BASE_URL=https://...`

### Issue: "Network error" in browser
**Solution:**
1. Check backend is running: `https://dklemailservice.onrender.com/api/health`
2. Check CORS settings in backend
3. Check network connectivity

### Issue: "Token expired" immediately
**Solution:**
1. Check JWT_SECRET matches between frontend & backend
2. Check system time is correct
3. Clear localStorage: `localStorage.clear()`

### Issue: Forms not submitting
**Solution:**
1. Check console for errors
2. Check Network tab for failed requests
3. Verify backend endpoint exists
4. Check CORS configuration

### Issue: TypeScript errors
**Solution:**
```bash
# Type check
npm run type-check

# Common fix: Regenerate types
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 Performance Monitoring

### Key Metrics to Track

1. **API Response Times:**
   - Login: < 500ms
   - Data fetch: < 2s
   - Form submit: < 1s

2. **Token Management:**
   - Auto-refresh works at 15 min
   - No token refresh loops
   - No unnecessary API calls

3. **Error Rates:**
   - 401 errors handled automatically
   - 403 errors logged properly
   - Network errors show user-friendly messages

### Browser Dev Tools Monitoring

**Network Tab:**
```
✓ All requests have Authorization header
✓ Failed requests retry with new token
✓ No Supabase requests
```

**Console:**
```
✓ No error messages
✓ Auth logs show successful initialization
✓ Token refresh logs (every 15 min)
```

**Application Tab (localStorage):**
```
✓ dkl_access_token exists
✓ dkl_refresh_token exists
✓ dkl_user exists with valid JSON
```

---

## 🔐 Security Checklist

### Pre-Deployment
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] No secrets in frontend code
- [ ] Environment variables properly set
- [ ] HTTPS enforced in production
- [ ] CORS properly configured

### Post-Deployment
- [ ] Test with expired tokens
- [ ] Test with invalid tokens
- [ ] Test permission boundaries
- [ ] Test rate limiting
- [ ] Monitor for auth failures

---

## 📋 Rollback Plan

Als er kritieke issues zijn na deployment:

### Quick Rollback (Emergency)
```bash
# Revert to previous deployment
git revert HEAD
git push

# Or use platform rollback
# Render: Dashboard → Deployments → Rollback
# Vercel: Dashboard → Deployments → Promote to Production
```

### Partial Rollback (Keep New Code)

Tijdelijk Supabase weer inschakelen:

1. **Re-add Supabase env vars** in production:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2. **Code zit al in fallback mode**, herstart app

3. **Fix issues** in development

4. **Re-deploy** when ready

---

## ✅ Definition of Done

Backend migratie is **100% compleet** wanneer:

### Technical
- [x] Alle nieuwe services geïmplementeerd
- [x] Auth context geïntegreerd
- [x] Protected routes werken
- [x] Partners service gemigreerd
- [x] Aanmelden form gemigreerd
- [x] Email service gemigreerd
- [ ] Alle services gemigreerd (sponsors, photos, videos)
- [ ] Supabase dependencies verwijderd
- [ ] Geen console errors
- [ ] Alle tests slagen

### Functional
- [ ] Login/logout werkt
- [ ] Token refresh werkt automatisch
- [ ] Forms submitten correct
- [ ] Emails worden verstuurd
- [ ] Data wordt correct geladen
- [ ] Permission checks werken

### Performance
- [ ] Page load < 3s
- [ ] API calls < 2s
- [ ] No memory leaks
- [ ] Cache hit rate > 90%

---

## 🎯 Next Actions

### IMMEDIATE (Nu)
1. **Run npm install**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with correct values
   ```

3. **Test in development**
   ```bash
   npm run dev
   ```

4. **Open app en verifieer:**
   - No console errors
   - Partners load
   - Forms work
   - Emails send

### SHORT TERM (Deze Week)
1. Migreer overige services (sponsors, photos, videos)
2. Volledige test alle functionaliteit
3. Deploy naar staging
4. Integration testing
5. Deploy naar production

### MEDIUM TERM (Volgende Week)
1. Monitor error logs (24-48 uur)
2. Performance testing
3. User acceptance testing
4. Remove Supabase dependencies
5. Clean up old code
6. Update documentation

---

## 📞 Support

**Vragen over implementatie:**
- Check [`docs/BACKEND_MIGRATION_PLAN.md`](./BACKEND_MIGRATION_PLAN.md)
- Check [`docs/BACKEND_MIGRATION_IMPLEMENTATION_STATUS.md`](./BACKEND_MIGRATION_IMPLEMENTATION_STATUS.md)

**Backend API vragen:**
- Check [`docs/AUTH_AND_RBAC.md`](./AUTH_AND_RBAC.md)
- Backend repo & documentation

**Deployment issues:**
- Check platform logs (Render/Vercel)
- Check browser console
- Check Network tab

---

**Status:** 🟢 Ready for Testing  
**Next Step:** `npm install` → Test in development  
**Estimated Time to Complete:** 2-3 uur voor testing & finishing touches
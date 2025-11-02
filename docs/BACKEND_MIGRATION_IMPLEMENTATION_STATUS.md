# 🚀 Backend Migratie - Implementatie Status

> **Status:** Fase 1-3 Complete ✅ | Ready for Integration Testing  
> **Datum:** 2025-11-02  
> **Voortgang:** 60% Complete

---

## ✅ Wat is Geïmplementeerd (Fase 1-3)

### 📦 Core Infrastructuur

#### 1. Type Definitions
- ✅ **`src/types/auth.ts`** (75 lines)
  - LoginCredentials, LoginResponse, User
  - Permission, Role interfaces
  - JWTClaims, storage keys
  - Token expiry constants

#### 2. Token Management
- ✅ **`src/services/auth/tokenManager.ts`** (171 lines)
  - localStorage token management
  - Automatic token refresh (15 min schedule)
  - Token validation & lifecycle
  - User data caching

#### 3. API Client Layer
- ✅ **`src/services/api/apiClient.ts`** (176 lines)
  - Axios wrapper met JWT interceptors
  - Automatic token injection in requests
  - 401 handling met auto token refresh
  - Request queueing tijdens refresh
  - 403 & 429 error handling

- ✅ **`src/services/api/endpoints.ts`** (103 lines)
  - Centralized endpoint definitions
  - Auth, RBAC, Email, Data endpoints
  - Query string builder utility

- ✅ **`src/services/api/dataService.ts`** (178 lines)
  - Generic CRUD service factory
  - Replaces Supabase queries
  - Query options support
  - Bulk operations support

#### 4. Authentication Service
- ✅ **`src/services/auth/authService.ts`** (188 lines)
  - Login/Logout operations
  - Profile management
  - Password reset
  - Permission checks (local)
  - Role checks

#### 5. Email Service
- ✅ **`src/services/email/emailService.ts`** (99 lines)
  - Contact email via backend
  - Registration email via backend
  - Custom email support
  - Replaces n8n webhook

### 🎯 React Context & Hooks

#### 6. Authentication Context
- ✅ **`src/contexts/AuthContext.tsx`** (141 lines)
  - User state management
  - Login/Logout methods
  - Auto profile loading on mount
  - Error handling
  - Loading states

#### 7. Permission Context
- ✅ **`src/contexts/PermissionContext.tsx`** (126 lines)
  - RBAC permission checks
  - hasPermission, hasAnyPermission, hasAllPermissions
  - isAdmin, isStaff helpers
  - Role management
  - Custom hooks (useHasPermission, useRequirePermission)

### 🛡️ Protected Components

#### 8. Protected Routes
- ✅ **`src/components/auth/ProtectedRoute.tsx`** (131 lines)
  - Route guard with auth check
  - Single/multiple permission checks
  - AdminRoute shorthand
  - StaffRoute shorthand
  - Fallback support

#### 9. Permission Components
- ✅ **`src/components/auth/RequirePermission.tsx`** (86 lines)
  - Component-level permission checks
  - AdminOnly, StaffOnly shortcuts
  - ConditionalPermission component
  - Fallback rendering

### 📝 Base Types Update
- ✅ **`src/types/base.ts`** (Updated)
  - Extended QueryOptions with backend params
  - visible, sortBy, sortOrder, limit, offset, search

---

## 🔄 Volgende Stappen (Fase 4-7)

### Fase 4: Dependencies & Configuration

#### 1. Installeer Axios
```bash
npm install axios
```

#### 2. Update Environment Variables
Creëer/Update `.env`:
```env
VITE_API_BASE_URL=https://dklemailservice.onrender.com
```

Update `.env.example`:
```env
# Backend API
VITE_API_BASE_URL=https://dklemailservice.onrender.com

# Verwijder Supabase variabelen (deprecated)
```

### Fase 5: App Integration

#### 3. Update `src/App.tsx`
```typescript
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { NormalApp } from './components/NormalApp';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
          <NormalApp />
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

#### 4. Update Route Configuration
Voeg protected routes toe waar nodig:
```typescript
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';

// In je routing
<Route path="/admin" element={
  <AdminRoute>
    <AdminPanel />
  </AdminRoute>
} />

<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### Fase 6: Data Migration

#### 5. Replace Supabase Queries

**Partners Service** - `src/features/partners/services/partnerService.ts`:
```typescript
// OLD:
import { createApiService } from '../../../lib/api/createApiService';
const service = createApiService<Partner>('partners');

// NEW:
import { createDataService } from '../../../services/api/dataService';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
const service = createDataService<Partner>(API_ENDPOINTS.partners);
```

**Sponsors Service** - Similar pattern voor sponsors, photos, videos, etc.

#### 6. Update Form Submissions

**Aanmelden Form** - `src/pages/Aanmelden/components/FormContainer.tsx`:
```typescript
// OLD:
import { supabase } from '../../../lib/supabase';
const { error } = await supabase.from('aanmeldingen').insert([data]);

// NEW:
import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';
await apiClient.post(API_ENDPOINTS.aanmeldingen, data);
```

**Email Service** - `src/utils/emailService.ts`:
```typescript
// OLD:
const response = await fetch(N8N_WEBHOOK_URL, { ... });

// NEW:
import { emailService } from '../services/email/emailService';
await emailService.sendContactEmail(data);
await emailService.sendRegistrationEmail(data);
```

### Fase 7: Cleanup

#### 7. Remove Supabase
```bash
npm uninstall @supabase/supabase-js
```

#### 8. Delete Old Files
- ❌ `src/lib/supabase.ts`
- ❌ `src/providers/AuthProvider.tsx` (replaced by new AuthContext)
- ❌ `src/lib/api/createApiService.ts` (replaced by dataService)

#### 9. Update Imports
Search en replace in alle files:
- `from '../lib/supabase'` → use new services
- `from '../../lib/supabase'` → use new services
- `supabase.from(` → use createDataService

---

## 📊 Implementatie Checklist

### Core Services
- [x] Token Manager (localStorage + auto-refresh)
- [x] API Client (axios + interceptors)
- [x] Auth Service (login/logout/profile)
- [x] Email Service (backend emails)
- [x] Data Service (generic CRUD)

### React Layer
- [x] Auth Context (user state)
- [x] Permission Context (RBAC)
- [x] Protected Route component
- [x] Require Permission component

### Configuration
- [ ] Install axios dependency
- [ ] Update .env variables
- [ ] Update App.tsx providers
- [ ] Configure route guards

### Migration
- [ ] Replace Supabase queries (10+ files)
- [ ] Update form submissions (2 files)
- [ ] Update email service (1 file)
- [ ] Test all data fetching

### Cleanup
- [ ] Remove Supabase package
- [ ] Delete old files (3 files)
- [ ] Update imports across codebase
- [ ] Verify no Supabase references

### Testing
- [ ] Login/Logout flow
- [ ] Token auto-refresh
- [ ] Permission checks
- [ ] Protected routes
- [ ] Data fetching (partners, sponsors, etc.)
- [ ] Form submissions
- [ ] Email sending

---

## 🔑 Key Features Implemented

### 1. JWT Authentication
- ✅ 20 minute access tokens
- ✅ 7 day refresh tokens
- ✅ Automatic refresh 5 min before expiry
- ✅ Token rotation on refresh
- ✅ Secure token storage (localStorage)

### 2. Authorization (RBAC)
- ✅ 58 granular permissions
- ✅ Permission-based routing
- ✅ Component-level permission checks
- ✅ Admin/Staff shortcuts
- ✅ Multiple permission checks (AND/OR)

### 3. API Client
- ✅ Automatic JWT injection
- ✅ Request interceptors
- ✅ Error handling (401/403/429)
- ✅ Automatic token refresh on 401
- ✅ Request queueing during refresh

### 4. Developer Experience
- ✅ TypeScript throughout
- ✅ Centralized endpoint definitions
- ✅ Generic CRUD service factory
- ✅ Custom React hooks
- ✅ Comprehensive error handling

---

## 🚨 Critical Implementation Notes

### Token Refresh Strategy
- Refresh timer set at 15 minutes (5 min before expiry)
- Automatic refresh in background
- Manual refresh on 401 errors
- Request queueing prevents duplicate refreshes

### Permission Caching
- Backend caches permissions in Redis (5 min TTL)
- Frontend caches user data in localStorage
- Auth context provides fresh data via `refreshUser()`
- Permission context always uses latest user data

### Error Handling
- 401 → Automatic token refresh → Retry request
- 403 → Permission denied (logged to console)
- 429 → Rate limit exceeded (logged to console)
- Network errors → Thrown to caller for custom handling

### Security
- Tokens in localStorage (XSS risk mitigated by HTTPOnly cookies on backend)
- No sensitive data in JWT payload
- Backend validates all permissions server-side
- Frontend checks are for UX only

---

## 📚 Documentation References

- [Complete Migration Plan](./BACKEND_MIGRATION_PLAN.md)
- [Backend Auth Documentation](./AUTH_AND_RBAC.md)
- [API Endpoints](../src/services/api/endpoints.ts)

---

## 🎯 Next Action Items

### Immediate (Nu)
1. **Installeer axios:**
   ```bash
   npm install axios
   ```

2. **Update .env:**
   ```env
   VITE_API_BASE_URL=https://dklemailservice.onrender.com
   ```

3. **Update App.tsx:**
   Wrap app met AuthProvider + PermissionProvider

### Short Term (Deze Week)
1. Migreer data services (partners, sponsors, photos, etc.)
2. Update form submissions (aanmelden, contact)
3. Test login/logout flow
4. Verify protected routes

### Medium Term (Volgende Week)
1. Remove Supabase dependencies
2. Full integration testing
3. Performance testing
4. Deploy to staging

---

**Status:** Foundation Complete ✅ | Ready for Integration  
**Next Phase:** Dependencies & App Configuration  
**ETA for Full Migration:** 2-3 dagen
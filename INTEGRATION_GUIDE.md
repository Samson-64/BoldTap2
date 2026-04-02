# BoldTap Frontend-Backend Integration Guide

## ✅ Status: Successfully Connected

The frontend and backend are now fully connected and working together.

---

## 🚀 Running Servers

### Backend Server

- **URL**: http://localhost:3001
- **Status**: ✅ Running
- **Test**: `curl http://localhost:3001/health`

### Frontend Server

- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Access**: http://localhost:3000

---

## 📋 What Was Configured

### 1. **API Client Setup**

Created [Frontend/contexts/api.ts](Frontend/contexts/api.ts) with:

- Centralized API endpoint management
- Automatic JWT token handling
- Error handling and response parsing
- Type-safe API functions for all backend endpoints

### 2. **Environment Configuration**

Updated [Frontend/.env.local](Frontend/.env.local):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. **Authentication System**

Updated [Frontend/contexts/lib/auth.ts](Frontend/contexts/lib/auth.ts):

- Replaced localStorage-based mock auth with real backend API calls
- Integrated token management with automatic Bearer token headers
- User data now fetched from backend instead of local storage
- Password validation still done client-side for UX

### 4. **API Functions Available**

#### Authentication Endpoints

- `apiRegister(name, email, phone, password)` → `POST /auth/register`
- `apiLogin(email, password)` → `POST /auth/login`
- `apiLogout()` → `POST /auth/logout`
- `apiGetCurrentUser()` → `GET /auth/me` (Protected)
- `apiUpdateProfile(data)` → `PUT /auth/profile` (Protected)
- `apiChangePassword(oldPassword, newPassword)` → `POST /auth/change-password` (Protected)
- `apiCheckEmailAvailability(email)` → `GET /auth/check-email`

#### Loyalty Card Endpoints

- `apiCreateLoyaltyBusiness(...)` → `POST /api/loyalty/business` (Protected)
- `apiGetLoyaltyBusiness(slug)` → `GET /api/loyalty/business/:slug`
- `apiGetUserLoyaltyBusinesses()` → `GET /api/loyalty/user/businesses` (Protected)
- `apiCreateLoyaltyCard(businessId, userId)` → `POST /api/loyalty/card` (Protected)
- `apiGetLoyaltyCard(cardId)` → `GET /api/loyalty/card/:cardId`
- `apiGetUserLoyaltyCards()` → `GET /api/loyalty/user/cards` (Protected)
- `apiAddPointsToCard(cardId, points)` → `POST /api/loyalty/card/:cardId/points` (Protected)
- `apiUpdateLoyaltyBusiness(businessId, data)` → `PUT /api/loyalty/business/:businessId` (Protected)
- `apiDeleteLoyaltyCard(cardId)` → `DELETE /api/loyalty/card/:cardId` (Protected)
- `apiGetBusinessLoyaltyCards(businessId)` → `GET /api/loyalty/business/:businessId/cards` (Protected)

#### NFC Business Endpoints

- `apiCreateNfcProfile(...)` → `POST /api/nfc/profile` (Protected)
- `apiGetNfcProfile(slug)` → `GET /api/nfc/profile/:slug`
- `apiGetUserNfcProfile()` → `GET /api/nfc/profile` (Protected)
- `apiUpdateNfcProfile(profileId, data)` → `PUT /api/nfc/profile/:profileId` (Protected)
- `apiDeleteNfcProfile(profileId)` → `DELETE /api/nfc/profile/:profileId` (Protected)
- `apiCheckNfcSlugAvailability(slug)` → `GET /api/nfc/check-slug`

---

## 🔐 Authentication Flow

1. **Login/Register**: Credentials sent to backend
2. **Token Receipt**: Backend returns JWT token
3. **Token Storage**: Token saved to localStorage (or sessionStorage if "Remember Me" unchecked)
4. **API Requests**: All subsequent requests include `Authorization: Bearer {token}` header
5. **Token Refresh**: Token maintained across page reloads

---

## 🛠️ How to Use the API Client

### In Components

```typescript
import { apiGetUserLoyaltyCards, apiCreateLoyaltyCard } from "@/contexts/api";

// Fetch user's loyalty cards
const response = await apiGetUserLoyaltyCards();
if (response.success) {
  const cards = response.data?.cards;
}

// Create a new loyalty card
const createResponse = await apiCreateLoyaltyCard(businessId, userId);
```

### Error Handling

```typescript
const response = await apiLogin(email, password);
if (!response.success) {
  console.error(response.error); // Error message from backend
}
```

---

## 📝 Next Steps

1. **Update other lib files** to use API client:
   - [Frontend/contexts/lib/loyaltyCard.ts](Frontend/contexts/lib/loyaltyCard.ts)
   - [Frontend/contexts/lib/nfcProfile.ts](Frontend/contexts/lib/nfcProfile.ts)
   - [Frontend/contexts/lib/adminAuth.ts](Frontend/contexts/lib/adminAuth.ts)

2. **Add more features**:
   - NFC scanning and QR code reading
   - Image uploads for profiles
   - Real-time notifications

3. **Add error boundaries** in components for better error handling

4. **Implement request caching** using SWR hooks (already installed)

---

## 🧪 Testing the Connection

Try logging in with test credentials:

1. **Register**: Create an account at http://localhost:3000/register
2. **Login**: Try logging in at http://localhost:3000/login
3. **Dashboard**: Access dashboard after login

---

## 📚 File Locations

| File                                                                   | Purpose                |
| ---------------------------------------------------------------------- | ---------------------- |
| [Frontend/contexts/api.ts](Frontend/contexts/api.ts)                   | API client & endpoints |
| [Frontend/contexts/lib/auth.ts](Frontend/contexts/lib/auth.ts)         | Authentication logic   |
| [Frontend/.env.local](Frontend/.env.local)                             | Environment variables  |
| [Frontend/contexts/AuthContext.tsx](Frontend/contexts/AuthContext.tsx) | Auth state management  |

---

## ⚠️ Important Notes

- **CORS**: Backend needs CORS enabled for requests from `http://localhost:3000` (already configured)
- **JWT Secret**: Keep `JWT_SECRET` environment variable secure in production
- **Token Expiry**: Tokens expire after 24 hours (configurable in backend)
- **Development**: Both servers run in development mode for hot-reload

---

## 🔧 Troubleshooting

### "Network error" when making requests

- Check if backend is running: `curl http://localhost:3001/health`
- Verify port 3001 is not blocked
- Check browser console for CORS errors

### "Invalid token" errors

- Logout and login again to get a fresh token
- Check if token is correctly saved in localStorage

### Frontend not loading

- Verify frontend is running: `npm run dev` in Frontend directory
- Check if port 3000 is available

---

Generated: April 2, 2026

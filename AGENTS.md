# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Project Commands

- `npm start` - Start the Expo development server
- `npm run android` - Start for Android emulator/device
- `npm run ios` - Start for iOS simulator (macOS only)
- `npm run web` - Start for web
- `npx tsc --noEmit` - Run TypeScript type checking

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication and Firestore
3. Copy your config into `app.json` under `expo.extra` OR set environment variables
4. For production mobile apps, configure native Firebase files (`google-services.json` / `GoogleService-Info.plist`)

## Stripe Integration

The app is wired to use Stripe for both subscriptions (Checkout) and one-time purchases (PaymentSheet).

1. Add your Stripe secret key to `backend/.env` (copy from `backend/.env.example`)
2. Create matching products/prices in your Stripe dashboard
3. Update `src/services/stripePayments.ts`:
   - `BACKEND_URL` to your deployed backend URL
   - `getProductPriceId` and `getPlanPriceId` mappings to real Stripe price IDs
4. Run the backend:
   ```powershell
   cd backend
   npm install
   copy .env.example .env
   # Edit .env and add STRIPE_SECRET_KEY=sk_test_...
   npm run dev
   ```
5. If the backend is unavailable, the app falls back to demo mode

## Deploy Backend to Railway

1. Push the `DatingAdviceApp` repo to GitHub (make sure `backend/.env` is NOT committed)
2. Go to https://railway.app and create an account
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repo, then in the service settings set **Root Directory** to `backend`
5. Add environment variable: `STRIPE_SECRET_KEY=sk_live_...` (or `sk_test_...` for testing)
6. Railway will automatically use the `Procfile` and expose the service on `$PORT`
7. Copy the public Railway URL (e.g., `https://cupidcore-api.up.railway.app`)
8. Update `BACKEND_URL` in `src/services/stripePayments.ts` and `src/services/stripePayments.web.ts`
9. Rebuild the mobile app so it uses the live backend URL

## Monetization Integration Notes

- Replace placeholder ad functions in `src/services/monetization.ts` with:
  - Google Mobile Ads (AdMob) for rewarded/interstitial ads
  - Apple App Store / Google Play billing if using native in-app purchases instead of Stripe


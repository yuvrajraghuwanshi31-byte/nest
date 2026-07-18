# Nest

School + Craft todos in one place. Expo web app, built for MacBook and phone.

## Local

```bash
npm install
cp .env.example .env
npm run web
```

Fill `.env` with Craft + Firebase values (see below).

## Firebase Auth

Accounts are stored in Firebase so you can sign in from any device.

1. Open [Firebase Console](https://console.firebase.google.com/) → **Add project** (name it `nest`)
2. Build → **Authentication** → **Get started** → enable **Email/Password**
3. Project settings (gear) → **Your apps** → Web (`</>`) → register app `nest-web`
4. Copy the config into `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

5. Authentication → **Settings** → **Authorized domains** → add your Cloudflare domain (e.g. `nest.xxx.workers.dev`)

Old local-only accounts will not carry over — create a new account after Firebase is connected.

## Cloudflare

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | `dist` |

Add the same `EXPO_PUBLIC_*` env vars (Craft + Firebase) in Cloudflare → Settings → Variables.

SPA routing is handled in `wrangler.jsonc` via `not_found_handling: "single-page-application"`.

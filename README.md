# Nest

School + Craft todos in one place. Expo web app, built for MacBook and phone.

## Local

```bash
npm install
cp .env.example .env   # add Craft + Supabase keys
npm run web
```

Open [http://localhost:8081](http://localhost:8081).

## Vercel

Nest deploys as a static Expo web export to [Vercel](https://vercel.com).

### Connect GitHub (recommended)

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Vercel reads settings from `vercel.json` automatically
3. Add environment variables (Production + Preview):

```
EXPO_PUBLIC_CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

4. Deploy

### CLI deploy

```bash
npm install -g vercel
npm run build
vercel --prod
```

Treat the Craft API URL like a password. Do not add Supabase secret keys to the frontend.

Firebase Analytics (optional web tracking) uses the `EXPO_PUBLIC_FIREBASE_*` vars. Auth still runs on Supabase.

Expo static export generates an HTML file per route in `dist`, so deep links like `/signup` and `/home` work with Vercel `cleanUrls`.

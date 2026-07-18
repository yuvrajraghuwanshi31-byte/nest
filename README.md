# Nest

School + Craft todos in one place. Expo web app, built for MacBook and phone.

## Local

```bash
npm install
cp .env.example .env   # add Craft + Supabase keys
npm run web
```

## Cloudflare

This repo deploys as a **Workers static assets** site (`wrangler deploy`).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | `dist` |

Environment variables (Production + Preview):

```
EXPO_PUBLIC_CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Treat the Craft API URL like a password. Do not add Supabase secret keys to the frontend.

SPA routing is handled in `wrangler.jsonc` via `not_found_handling: "single-page-application"` (no `_redirects` file).

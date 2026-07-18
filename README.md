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

Environment variable (Production + Preview):

```
EXPO_PUBLIC_CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK/api/v1
```

Treat that Craft URL like a password.

SPA routing is handled in `wrangler.jsonc` via `not_found_handling: "single-page-application"` (no `_redirects` file).

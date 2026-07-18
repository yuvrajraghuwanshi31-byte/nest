# Nest

School + Craft todos in one place. Expo web app, built for MacBook and phone.

## Local

```bash
npm install
cp .env.example .env   # add your Craft API URL
npm run web
```

## Cloudflare Pages

Build settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` |

Environment variable (Pages → Settings → Environment variables):

```
EXPO_PUBLIC_CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK/api/v1
```

Treat that Craft URL like a password.

### Deploy from CLI (optional)

```bash
npm run pages:deploy
```

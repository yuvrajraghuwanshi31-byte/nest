# Nest

School + Craft todos in one place. Expo web app, built for MacBook and phone.

## Local

```bash
npm install
cp .env.example .env   # add your Craft API URL
npm run web
```

## Cloudflare Pages (Git)

In **Workers & Pages → your project → Settings → Builds**:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| **Deploy command** | **Leave empty** |
| Build output directory | `dist` |
| Root directory | `/` (default) |
| Environment variable `NODE_VERSION` | `20` |

Do **not** set Deploy command to `npx wrangler deploy`. Pages already publishes `dist` after the build.

Environment variable (Production + Preview):

```
EXPO_PUBLIC_CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK/api/v1
```

Treat that Craft URL like a password. After changing build settings, click **Retry deployment**.

### CLI deploy (optional)

```bash
npm run pages:deploy
```

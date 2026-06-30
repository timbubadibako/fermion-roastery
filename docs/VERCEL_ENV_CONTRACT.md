# Fermion Roastery Vercel Environment Contract

## Critical cleanup

- Remove `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` from every frontend environment.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` after removal.
- Keep gateway secrets server-side only.

## Frontend env

### Production

```env
NEXT_PUBLIC_API_URL=https://www.fermionroastery.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Preview / Development

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Backend / server env

### Shared names

```env
NODE_ENV=production
APP_URL=https://www.fermionroastery.com
BACKEND_URL=https://www.fermionroastery.com

SUPABASE_URL=...
SUPABASE_DB_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

XENDIT_MODE=production
XENDIT_SECRET_KEY=...
XENDIT_PUBLIC_KEY=...
XENDIT_WEBHOOK_TOKEN=...

BITESHIP_MODE=production
BITESHIP_API_KEY=...
BITESHIP_WEBHOOK_SECRET=...
BITESHIP_ORIGIN_AREA_ID=IDNP9IDNC105IDND151IDZ45131
BITESHIP_ORIGIN_POSTAL_CODE=45131

MAIL_PROVIDER=resend
MAIL_FROM_EMAIL=orders@mail.fermionroastery.com
MAIL_FROM_NAME=Fermion Roastery
MAIL_REPLY_TO=support@fermionroastery.com
RESEND_API_KEY=...

ORDER_TRACKING_SIGNING_SECRET=...
ALLOWED_FRONTEND_ORIGINS=https://www.fermionroastery.com
```

## Deployment rule

- Local / preview uses sandbox keys.
- Production uses live keys.
- Do not store both sandbox and live keys in a single environment and switch them at runtime.
- Delayed `created` order email currently depends on the backend cron process being alive; if production runs serverless-only, move this job to Vercel Cron or another scheduler before relying on it.

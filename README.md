# Fabrica — Tailoring Style Suggestion App

A demo web app: a customer uploads a fabric photo, gets AI-suggested
clothing styles, picks a style and tailor, and pays for the fabric via
Paystack. See `PRD.md` for the full spec.

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS · Prisma + PostgreSQL ·
Supabase Storage · Anthropic API (Claude) · Paystack · Resend · pnpm

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env` with real credentials (see below), then:

```bash
pnpm prisma migrate dev --name init
pnpm seed
pnpm dev
```

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Aiven) |
| `ANTHROPIC_API_KEY` | Claude API key for fabric labeling + style suggestion |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (test or live) |
| `RESEND_API_KEY` | Resend API key for tailor notification emails |
| `NOTIFICATIONS_FROM_EMAIL` | From-address for tailor emails |
| `APP_URL` | Public base URL, used for Paystack callback |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase Storage, for fabric photo uploads |
| `CLOUDINARY_*` | Reserved for the later style-image upload pass (not required to run this build) |

## Seed data

- `prisma/seed-styles.ts` — 20 style templates, `imageUrl` set to
  `"PENDING_UPLOAD"` until real Cloudinary links are added. Keyed by
  filename (matching `/assets/styles/`) for the later image-upload pass.
- `prisma/seed-tailors.ts` — 4 placeholder tailor profiles.

Run both with `pnpm seed`.

## Payments

Use Paystack **test mode** keys during development. The webhook
(`/api/payments/webhook`) verifies the `x-paystack-signature` header and
re-verifies the transaction directly against Paystack before marking an
order paid — point your Paystack test dashboard's webhook URL at
`<APP_URL>/api/payments/webhook`.

## What's not built here

Per the PRD's non-goals: no customer/tailor accounts, no admin
dashboard, no order-status tracking beyond the payment confirmation
screen, and no Cloudinary image-upload script (`scripts/upload-style-images.ts`) —
that's a separate pass once real style photos are supplied.

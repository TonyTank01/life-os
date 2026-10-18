# LIFE OS Online — starter

LIFE OS is being designed as a private, installable web app (PWA) that works on desktop and mobile, with cloud sync after authentication is configured.

## Recommended architecture
- **UI/app:** Next.js + TypeScript, responsive dark UI, installable PWA.
- **Identity + cloud database:** Supabase Auth + PostgreSQL.
- **Security:** Row Level Security (RLS) on every user-owned table.
- **Hosting:** deploy the Next.js project to a host such as Vercel; use HTTPS and a custom domain if desired.
- **Backup:** database export plus in-app CSV/JSON export planned for the next build stage.

## Start locally
1. Install Node.js 20.9+.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and copy its project URL and publishable/anon key into `.env.local`.
4. In Supabase SQL Editor, run `supabase/schema.sql`.
5. In Supabase Auth settings, configure your local URL (`http://localhost:3000`) and redirect URLs.
6. Run `npm install`, then `npm run dev`.

## Important current status
This is a **starter scaffold**, not yet a deployed production app. The dashboard is a visual/interaction prototype. Task checkboxes in this starter use local browser storage; the email sign-in handler is wired to Supabase but cloud CRUD/sync still needs to be connected. Do not enter sensitive data until authentication, RLS, sync, and backup are tested.

## Product plan for the first usable release
1. Authentication and session management.
2. Sync task and daily log CRUD to the authenticated user's database.
3. Goal tracker and 90-day sprint timeline.
4. Coaching CRM: leads, active clients, renewals, monthly income and expenses.
5. Weekly review, life-area scores, and trend charts.
6. PWA install instructions, offline queue, conflict handling, export/import, and tests.

## Suggested core tables
`profiles`, `goals`, `tasks`, `daily_logs`, `life_scores`, `clients`, `transactions`, `weekly_reviews`.

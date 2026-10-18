# DINCA METHOD — Personal Performance System

**YOUR GOALS. MY JOB.**

DINCA METHOD is being developed as a premium, minimalist personal-development platform that helps people turn life goals into clear daily actions. The long-term product vision is web + iPhone + Android, with the same account and cloud-synced data across devices.

## Product direction
- **Audience:** anyone who wants to improve their life.
- **Core promise:** one place to plan, act, reflect, and track meaningful progress.
- **Visual identity:** near-black UI, restrained red accents, premium minimalism, mobile-first usability.
- **Initial focus:** a reliable web MVP before expanding into dedicated mobile apps and paid features.

## Planned technology
- **Web:** Next.js + TypeScript, responsive and installable PWA.
- **Authentication and cloud sync:** Supabase Auth + PostgreSQL.
- **Authorization:** PostgreSQL Row Level Security (RLS) on every user-owned table.
- **Hosting:** Vercel (deployment must be verified).
- **Mobile apps:** React Native + Expo is the proposed next step after the web MVP is validated, using the same Supabase project for synchronized data.

## Run locally
1. Install Node.js 20.9+.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and add its project URL and publishable/anon key to `.env.local`.
4. In Supabase SQL Editor, run `supabase/schema.sql`.
5. Configure Supabase Auth site and redirect URLs for local development.
6. Run `npm install`, then `npm run dev`.

## Product roadmap
See [docs/PRODUCT_ROADMAP.md](docs/PRODUCT_ROADMAP.md) for the product principles, phased releases, architecture, validation plan, and immediate engineering priorities.

## Current status — read before use
This is a **prototype/starter, not a production-ready service**. The dashboard has many UI areas, but not every workflow is backed by cloud persistence. Authentication, cloud CRUD/sync, backups, account deletion, cross-account security testing, and production deployment must be verified before users store sensitive personal information.

Do not commit secrets or service-role keys. Never expose a Supabase service-role key in client-side code. All user-owned tables must have tested RLS policies.

## First usable release
1. Verify build and deployment.
2. Finish sign-in/session handling.
3. Connect goals, tasks, daily check-ins, and weekly reviews to authenticated Supabase CRUD.
4. Add loading, error, empty, and offline/sync states.
5. Add export and account/data deletion.
6. Test mobile browser usability and RLS with separate test accounts.
7. Validate with a small group before implementing native iOS/Android apps or paid tiers.

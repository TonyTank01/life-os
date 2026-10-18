# DINCA METHOD — Product roadmap

## Product vision
DINCA METHOD is a premium personal-development system that helps people make progress across the areas that matter to them, from one calm, clear workspace. The promise is not “more tracking”; it is turning personal goals into realistic daily actions and helping users recover when they fall off track.

**Brand:** DINCA METHOD  
**Tagline:** YOUR GOALS. MY JOB.  
**Visual direction:** premium minimalism, near-black surfaces, restrained red accents, accessible contrast, mobile-first layouts.  
**Audience:** anyone who wants to improve their life. The long-term product is a connected life platform; the first release should still have a narrow, testable core rather than trying to ship every module at once.

## Product principles
1. **One next step:** the dashboard should make the next useful action obvious.
2. **Low-friction consistency:** quick daily check-ins, easy task capture, and compassionate recovery after missed days.
3. **One connected life:** goals, routines, health, money, and productivity should inform one another without overwhelming the user.
4. **User-owned progress:** people can review, export, and delete their data.
5. **Privacy by default:** personal records belong to the authenticated user; enforce authorization in the database, not only in the UI.
6. **Useful before clever:** build reliable core workflows before adding AI-generated advice or integrations.
7. **Cross-device continuity:** the same account and cloud data should work on web, iPhone, and Android.

## Long-term product modules
- **Today:** daily focus, top priorities, habits/check-in, and a clear completion summary.
- **Goals:** outcomes, milestones, dates, and weekly actions across life areas.
- **Productivity:** tasks, projects, planning, routines, calendar-oriented views, and lightweight focus sessions.
- **Fitness & GPS Running:** workout logs first; later, native phone GPS recording with live distance, elapsed time, pace, route map, kilometer splits, pause/resume, and activity history.
- **Nutrition:** food and meal logging, simple nutrition targets, and progress summaries; avoid implying medical diagnosis.
- **Sleep & recovery:** sleep duration, subjective energy/recovery, and optional integrations where supported and consented to.
- **Money:** simple income, expense, budget, and savings-goal tracking.
- **Reflection:** weekly review, wins, obstacles, lessons, and next priorities.
- **Coach (later):** contextual guidance based on user-selected data, with transparent limits and controls.

## Release plan

### Phase 0 — Foundation and validation
- Keep the existing Next.js + TypeScript project as the web foundation.
- Confirm build/deployment, responsive navigation, and the complete first-run experience.
- Define a small core workflow and test it with 5–10 people before expanding scope.
- Add basic product analytics only with appropriate disclosure and privacy choices.

### Phase 1 — Useful web MVP
- Account creation, sign-in, sign-out, and password/session recovery.
- Persist profile, goals, tasks, daily check-ins, and weekly reviews in Supabase.
- Replace local-only task state with authenticated cloud CRUD and loading/error/empty states.
- Dashboard shows today’s priorities and progress without requiring extensive setup.
- Row Level Security on every user-owned table; test cross-account isolation.
- Data export and account/data deletion path.
- Accessibility, mobile browser QA, and automated build/type checks.

### Phase 2 — Personalization and retention
- Goal milestones and weekly planning.
- Habit schedules and history.
- Initial fitness, nutrition, and sleep logs with user-controlled targets.
- Useful trend summaries and a weekly review flow.
- Offline-friendly behavior with explicit sync/error status and conflict handling.
- Guided onboarding that adapts the first plan to the user's selected goals and obstacles.

### Phase 3 — iPhone and Android foundation
- Build a dedicated mobile app with React Native/Expo once the web MVP has validated the core workflows.
- Reuse Supabase authentication and database so all platforms show the same account data.
- Add mobile-appropriate navigation, push notifications only by opt-in, deep links, and secure session handling.
- Test on real iOS and Android devices; plan App Store and Google Play compliance, privacy disclosures, and billing rules.

### Phase 4 — GPS Running
- Add native location tracking designed for runs, including recording while the screen is locked or the user switches apps.
- Provide a clear start/pause/resume/finish flow, elapsed time, distance, pace, route map, and kilometer splits.
- Store each completed activity and its route data securely, then sync it to the user's account across devices.
- Handle denied permissions, weak GPS, interruptions, battery use, duplicate points, and interrupted sessions gracefully.
- Ask for location permission in context, explain why it is needed, minimize retained location data, and let users delete activities.
- Treat background tracking as a native mobile capability; do not promise reliable locked-screen GPS tracking from the web app alone.

### Phase 5 — Paid plans
- Start with a useful free tier.
- Test paid value propositions only after users demonstrate repeat usage.
- Potential Pro features: deeper trends, flexible templates, advanced planning, and cross-domain reviews.
- Potential AI tier only after reliable data workflows exist; disclose AI use, cost limits, and data handling.
- Validate willingness to pay before committing to final pricing. Any prices in planning are hypotheses, not promises.

## Proposed architecture
- **Web:** Next.js, React, TypeScript, responsive PWA.
- **Backend:** Supabase Auth + PostgreSQL.
- **Authorization:** PostgreSQL Row Level Security on every user-owned table.
- **Hosting:** Vercel or equivalent; production URL and environment variables must be verified.
- **Mobile:** React Native + Expo, sharing the same Supabase project and account data.
- **GPS:** native location APIs via a mobile location module, with explicit iOS/Android permission configuration and real-device testing.
- **Quality:** lint/build checks, schema review, access-control tests, export/delete tests, GPS accuracy and interruption tests, and device QA.

## Success measures
- Onboarding completion.
- Percentage of new users who create a meaningful goal and complete a first action.
- Weekly active users and week-4 retention.
- Percentage of users completing a weekly review.
- User-reported clarity and usefulness.
- For running: completed recordings, GPS failure rate, activity sync success, and repeat runs.
- Paid conversion only after retention and willingness-to-pay are measured.

## Current technical status
This repository is a prototype/starter, not a production-ready commercial service. The existing UI includes multiple life-management areas, but cloud persistence, authentication hardening, backups, and mobile apps must be implemented and tested before inviting users to store sensitive personal data. GPS Running is a planned future module, not an implemented feature.

## Immediate next engineering tasks
1. Verify the feature branch and deployment/build status.
2. Audit the current page for localStorage-only data and connect one core workflow end-to-end (tasks first).
3. Add reliable auth/session states and clear error handling.
4. Test Supabase RLS with two separate test accounts.
5. Make Today and onboarding excellent on narrow mobile screens.
6. Validate the core life-management workflow before starting native mobile and GPS development.

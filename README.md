# Deliverables

Deliverables is a React web app for sharing audio recordings and collecting
performance ratings. Visitors can listen to visible tracks and rate each one
from one to five stars. An authenticated administrator can upload tracks,
manage their visibility, review aggregate ratings, and delete tracks.

This repository contains the frontend only. It uses Supabase for authentication,
database access, and audio storage; the Supabase project and its policies are
configured separately.

## Getting started

### Requirements

- Node.js and npm
- A Supabase project with the database objects and storage bucket described
  below

### Configure and run

1. Install dependencies with `npm install`.
2. Create a local `.env.local` file in the project root with the Supabase
   project URL and public client key:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-supabase-publishable-or-anon-key
   ```

   Vite exposes variables prefixed with `VITE_` to browser code. Use only the
   Supabase publishable/anon key here; never put a service-role key or other
   secret in a frontend environment variable.
3. Start the development server with `npm run dev`.

The deployed app uses `/` for the public feed and `/lissaonly` for the
administrator sign-in and panel. Vercel is configured to route paths back to
the single-page app.

## Features and application flow

- **Public feed:** loads tracks, displays an audio player for each visible
  track, shows the average rating, and accepts a one-to-five-star rating.
- **Admin:** signs in with Supabase email/password authentication; provides
  track upload, visibility controls, aggregate rating and vote counts, delete,
  and sign-out actions.
- **Data fetching:** TanStack Query handles loading and mutations, refreshing
  track and rating data after successful updates.
- **Audio:** uploaded files are stored in the `audio` Supabase Storage bucket.
  Track records keep a storage path; the frontend resolves it to a public URL.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Routes and TanStack Query provider |
| `src/pages/Feed.tsx` | Public track feed |
| `src/pages/Admin.tsx` | Session check and admin sign-in/panel selection |
| `src/components/` | Track player, ratings, upload form, and admin controls |
| `src/utils/api.ts` | Supabase queries, mutations, and conversion to frontend models |
| `src/utils/supabase.ts` | Supabase client and table/bucket names |
| `src/utils/database.types.ts` | Supabase database and RPC TypeScript definitions |
| `src/utils/types.ts` | Frontend `Track`, `Rating`, and `Stars` types |
| `vercel.json` | SPA route rewrite for Vercel |

## Data and type overview

`src/utils/database.types.ts` describes the `public` Supabase schema used by
the client. It is the frontend's schema reference, not a database migration;
the actual database must be provisioned and kept in sync separately.

| Object | Fields / behavior |
| --- | --- |
| `tracks` table | `id`, `title`, `storage_path`, `is_visible`, and `created_at`. Inserts require a title and storage path; the other fields have database defaults. |
| `track_ratings` table | One row per track, linked by `track_id` to `tracks.id`; stores numeric counts in `stars_1` through `stars_5`. |
| `submit_rating` function | Accepts `p_track_id` and `p_stars`, and returns the updated rating-count row. |
| `audio` storage bucket | Holds uploaded audio files. The app constructs a public URL from each track's `storage_path`. |

The frontend models these records separately from their database representation:

- `Track` uses camelCase names and includes the resolved `audioUrl`,
  `isVisible`, and `createdAt`.
- `Rating` represents the five star-count totals for a track.
- `Stars` limits submitted ratings to the integer values `1` through `5`.
- The API calculates the displayed average and total vote count from the five
  database counters.

If the Supabase schema or RPC changes, update the database types and the
mappings in `src/utils/api.ts` together.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with TypeScript, then create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

There is currently no test script or test suite in the repository.

## Strengths

- A focused end-to-end workflow combines audio playback, lightweight ratings,
  and simple administrator operations.
- TypeScript types describe both the Supabase records/RPC and the app-facing
  models, making the database-to-UI conversion explicit.
- TanStack Query centralizes asynchronous reads, mutation state, and refreshing
  data after updates.
- Supabase provides hosted authentication, database, and storage integrations
  without a custom backend in this repository.
- The Vite build and ESLint commands provide basic type/build and static
  checks.

## Limitations and things to verify

- **Backend configuration is external.** This repository has no migrations or
  database policy definitions. Provision the tables, `submit_rating` function,
  storage bucket, and permissions separately, and keep them aligned with
  `database.types.ts`.
- **Authorization must be enforced in Supabase.** `/lissaonly` is a frontend
  route, not a security boundary. Configure database and storage policies so
  only authorized administrators can upload, change visibility, or delete, and
  public users can perform only intended operations.
- **Visibility filtering is client-side in the app.** `getTracks(true)` filters
  the returned rows after fetching them. Do not rely on this to protect hidden
  track metadata or storage paths; enforce access at the database and storage
  layers if those records or files must remain private.
- **Audio URLs are public URLs.** The current frontend resolves files through
  Supabase's public URL mechanism. Private audio requires a different access
  model, such as signed URLs and corresponding policies.
- **No automated tests are present.** The npm scripts include build and lint
  checks, but no automated behavioral or integration test suite.
- **Environment setup is manual.** There is no checked-in environment
  template or startup validation for missing Supabase variables; ensure both
  variables are set in local and deployment environments.

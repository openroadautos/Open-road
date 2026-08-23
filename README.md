# OpenRoad Auto Group

Static GitHub Pages dealership site with an optional Supabase-backed inventory admin.

## Live Inventory Admin

The admin is at:

`/admin/`

It lets authenticated staff:

- Sign in with Supabase Auth
- Add vehicles
- Delete vehicles
- Mark vehicles sold/available
- Add photo URLs for each car

The public inventory page at `/inventory/` loads cars from Supabase when configured. If Supabase is not configured yet, the existing static HTML inventory remains visible as a fallback.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/openroad_admin.sql` in the Supabase SQL editor.
3. Run `supabase/openroad_seed_current_inventory.sql` to import the current static cars.
4. Create an admin user in Supabase Auth.
5. Fill `/assets/openroad-config.js` with:
   - `url`
   - `anonKey`

Do not put the service role key in the website. The anon key is safe to publish only because Row Level Security is enabled by the SQL migration.

## Deploy

Commit and push to GitHub. GitHub Pages serves the site from the configured branch.

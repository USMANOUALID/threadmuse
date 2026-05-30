# NoirEdge Premium SaaS Website

A complete dark-theme premium SaaS website and protected admin CMS built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

## Included website pages

- Home page with hero, features, benefits, testimonials, FAQ, CTA, newsletter, and contact capture
- About
- Services
- Pricing
- Blog
- Contact
- Privacy Policy
- Terms & Conditions
- Refund Policy
- Custom 404
- Search page for services, features, pricing, and articles

## Admin dashboard

Secure `/admin` CMS area with Supabase Auth login and server-side admin role checks.

Admin modules include:

- Dashboard overview
- Homepage content
- Services
- Pricing plans
- Testimonials
- FAQ
- Blog posts
- Contact messages
- Image/media uploads
- Website settings
- SEO settings
- Analytics
- User management
- Newsletter management

## Supabase

The migration `supabase/migrations/0007_saas_cms.sql` adds:

- CMS tables for homepage sections, services, pricing, testimonials, FAQ, blog, SEO, settings, media, analytics, users, newsletter, and contact messages
- `admin_roles` table and `public.is_admin()` helper
- Row-level security policies for public reads and admin-only writes
- Public `cms-media` storage bucket with admin-only upload policies

## Environment variables

Create `.env.local` from `.env.example` and provide:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # server-only, optional for trusted admin jobs
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the website and `/admin/login` for the CMS.

## Database setup

```bash
supabase db push
```

To grant access, create a Supabase Auth user and either set `profiles.is_admin = true`, set `profiles.role` to `owner`, `admin`, or `editor`, or insert the user into `public.admin_roles`.

## Verification

```bash
npm run typecheck
npm run build
```

## Project structure

```text
app/                         App Router pages, admin routes, actions, SEO files
app/admin/(protected)/        Server-gated admin dashboard
components/marketing/         Public website shell, header, footer, forms
components/admin/             Login form, dashboard shell, media uploader
lib/saas-content.ts           Shared marketing and CMS demo content
supabase/migrations/0007_*    CMS schema, RLS, storage policies
types/database.ts             Supabase TypeScript table types
```

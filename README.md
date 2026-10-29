<div align="center">

<img src="public/icon-192.png" alt="RoomFinder logo" width="96" />

# RoomFinder

**A mobile-first web app that connects tenants with room owners.**
Landlords post their room, tenants search, save favourites, and contact them by call or WhatsApp.

</div>

---

## Features

**Tenants**
- Sign up and log in with email and password
- Search rooms by location, area or suburb
- Filter by room type (single, bachelor, shared) and maximum price
- View room details: photo, price, bedrooms, bathrooms, availability and description
- Save favourite rooms and view them later
- Contact the landlord with one tap via **Call** or **WhatsApp** (with a pre-filled message)

**Landlords**
- Sign up as a landlord
- Post one listing with one photo (compressed in the browser before upload to save storage)
- Set how many rooms are still available
- Edit, activate/deactivate, or delete the listing at any time

**General**
- Dark, mobile-first interface
- Installable on a phone as a PWA
- Role-based access: tenants and landlords only see their own screens

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Backend | Supabase (Auth, Postgres, Storage) |
| Icons | Lucide |
| PWA | vite-plugin-pwa |

Data is protected with Postgres **Row Level Security**: landlords can only modify their own listing, favourites are private to each user, and users cannot change their own role.

## Getting started

### Prerequisites
- Node.js 18 or newer
- A free [Supabase](https://supabase.com) account

### 1. Clone and install

```bash
git clone https://github.com/YOUR-USERNAME/roomfinder.git
cd roomfinder
npm install
```

### 2. Create your Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables, security policies, and the `room-photos` storage bucket.
3. Under **Authentication → Sign In / Providers → Email**, turn **off "Confirm email"** while developing. Turn it back on before going live.

### 3. Add your environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values from **Supabase → Project Settings → API**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> Never commit `.env.local`, and never use the `service_role` key in this app.

### 4. Run it

```bash
npm run dev
```

Open the local URL. To test on a phone from GitHub Codespaces, set port `5173` to **Public** in the Ports tab and open the forwarded URL.

## Project structure

```
src/
├── components/   Reusable UI (BottomNav, RoomCard, RoomForm, Field, guards)
├── context/      AuthContext (session, profile, role)
├── hooks/        useRooms, useMyRoom, useFavourites
├── lib/          Supabase client, image compression, phone helpers
├── pages/
│   ├── auth/     Welcome, Login, Register
│   ├── tenant/   Home, RoomDetails, Saved
│   └── landlord/ Listings, AddRoom, EditRoom
└── types/        Shared TypeScript types
supabase/
└── schema.sql    Database schema, policies and storage setup
scripts/
└── make-icons.mjs  Generates favicon and PWA icons from the logo
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `node scripts/make-icons.mjs` | Regenerate favicon and PWA icons from `src/assets` |

## Roadmap

- [ ] Profile editing (name and phone)
- [ ] Landlord insights (saves/views per listing)
- [ ] Map view and distance to places
- [ ] In-app chat between tenants and landlords
- [ ] Multiple listings and photos per landlord
- [ ] Deployment to Vercel or Netlify

## Contributing

Contributions are welcome.

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push and open a pull request

Please use your own Supabase project for development rather than shared credentials.

## Author

Built by **Melcome** ((https://github.com/Melcome1)).

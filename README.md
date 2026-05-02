# Hunar Connect

Hunar Connect is built like a million-dollar startup product: a premium local service marketplace with lightning-fast search, elegant responsive design, and modern authentication.

This app is positioned as the go-to destination for Haroonabad residents to discover trusted workers, book local services, and manage favorites with an experience that feels polished, premium, and launch-ready.

## 🚀 Why this feels like startup-grade product

- **High-end product language**: Modern card-based marketplace layout with clean spacing, sharp typography, and premium micro-interactions.
- **Responsive by design**: Every component is optimized for mobile, tablet, and desktop, including navigation, search, cards, and profile panels.
- **Real product logic**: User sign-in, favorites, recently viewed tracking, and smart filtering mirror real marketplace behavior.
- **Scalable structure**: Component-based architecture and clear page separation make it easy to expand into a full product.

## ✨ New Features

- **Modern onboarding / auth flow** via Supabase authentication
  - Sign in and sign up flows with persistent session handling
  - Auth-aware navbar showing user email and logout
- **Responsive navigation system**
  - Single consistent navbar across the app
  - Mobile hamburger menu with dropdown actions and auth links
- **Premium hero landing experience**
  - Search-first homepage with polished CTA buttons and mobile-friendly layout
- **Smart search + filters**
  - Real-time query suggestions
  - Category, area, availability, experience, rating, and verification filters
  - Sorting options like Top rated, Most contacted, and Recently added
- **Marketplace browsing experience**
  - Responsive worker cards with hover interaction and favorite button
  - Profile side panel with detailed worker stats and contact info
  - Recently viewed and favorites support for a personalized experience
- **Component-level responsiveness**
  - All app components are designed to adapt to different screen sizes
  - Search bar, filters, cards, and profile views all work fluidly on mobile

## 🧩 What’s included

- `src/App.jsx` – Root app and routing setup
- `src/pages/HomePage.jsx` – Marketplace homepage with search, filters, listings, and profile preview
- `src/pages/AuthPage.jsx` – Authentication page for sign in / sign up
- `src/components/Navbar.jsx` – Responsive header with auth state and mobile menu
- `src/components/Hero.jsx` – Landing hero section with search and CTA actions
- `src/components/WorkerCard.jsx` – Responsive marketplace cards with favorites
- `src/components/ProfilePanel.jsx` – Worker detail preview panel
- `src/components/SearchBar.jsx` – Search input with suggestions
- `src/components/FiltersBar.jsx` – Filter controls for each dimension
- `src/lib/supabaseClient.js` – Supabase client initialization
- `src/data/mockData.js` – Demo workers, categories, areas, and stats data

## 🛠️ Tech stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Supabase JS

## 📦 Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Start the development server

```bash
npm run dev
```

4. Open the app in your browser and use the `/auth` page to sign in.

## ✅ Build

```bash
npm run build
```

## 💡 Notes for growth

This codebase is built to scale into a full startup product. The current architecture already supports:

- expanding the worker database from mock data to live Supabase data
- adding bookings, payments, and service categories
- enabling user dashboards, worker onboarding, and admin controls

If you want, I can also add next-level startup polish like onboarding flows, analytics, or a full marketplace checkout experience.

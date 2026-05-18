# Travelogue — Idea

An elegant, gamified travel tracker that lets you mark countries you've visited
on an interactive world map. Think of it as a "scratch map" for the digital age —
but smarter, more beautiful, and endlessly extensible.

## Core Concept

You open the app and see a gorgeous world map. Every country is clickable.
Tap a country to cycle through states: **not visited → visited → want to go**.
A sidebar shows your stats: how many countries visited, what percentage of the
world you've seen, and which regions you've explored most.

It's simple. It's satisfying. It's your personal travel passport.

## MVP Features (v1)

- **Interactive world map** — SVG-based, zoomable, pannable, with every
  sovereign nation represented
- **Three click states per country** — unvisited (default grey), visited
  (accent color), want to visit (pulsing highlight)
- **Stats dashboard** — visited count, completion %, regional breakdown
- **localStorage persistence** — your data lives in your browser, zero setup
- **Search** — type a country name to locate it on the map instantly
- **Quick stats view** — compact summary card at a glance

## Future Ideas (v2+)

### Depth & Granularity
- **City-level tracking** — mark individual cities visited within a country
- **Region/province maps** — e.g., US states, EU NUTS regions, Japanese
  prefectures
- **UNESCO World Heritage sites** — overlay cultural/natural landmarks
- **Airports** — track airports you've flown through

### Gamification
- **Badges & achievements** — e.g., "Euro Tripper" (30+ European countries),
  "Island Hopper", "All 7 Continents"
- **Travel streak tracking** — new countries per year / decade
- **Leaderboards** (opt-in) — compare with friends
- **Levels** — Apprentice → Explorer → Globetrotter → World Citizen

### Social & Sharing
- **Shareable travel map** — generate a PNG of your map to share
- **Trip journals** — attach notes, dates, photos to each country visit
- **Collaborative maps** — plan trips with friends, mark who's been where
- **Public profiles** — showcase your travel footprint

### Intelligence
- **Itinerary builder** — AI-suggested routes through unvisited countries
- **Visa & entry info** — at-a-glance passport requirements
- **Seasonal recommendations** — best time to visit unvisited countries
- **Carbon footprint tracker** — estimate travel emissions

### Monetization Ideas (if ever)
- **Pro tier** — city-level maps, trip journals, export, custom themes
- **Print shop** — order a physical poster of your map
- **Travel deals** — affiliate partnerships for flights/hotels to
  unvisited countries

## Design Philosophy

- **Minimalist but warm** — dark mode by default, smooth animations,
  satisfying micro-interactions
- **Globe-forward** — the map is the hero, everything else supports it
- **Zero friction** — no accounts, no onboarding, just open and click
- **Mobile-first** — works beautifully on phones and tablets

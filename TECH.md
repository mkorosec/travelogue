# Travelogue — Tech Stack

## MVP (v1)

| Layer       | Choice                      | Why                                      |
|-------------|-----------------------------|------------------------------------------|
| Framework   | React 18 + Vite             | Fast dev server, tiny builds, HMR        |
| Styling     | Tailwind CSS 4              | Utility-first, rapid iteration, modern   |
| Map         | react-simple-maps + d3-geo  | SVG world map, lightweight, interactive  |
| Map Data    | TopoJSON (world-110m)       | Compact, built-in country topology       |
| State       | React Context + useReducer  | Simple, no external deps                 |
| Persistence | localStorage                | Zero setup, instant, offline-ready       |
| Icons       | Lucide React                | Clean, consistent icon set               |
| Animations  | CSS transitions + framer-motion | Smooth micro-interactions           |
| Fonts       | Inter (UI) + system mono    | Modern, readable, variable weight        |

## Why not...

- **Next.js** → overkill for a client-only SPA with no routing
- **Leaflet/Mapbox** → requires tile API keys, heavier payload, raster
- **Redux/Zustand** → app state is simple enough for Context + useReducer
- **IndexedDB** → localStorage is simpler for key-value sets of visited countries
- **shadcn/ui** → would be nice but adds component complexity; Tailwind alone
  keeps it lean

## Potential Future Additions

| Need                | Tool                        |
|---------------------|-----------------------------|
| Database            | Supabase (Postgres + Auth)  |
| Image export        | html-to-image / dom-to-image|
| City data           | GeoJSON cities dataset      |
| Maps with tiles     | MapLibre GL (free, OSM)     |
| Backend API         | Hono or Fastify (Edge)      |
| E2E tests           | Playwright                  |

# Travelogue — Plan

## Milestone 1: MVP Core

### Phase 1 — Project Setup
- [ ] Scaffold React + Vite project with Tailwind CSS
- [ ] Set up project structure (components, hooks, utils, data)
- [ ] Add country GeoJSON/TopoJSON metadata
- [ ] Configure dark theme and base styles

### Phase 2 — The Map
- [ ] Render interactive world map using react-simple-maps
- [ ] Country click handler to toggle visited/want-to-go states
- [ ] Color-coding: unvisited (grey), visited (accent), want-to-go (subtle pulse)
- [ ] Zoom and pan controls
- [ ] Country tooltip on hover showing name and status

### Phase 3 — State & Persistence
- [ ] localStorage read/write for visited/want-to-go sets
- [ ] Custom hook: useTravelData() for state management
- [ ] Bulk actions: "Mark All", "Clear All", "Select Region"

### Phase 4 — Dashboard
- [ ] Stats sidebar/panel with visited count and world %
- [ ] Progress ring/circle visual
- [ ] Regional breakdown (continents)
- [ ] Country search with autocomplete

### Phase 5 — Polish
- [ ] Smooth transitions on country click (color morph)
- [ ] Micro-animations on stat changes (counter roll, progress fill)
- [ ] Responsive layout (sidebar collapses on mobile)
- [ ] Keyboard shortcuts (/, Esc, arrow navigation)
- [ ] Empty state: first-time experience guidance

---

## Milestone 2: Enhanced UX

- [ ] City-level tracking overlay (select cities per country)
- [ ] Trip journal — attach dates and notes to visits
- [ ] Export/share map as image
- [ ] Badges & achievement system
- [ ] Multiple travel profiles (e.g., personal, business)

## Milestone 3: Social & Cloud

- [ ] Optional account system (OAuth)
- [ ] Cloud sync for travel data
- [ ] Public profile pages
- [ ] Friend comparison view

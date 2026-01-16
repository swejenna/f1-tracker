# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Run production server (after build)
```

## Architecture

This is an F1 dashboard built with Next.js 16, TypeScript, Tailwind CSS 4, and React 19. It uses client-side rendering throughout for fast performance.

### Key Technologies
- **Next.js 16** with App Router (all routes in `app/` directory)
- **TypeScript** with strict mode enabled
- **Tailwind CSS 4** (PostCSS-based, no tailwind.config.js)
- **ESLint 9** flat config with Next.js core web vitals and TypeScript rules
- **Ergast F1 API** (`api.jolpi.ca/ergast`) for race and standings data

### Project Structure
```
app/
├── page.tsx              # Dashboard (upcoming races + driver standings)
├── calendar/page.tsx     # Full race calendar view
├── components/           # UI components (all client-side)
│   ├── BottomNav.tsx     # iOS-style bottom tab navigation
│   ├── UpcomingRaces.tsx # Next 3 races section
│   ├── DriverStandings.tsx
│   ├── RaceCard.tsx
│   ├── CalendarList.tsx
│   └── Skeleton.tsx      # Loading states
├── hooks/                # Data fetching hooks
│   ├── useRaces.ts       # Fetches race calendar
│   └── useStandings.ts   # Fetches driver standings
└── types/f1.ts           # TypeScript interfaces for API responses
```

### Design Patterns
- **Client-side rendering**: All pages use `"use client"` for CSR
- **Custom hooks**: Data fetching is abstracted into `useRaces` and `useStandings` hooks
- **iOS-style UI**: Dark theme (#000 background), card-based layout, bottom tab navigation
- **Mobile-first**: Optimized for phone viewports with safe area handling

### Path Aliases
Use `@/*` to import from the project root (e.g., `import { useRaces } from "@/app/hooks/useRaces"`).

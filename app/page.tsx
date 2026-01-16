"use client";

import { UpcomingRaces } from "./components/UpcomingRaces";
import { DriverStandings } from "./components/DriverStandings";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black px-4 pt-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">F1 Tracker</h1>
        <p className="text-sm text-zinc-500">2026 Season</p>
      </header>

      <div className="flex flex-col gap-8 max-w-lg mx-auto">
        <UpcomingRaces />
        <DriverStandings />
      </div>
    </main>
  );
}

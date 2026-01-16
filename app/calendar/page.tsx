"use client";

import { CalendarList } from "@/app/components/CalendarList";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-black px-4 pt-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white text-center">Race Calendar</h1>
        <p className="text-sm text-white text-center">2026 Upcoming Season Schedule</p>
      </header>

      <div className="max-w-lg mx-auto">
        <CalendarList />
      </div>
    </main>
  );
}

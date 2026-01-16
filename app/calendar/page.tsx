"use client";

import { CalendarList } from "@/app/components/CalendarList";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-(--background) px-4 pt-12 transition-colors duration-300">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-(--foreground) text-center">Race Calendar</h1>
        <p className="text-sm text-(--muted) text-center">2026 Upcoming Season Schedule</p>
      </header>

      <div className="max-w-lg mx-auto">
        <CalendarList />
      </div>
    </main>
  );
}

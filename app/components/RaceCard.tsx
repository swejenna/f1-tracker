"use client";

import type { Race } from "@/app/types/f1";

interface RaceCardProps {
  race: Race;
  isNext?: boolean;
}

export function RaceCard({ race, isNext = false }: RaceCardProps) {
  const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
  const isSprint = !!race.Sprint;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fullDateTimeString = raceDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <article
      className={`rounded-2xl p-4 border transition-all duration-200 focus-within:ring-2 focus-within:ring-red-500 ${
        isNext
          ? "bg-red-950/30 border-red-900/50 hover:bg-red-950/50 hover:border-red-800"
          : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
      }`}
      aria-label={`${race.raceName}, Round ${race.round}${isSprint ? ", Sprint weekend" : ""}, ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}, ${fullDateTimeString}${isNext ? ", Next race" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Round {race.round}
        </span>
        {isSprint && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400"
            aria-label="Sprint weekend"
          >
            Sprint
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">
        {race.raceName}
      </h3>

      <p className="text-sm text-zinc-400 mb-3">
        {race.Circuit.Location.locality}, {race.Circuit.Location.country}
      </p>

      <div className="flex items-center gap-2 text-sm">
        <svg
          className="w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <time dateTime={raceDate.toISOString()} className="text-zinc-300">
          {formatDate(raceDate)} at {formatTime(raceDate)}
        </time>
      </div>
    </article>
  );
}

"use client";

import { useRaces } from "@/app/hooks/useRaces";
import { RaceCardSkeleton } from "./Skeleton";
import type { Race } from "@/app/types/f1";

interface GroupedRaces {
  [month: string]: Race[];
}

export function CalendarList() {
  const { races, upcomingRaces, loading, error } = useRaces();

  if (error) {
    return (
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4" role="alert">
        <p className="text-red-400 text-sm">Failed to load calendar: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div aria-busy="true" aria-label="Loading race calendar">
        <div className="flex flex-col gap-3">
          <RaceCardSkeleton />
          <RaceCardSkeleton />
          <RaceCardSkeleton />
          <RaceCardSkeleton />
        </div>
      </div>
    );
  }

  const nextRaceRound = upcomingRaces[0]?.round;

  const groupedRaces = races.reduce<GroupedRaces>((acc, race) => {
    const date = new Date(race.date);
    const monthKey = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(race);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6" role="list" aria-label="2026 Formula 1 race calendar">
      {Object.entries(groupedRaces).map(([month, monthRaces]) => (
        <section key={month} aria-labelledby={`month-${month.replace(/\s/g, "-")}`}>
          <h3
            id={`month-${month.replace(/\s/g, "-")}`}
            className="text-sm font-semibold text-(--muted) uppercase tracking-wider mb-3 px-1"
          >
            {month}
          </h3>
          <ul className="flex flex-col gap-2" role="list">
            {monthRaces.map((race) => {
              const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
              const isPast = raceDate < new Date();
              const isNext = race.round === nextRaceRound;
              const isSprint = !!race.Sprint;

              const fullDateString = raceDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const statusText = isPast
                ? "Completed"
                : isNext
                ? "Next race"
                : "Upcoming";

              return (
                <li
                  key={race.round}
                  className={`rounded-xl p-3 border transition-all duration-200 focus-within:ring-2 focus-within:ring-red-500 ${
                    isNext
                      ? "bg-red-950/30 border-red-900/50 hover:bg-red-950/50 hover:border-red-800"
                      : isPast
                      ? "bg-(--card-bg)/50 border-(--card-border)/50 hover:bg-(--card-hover)/50 hover:border-(--card-border-hover)/50"
                      : "bg-(--card-bg) border-(--card-border) hover:bg-(--card-hover) hover:border-(--card-border-hover)"
                  }`}
                  aria-label={`Round ${race.round}: ${race.raceName}, ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}, ${fullDateString}${isSprint ? ", Sprint weekend" : ""}, ${statusText}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 text-center ${isPast ? "opacity-50" : ""}`}
                      aria-hidden="true"
                    >
                      <p className="text-xs text-(--muted) uppercase">
                        {raceDate.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isNext ? "text-red-400" : "text-(--foreground)"
                        }`}
                      >
                        {raceDate.getDate()}
                      </p>
                    </div>
                    <div className={`flex-1 min-w-0 ${isPast ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium truncate ${
                            isNext ? "text-(--foreground)" : isPast ? "text-(--muted)" : "text-(--foreground)"
                          }`}
                        >
                          {race.raceName}
                        </p>
                        {isSprint && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 shrink-0"
                            aria-hidden="true"
                          >
                            Sprint
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-(--muted) truncate">
                        {race.Circuit.Location.locality},{" "}
                        {race.Circuit.Location.country}
                      </p>
                    </div>
                    {isNext && (
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400 shrink-0"
                        aria-hidden="true"
                      >
                        Next
                      </span>
                    )}
                    {isPast && (
                      <svg
                        className="w-5 h-5 text-green-500 shrink-0 opacity-50"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

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
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4">
        <p className="text-red-400 text-sm">Failed to load calendar: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <RaceCardSkeleton />
        <RaceCardSkeleton />
        <RaceCardSkeleton />
        <RaceCardSkeleton />
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
    <div className="flex flex-col gap-6">
      {Object.entries(groupedRaces).map(([month, monthRaces]) => (
        <section key={month}>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">
            {month}
          </h3>
          <div className="flex flex-col gap-2">
            {monthRaces.map((race) => {
              const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
              const isPast = raceDate < new Date();
              const isNext = race.round === nextRaceRound;
              const isSprint = !!race.Sprint;

              return (
                <div
                  key={race.round}
                  className={`rounded-xl p-3 border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    isNext
                      ? "bg-red-950/30 border-red-900/50 hover:bg-red-950/50 hover:border-red-800"
                      : isPast
                      ? "bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 text-center ${
                        isPast ? "opacity-50" : ""
                      }`}
                    >
                      <p className="text-xs text-zinc-500 uppercase">
                        {raceDate.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isNext ? "text-red-400" : "text-white"
                        }`}
                      >
                        {raceDate.getDate()}
                      </p>
                    </div>
                    <div className={`flex-1 min-w-0 ${isPast ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium truncate ${
                            isNext ? "text-white" : isPast ? "text-zinc-400" : "text-white"
                          }`}
                        >
                          {race.raceName}
                        </p>
                        {isSprint && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 shrink-0">
                            Sprint
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {race.Circuit.Location.locality},{" "}
                        {race.Circuit.Location.country}
                      </p>
                    </div>
                    {isNext && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400 shrink-0">
                        Next
                      </span>
                    )}
                    {isPast && (
                      <svg
                        className="w-5 h-5 text-green-500 shrink-0 opacity-50"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

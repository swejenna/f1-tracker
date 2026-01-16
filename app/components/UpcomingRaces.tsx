"use client";

import { useRaces } from "@/app/hooks/useRaces";
import { RaceCard } from "./RaceCard";
import { RaceCardSkeleton } from "./Skeleton";

export function UpcomingRaces() {
  const { upcomingRaces, loading, error } = useRaces();
  const displayRaces = upcomingRaces.slice(0, 3);

  if (error) {
    return (
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4">
        <p className="text-red-400 text-sm">Failed to load races: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4">Upcoming Races</h2>
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <RaceCardSkeleton />
            <RaceCardSkeleton />
            <RaceCardSkeleton />
          </>
        ) : displayRaces.length > 0 ? (
          displayRaces.map((race, index) => (
            <RaceCard key={race.round} race={race} isNext={index === 0} />
          ))
        ) : (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <p className="text-zinc-400 text-sm">No upcoming races scheduled</p>
          </div>
        )}
      </div>
    </section>
  );
}

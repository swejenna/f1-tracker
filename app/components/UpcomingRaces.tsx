"use client";

import { useRaces } from "@/app/hooks/useRaces";
import { RaceCard } from "./RaceCard";
import { RaceCardSkeleton } from "./Skeleton";

export function UpcomingRaces() {
  const { upcomingRaces, loading, error } = useRaces();
  const displayRaces = upcomingRaces.slice(0, 3);

  if (error) {
    return (
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4" role="alert">
        <p className="text-red-400 text-sm">Failed to load races: {error}</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="upcoming-races-heading">
      <h2 id="upcoming-races-heading" className="text-xl font-semibold text-(--foreground) mb-4">
        Upcoming Races
      </h2>

      {loading ? (
        <div aria-busy="true" aria-label="Loading upcoming races">
          <div className="flex flex-col gap-3">
            <RaceCardSkeleton />
            <RaceCardSkeleton />
            <RaceCardSkeleton />
          </div>
        </div>
      ) : displayRaces.length > 0 ? (
        <div className="flex flex-col gap-3" role="list" aria-label="Next 3 upcoming Formula 1 races">
          {displayRaces.map((race, index) => (
            <div key={race.round} role="listitem">
              <RaceCard race={race} isNext={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-(--card-bg) border border-(--card-border) p-4">
          <p className="text-(--muted) text-sm">No upcoming races scheduled</p>
        </div>
      )}
    </section>
  );
}

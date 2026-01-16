"use client";

import { useStandings } from "@/app/hooks/useStandings";
import { StandingRowSkeleton } from "./Skeleton";

const teamColors: Record<string, string> = {
  red_bull: "bg-blue-600",
  ferrari: "bg-red-600",
  mercedes: "bg-teal-500",
  mclaren: "bg-orange-500",
  aston_martin: "bg-green-700",
  alpine: "bg-pink-500",
  williams: "bg-blue-400",
  rb: "bg-blue-500",
  sauber: "bg-green-500",
  haas: "bg-gray-400",
};

export function DriverStandings() {
  const { standings, season, round, isCurrentSeason, loading, error } = useStandings();

  const getSeasonLabel = () => {
    if (!season) return "";
    if (isCurrentSeason && round) {
      return `Round ${round}`;
    }
    return `${season} Final`;
  };

  if (error) {
    return (
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4">
        <p className="text-red-400 text-sm">Failed to load standings: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Driver Standings</h2>
        <span className="text-xs text-zinc-500">{getSeasonLabel()}</span>
      </div>
      <div className="flex flex-col gap-2">
        {loading ? (
          <>
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
          </>
        ) : (
          standings.map((standing) => {
            const teamId = standing.Constructors[0]?.constructorId || "";
            const teamColor = teamColors[teamId] || "bg-zinc-600";

            return (
              <div
                key={standing.Driver.driverId}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-all duration-200 cursor-pointer hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98]"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${teamColor}`}
                >
                  {standing.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {standing.Driver.givenName} {standing.Driver.familyName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {standing.Constructors[0]?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{standing.points}</p>
                  <p className="text-xs text-zinc-500">pts</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

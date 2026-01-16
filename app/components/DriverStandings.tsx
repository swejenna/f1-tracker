"use client";

import { useStandings } from "@/app/hooks/useStandings";
import { StandingRowSkeleton } from "./Skeleton";

function PositionChangeIndicator({ change }: { change?: number | null }) {
  if (change === null || change === undefined) {
    return (
      <div className="w-8 flex items-center justify-center" aria-label="New driver">
        <span className="text-[10px] font-semibold text-blue-400" aria-hidden="true">NEW</span>
        <span className="sr-only">New driver this season</span>
      </div>
    );
  }

  if (change === 0) {
    return (
      <div className="w-8 flex items-center justify-center" aria-label="No position change">
        <span className="text-zinc-500" aria-hidden="true">—</span>
        <span className="sr-only">No change in position</span>
      </div>
    );
  }

  if (change > 0) {
    return (
      <div className="w-8 flex items-center justify-center gap-0.5" aria-label={`Up ${change} positions`}>
        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-medium text-green-500" aria-hidden="true">{change}</span>
        <span className="sr-only">Up {change} positions from last season</span>
      </div>
    );
  }

  return (
    <div className="w-8 flex items-center justify-center gap-0.5" aria-label={`Down ${Math.abs(change)} positions`}>
      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-medium text-red-500" aria-hidden="true">{Math.abs(change)}</span>
      <span className="sr-only">Down {Math.abs(change)} positions from last season</span>
    </div>
  );
}

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
      <div className="rounded-2xl bg-red-950/20 border border-red-900/50 p-4" role="alert">
        <p className="text-red-400 text-sm">Failed to load standings: {error}</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="standings-heading">
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="standings-heading" className="text-xl font-semibold text-(--foreground)">
          Driver Standings
        </h2>
        <span className="text-xs text-(--muted)">{getSeasonLabel()}</span>
      </div>

      {loading ? (
        <div aria-busy="true" aria-label="Loading driver standings">
          <div className="flex flex-col gap-2">
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
            <StandingRowSkeleton />
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" role="list" aria-label="Driver championship standings">
          {standings.map((standing) => {
            const teamId = standing.Constructors[0]?.constructorId || "";
            const teamColor = teamColors[teamId] || "bg-zinc-600";
            const driverName = `${standing.Driver.givenName} ${standing.Driver.familyName}`;
            const teamName = standing.Constructors[0]?.name || "Unknown Team";

            return (
              <li
                key={standing.Driver.driverId}
                className="flex items-center gap-3 p-3 rounded-xl bg-(--card-bg) border border-(--card-border) transition-all duration-200 hover:bg-(--card-hover) hover:border-(--card-border-hover) focus-within:ring-2 focus-within:ring-red-500"
                aria-label={`Position ${standing.position}: ${driverName}, ${teamName}, ${standing.points} points`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${teamColor}`}
                  aria-hidden="true"
                >
                  {standing.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-(--foreground) font-medium truncate">
                    {driverName}
                  </p>
                  <p className="text-xs text-(--muted) truncate">
                    {teamName}
                  </p>
                </div>
                <PositionChangeIndicator change={standing.positionChange} />
                <div className="text-right min-w-[40px]">
                  <p className="text-(--foreground) font-semibold">{standing.points}</p>
                  <p className="text-xs text-(--muted)">pts</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

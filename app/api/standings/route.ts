import { NextResponse } from "next/server";

const API_BASE = "https://api.jolpi.ca/ergast/f1";
const CURRENT_SEASON = "2026";
const PREVIOUS_SEASON = "2025";

// First race of 2026 season: Australian GP on March 8, 2026
const SEASON_START_DATE = new Date("2026-03-08T04:00:00Z");

async function fetchStandings(season: string) {
  const response = await fetch(`${API_BASE}/${season}/driverStandings.json`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${season} standings`);
  }

  const data = await response.json();
  const standingsList = data.MRData?.StandingsTable?.StandingsLists?.[0];

  return {
    standings: standingsList?.DriverStandings || [],
    season: standingsList?.season || season,
    round: standingsList?.round || null,
  };
}

export async function GET() {
  try {
    const now = new Date();
    const seasonStarted = now >= SEASON_START_DATE;

    if (seasonStarted) {
      // Try current season first
      const currentData = await fetchStandings(CURRENT_SEASON);

      // If current season has standings, return them
      if (currentData.standings.length > 0) {
        return NextResponse.json({
          ...currentData,
          isCurrentSeason: true,
        });
      }

      // Fall back to previous season if no data yet
      const previousData = await fetchStandings(PREVIOUS_SEASON);
      return NextResponse.json({
        ...previousData,
        isCurrentSeason: false,
      });
    }

    // Season hasn't started, show previous season
    const previousData = await fetchStandings(PREVIOUS_SEASON);
    return NextResponse.json({
      ...previousData,
      isCurrentSeason: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

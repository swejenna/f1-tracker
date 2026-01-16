import { NextResponse } from "next/server";

const API_BASE = "https://api.jolpi.ca/ergast/f1";
const CURRENT_SEASON = "2026";
const PREVIOUS_SEASON = "2025";

// First race of 2026 season: Australian GP on March 8, 2026
const SEASON_START_DATE = new Date("2026-03-08T04:00:00Z");

interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructors: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  }[];
}

interface StandingsWithChange extends DriverStanding {
  positionChange: number | null; // positive = moved up, negative = moved down, null = new driver
}

async function fetchStandings(season: string): Promise<{
  standings: DriverStanding[];
  season: string;
  round: string | null;
}> {
  const response = await fetch(`${API_BASE}/${season}/driverStandings.json`, {
    next: { revalidate: 300 },
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

function calculatePositionChanges(
  currentStandings: DriverStanding[],
  previousStandings: DriverStanding[]
): StandingsWithChange[] {
  // Create a map of driver positions from previous season
  const previousPositions = new Map<string, number>();
  previousStandings.forEach((standing) => {
    previousPositions.set(standing.Driver.driverId, parseInt(standing.position));
  });

  return currentStandings.map((standing) => {
    const currentPosition = parseInt(standing.position);
    const previousPosition = previousPositions.get(standing.Driver.driverId);

    let positionChange: number | null = null;
    if (previousPosition !== undefined) {
      // Positive = moved up (e.g., was 5th, now 3rd = +2)
      positionChange = previousPosition - currentPosition;
    }

    return {
      ...standing,
      positionChange,
    };
  });
}

export async function GET() {
  try {
    const now = new Date();
    const seasonStarted = now >= SEASON_START_DATE;

    // Always fetch previous season for comparison
    const previousData = await fetchStandings(PREVIOUS_SEASON);

    if (seasonStarted) {
      // Try current season first
      const currentData = await fetchStandings(CURRENT_SEASON);

      if (currentData.standings.length > 0) {
        // Current season has data - compare to previous season
        const standingsWithChanges = calculatePositionChanges(
          currentData.standings,
          previousData.standings
        );

        return NextResponse.json({
          standings: standingsWithChanges,
          season: currentData.season,
          round: currentData.round,
          isCurrentSeason: true,
          comparisonSeason: PREVIOUS_SEASON,
        });
      }
    }

    // Season hasn't started or no data yet
    // For previous season final, compare to the season before that (2024)
    let olderSeasonStandings: DriverStanding[] = [];
    try {
      const olderData = await fetchStandings("2024");
      olderSeasonStandings = olderData.standings;
    } catch {
      // If 2024 data not available, just show without changes
    }

    const standingsWithChanges = calculatePositionChanges(
      previousData.standings,
      olderSeasonStandings
    );

    return NextResponse.json({
      standings: standingsWithChanges,
      season: previousData.season,
      round: previousData.round,
      isCurrentSeason: false,
      comparisonSeason: "2024",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

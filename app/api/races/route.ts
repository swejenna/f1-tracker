import { NextResponse } from "next/server";

const API_BASE = "https://api.jolpi.ca/ergast/f1";
const SEASON = "2026";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/${SEASON}/races.json`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch races" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const races = data.MRData?.RaceTable?.Races || [];

    return NextResponse.json({ races });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

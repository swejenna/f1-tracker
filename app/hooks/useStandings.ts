"use client";

import { useState, useEffect } from "react";
import type { DriverStanding } from "@/app/types/f1";

interface StandingsData {
  standings: DriverStanding[];
  season: string | null;
  round: string | null;
  isCurrentSeason: boolean;
}

export function useStandings() {
  const [data, setData] = useState<StandingsData>({
    standings: [],
    season: null,
    round: null,
    isCurrentSeason: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const response = await fetch("/api/standings");
        if (!response.ok) throw new Error("Failed to fetch standings");
        const result = await response.json();
        setData({
          standings: result.standings || [],
          season: result.season || null,
          round: result.round || null,
          isCurrentSeason: result.isCurrentSeason || false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, []);

  return {
    standings: data.standings,
    season: data.season,
    round: data.round,
    isCurrentSeason: data.isCurrentSeason,
    loading,
    error,
  };
}

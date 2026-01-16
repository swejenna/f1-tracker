"use client";

import { useState, useEffect } from "react";
import type { Race } from "@/app/types/f1";

export function useRaces() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRaces() {
      try {
        const response = await fetch("/api/races");
        if (!response.ok) throw new Error("Failed to fetch races");
        const data = await response.json();
        setRaces(data.races || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchRaces();
  }, []);

  const upcomingRaces = races.filter((race) => {
    const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
    return raceDate > new Date();
  });

  return { races, upcomingRaces, loading, error };
}

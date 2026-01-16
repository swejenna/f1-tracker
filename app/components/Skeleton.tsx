"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-800/50 ${className}`}
      aria-hidden="true"
    />
  );
}

export function RaceCardSkeleton() {
  return (
    <div
      className="rounded-2xl bg-zinc-900 p-4 border border-zinc-800"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

export function StandingRowSkeleton() {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
      role="presentation"
      aria-hidden="true"
    >
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-12" />
    </div>
  );
}

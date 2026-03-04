"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Movie card skeleton */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Poster skeleton */}
          <div className="md:w-72 flex-shrink-0 h-64 md:h-auto min-h-[300px] bg-cinema-deep relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cinema-border/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
          </div>

          {/* Details skeleton */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-5">
            {/* Genres */}
            <div className="flex gap-2">
              <SkeletonBlock width="w-16" height="h-6" rounded="rounded-full" />
              <SkeletonBlock width="w-20" height="h-6" rounded="rounded-full" />
              <SkeletonBlock width="w-14" height="h-6" rounded="rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <SkeletonBlock width="w-3/4" height="h-8" />
              <SkeletonBlock width="w-1/2" height="h-5" />
            </div>

            {/* Plot */}
            <div className="space-y-2">
              <SkeletonBlock width="w-full" height="h-4" />
              <SkeletonBlock width="w-full" height="h-4" />
              <SkeletonBlock width="w-2/3" height="h-4" />
            </div>

            {/* Ratings */}
            <div className="flex gap-4">
              <SkeletonBlock width="w-28" height="h-12" rounded="rounded-xl" />
              <SkeletonBlock width="w-20" height="h-12" rounded="rounded-xl" />
            </div>

            {/* Cast */}
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} width="w-24" height="h-8" rounded="rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis skeleton */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-cinema-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock width="w-28" height="h-7" rounded="rounded-full" />
            <SkeletonBlock width="w-40" height="h-6" className="hidden sm:block" />
          </div>
          <SkeletonBlock width="w-24" height="h-8" rounded="rounded-full" />
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Generating AI label */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cinema-gold/30 border-t-cinema-gold rounded-full animate-spin flex-shrink-0" />
            <span className="text-cinema-gold text-sm font-mono animate-pulse">
              Generating AI insights…
            </span>
          </div>

          {/* Summary lines */}
          <div className="space-y-2">
            <SkeletonBlock width="w-full" height="h-4" />
            <SkeletonBlock width="w-full" height="h-4" />
            <SkeletonBlock width="w-3/4" height="h-4" />
          </div>

          {/* Quote block */}
          <SkeletonBlock width="w-full" height="h-24" rounded="rounded-2xl" />

          {/* Confidence bar */}
          <div className="space-y-2">
            <SkeletonBlock width="w-32" height="h-3" />
            <SkeletonBlock width="w-full" height="h-2" rounded="rounded-full" />
          </div>

          {/* Themes */}
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} width="w-20" height="h-8" rounded="rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonBlockProps {
  width: string;
  height: string;
  rounded?: string;
  className?: string;
}

function SkeletonBlock({
  width,
  height,
  rounded = "rounded-lg",
  className = "",
}: SkeletonBlockProps) {
  return (
    <div
      className={`relative overflow-hidden bg-cinema-deep ${width} ${height} ${rounded} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cinema-border/30 to-transparent animate-shimmer bg-[length:200%_100%]" />
    </div>
  );
}

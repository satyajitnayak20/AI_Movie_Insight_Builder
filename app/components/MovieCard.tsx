"use client";

import Image from "next/image";
import { MovieData } from "@/app/lib/types";
import {
  hasValidPoster,
  parseCast,
  parseGenres,
  getRatingColor,
  formatNumber,
} from "@/app/lib/utils";

interface MovieCardProps {
  movie: MovieData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const cast = parseCast(movie.Actors);
  const genres = parseGenres(movie.Genre);
  const ratingColor = getRatingColor(movie.imdbRating);

  return (
    <div className="w-full animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          <div className="relative md:w-72 flex-shrink-0">
            {hasValidPoster(movie) ? (
              <div className="relative h-64 md:h-full min-h-[300px]">
                <Image
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 288px"
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-surface/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-cinema-surface/60" />
              </div>
            ) : (
              <div className="h-64 md:h-full min-h-[300px] bg-cinema-deep flex items-center justify-center">
                <div className="text-center text-cinema-dim">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2 opacity-30">
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <p className="text-xs font-mono">No Poster</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-5">
            {/* Header */}
            <div>
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-3">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-cinema-gold/20 text-cinema-gold bg-cinema-gold/5"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cinema-text leading-tight">
                {movie.Title}
              </h2>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-cinema-muted text-sm font-body">
                <span>{movie.Year}</span>
                <span className="text-cinema-dim">·</span>
                <span>{movie.Runtime}</span>
                <span className="text-cinema-dim">·</span>
                <span className="border border-cinema-border px-2 py-0.5 rounded text-xs">
                  {movie.Rated}
                </span>
              </div>
            </div>

            {/* Plot */}
            <p className="text-cinema-muted text-sm leading-relaxed font-body line-clamp-4">
              {movie.Plot}
            </p>

            {/* Ratings row */}
            <div className="flex flex-wrap gap-4">
              {/* IMDb */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-cinema-gold/10 border border-cinema-gold/20 rounded-xl px-4 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-cinema-gold">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className={`font-display text-xl font-bold ${ratingColor}`}>
                    {movie.imdbRating}
                  </span>
                  <span className="text-cinema-dim text-xs">/10</span>
                </div>
                <div className="text-cinema-dim text-xs font-mono">
                  {formatNumber(movie.imdbVotes)} votes
                </div>
              </div>

              {/* Metascore */}
              {movie.Metascore && movie.Metascore !== "N/A" && (
                <div className="flex items-center gap-2">
                  <div
                    className={`font-display text-xl font-bold px-3 py-1.5 rounded-xl ${
                      parseInt(movie.Metascore) >= 75
                        ? "bg-cinema-emerald/20 text-cinema-emerald"
                        : parseInt(movie.Metascore) >= 50
                        ? "bg-cinema-amber/20 text-cinema-amber"
                        : "bg-cinema-crimson/20 text-cinema-crimson"
                    }`}
                  >
                    {movie.Metascore}
                  </div>
                  <span className="text-cinema-dim text-xs font-mono">Metascore</span>
                </div>
              )}
            </div>

            {/* Cast */}
            <div>
              <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest mb-3">
                Cast
              </p>
              <div className="flex flex-wrap gap-2">
                {cast.map((actor) => (
                  <span
                    key={actor}
                    className="text-sm font-body text-cinema-muted bg-cinema-deep border border-cinema-border px-3 py-1.5 rounded-full hover:border-cinema-border hover:text-cinema-text transition-colors duration-200"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Director + Awards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-cinema-border">
              <div>
                <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest mb-1">
                  Director
                </p>
                <p className="text-cinema-text text-sm font-body">{movie.Director}</p>
              </div>
              {movie.Awards && movie.Awards !== "N/A" && (
                <div>
                  <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest mb-1">
                    Awards
                  </p>
                  <p className="text-cinema-muted text-sm font-body leading-snug">
                    {movie.Awards}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

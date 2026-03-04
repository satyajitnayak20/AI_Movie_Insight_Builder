// Utility functions for movie data fetching and validation

import { MovieData, SentimentResult } from "./types";

/**
 * Validates an IMDb movie ID format (e.g., tt0133093)
 */
export function validateImdbId(id: string): boolean {
  const trimmed = id.trim();
  return /^tt\d{7,8}$/.test(trimmed);
}

/**
 * Formats a number string with commas (e.g., "1234567" -> "1,234,567")
 */
export function formatNumber(numStr: string): string {
  const num = parseInt(numStr.replace(/,/g, ""), 10);
  if (isNaN(num)) return numStr;
  return num.toLocaleString();
}

/**
 * Parses IMDb rating to a percentage for display
 */
export function ratingToPercent(rating: string): number {
  const num = parseFloat(rating);
  if (isNaN(num)) return 0;
  return (num / 10) * 100;
}

/**
 * Returns color class based on IMDb rating
 */
export function getRatingColor(rating: string): string {
  const num = parseFloat(rating);
  if (isNaN(num)) return "text-cinema-dim";
  if (num >= 7.5) return "text-cinema-gold";
  if (num >= 6.0) return "text-cinema-amber";
  return "text-cinema-crimson";
}

/**
 * Returns sentiment color config based on sentiment label
 */
export function getSentimentConfig(
  sentiment: SentimentResult["sentiment"]
): { color: string; bg: string; border: string; label: string; emoji: string } {
  switch (sentiment) {
    case "positive":
      return {
        color: "text-cinema-emerald",
        bg: "bg-cinema-emerald/10",
        border: "border-cinema-emerald/30",
        label: "Positive",
        emoji: "★",
      };
    case "negative":
      return {
        color: "text-cinema-crimson",
        bg: "bg-cinema-crimson/10",
        border: "border-cinema-crimson/30",
        label: "Negative",
        emoji: "✗",
      };
    case "mixed":
    default:
      return {
        color: "text-cinema-amber",
        bg: "bg-cinema-amber/10",
        border: "border-cinema-amber/30",
        label: "Mixed",
        emoji: "◈",
      };
  }
}

/**
 * Truncates text to a given length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Extracts cast array from comma-separated actors string
 */
export function parseCast(actors: string): string[] {
  return actors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

/**
 * Parses genre string into array
 */
export function parseGenres(genre: string): string[] {
  return genre
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

/**
 * Checks if a poster URL is valid (not the N/A placeholder)
 */
export function hasValidPoster(movie: MovieData): boolean {
  return Boolean(movie.Poster && movie.Poster !== "N/A");
}

/**
 * Determines overall sentiment from imdb + metascore data
 * Used as a fallback / signal for AI prompt enrichment
 */
export function deriveSentimentHint(movie: MovieData): string {
  const imdb = parseFloat(movie.imdbRating);
  const meta = parseInt(movie.Metascore, 10);

  const signals: string[] = [];

  if (!isNaN(imdb)) {
    if (imdb >= 8.0) signals.push("highly praised by audiences");
    else if (imdb >= 6.5) signals.push("generally well-received by audiences");
    else if (imdb >= 5.0) signals.push("received mixed audience reactions");
    else signals.push("received poor audience reception");
  }

  if (!isNaN(meta)) {
    if (meta >= 75) signals.push("critically acclaimed");
    else if (meta >= 60) signals.push("mixed-to-positive critical reception");
    else if (meta >= 40) signals.push("mixed critical reception");
    else signals.push("poor critical reception");
  }

  return signals.join(" and ");
}

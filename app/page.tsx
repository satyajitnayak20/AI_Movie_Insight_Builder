"use client";

import { useState, useRef, useCallback } from "react";
import SearchInput from "./components/SearchInput";
import MovieCard from "./components/MovieCard";
import SentimentPanel from "./components/SentimentPanel";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorMessage from "./components/ErrorMessage";
import { MovieData, SentimentResult } from "./lib/types";

type AppState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [lastId, setLastId] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  /**
   * Orchestrates the fetch: movie details first, then AI sentiment in parallel (after movie fetched)
   */
  const handleSearch = useCallback(async (imdbId: string) => {
    setAppState("loading");
    setMovie(null);
    setSentiment(null);
    setErrorMsg("");
    setLastId(imdbId);

    try {
      // Step 1: Fetch movie details
      const movieRes = await fetch(`/api/movie?id=${imdbId}`);
      const movieData: MovieData & { error?: string } = await movieRes.json();

      if (!movieRes.ok || movieData.error) {
        throw new Error(movieData.error || "Failed to fetch movie.");
      }

      setMovie(movieData);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      // Step 2: Fetch AI sentiment in parallel (non-blocking for UX — movie shows first)
      const sentimentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movieData }),
      });

      const sentimentData: SentimentResult & { error?: string } = await sentimentRes.json();

      if (!sentimentRes.ok || sentimentData.error) {
        throw new Error(sentimentData.error || "Failed to generate AI insights.");
      }

      setSentiment(sentimentData);
      setAppState("success");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setAppState("error");
    }
  }, []);

  const handleRetry = () => {
    if (lastId) handleSearch(lastId);
  };

  return (
    <main className="min-h-screen bg-cinema-black text-cinema-text font-body">
      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cinema-gold/[0.03] rounded-full blur-[120px]" />
        {/* Film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
        {/* Horizontal rule lines */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 4px)",
        }} />
      </div>

      {/* Film strip sides */}
      <div className="fixed left-0 top-0 bottom-0 w-5 opacity-20 flex flex-col justify-around pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-3 h-2 mx-auto bg-cinema-border rounded-sm" />
        ))}
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-5 opacity-20 flex flex-col justify-around pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-3 h-2 mx-auto bg-cinema-border rounded-sm" />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Hero header */}
        <header className="text-center mb-14 animate-fade-up">
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-cinema-gold/50" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cinema-gold/20 bg-cinema-gold/5">
              <span className="text-cinema-gold font-mono text-xs uppercase tracking-[0.3em]">
                AI · Powered
              </span>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-cinema-gold/50" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-cinema-text tracking-tight leading-none mb-4">
            Movie
            <span className="text-cinema-gold"> Insight</span>
            <br />
            <span className="text-cinema-muted font-light text-4xl md:text-5xl">Builder</span>
          </h1>

          <p className="text-cinema-muted text-base md:text-lg max-w-xl mx-auto font-body leading-relaxed mt-5">
            Enter any IMDb movie ID to instantly unlock AI-powered sentiment analysis,
            audience insights, and cinematic intelligence.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-cinema-border" />
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-cinema-gold/40" />
              ))}
            </div>
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-cinema-border" />
          </div>
        </header>

        {/* Search */}
        <section
          className="animate-fade-up mb-14"
          style={{ animationDelay: "0.15s", animationFillMode: "both" }}
        >
          <SearchInput
            onSearch={handleSearch}
            isLoading={appState === "loading"}
          />
        </section>

        {/* Results */}
        <div ref={resultsRef}>
          {appState === "loading" && <LoadingSkeleton />}

          {appState === "error" && (
            <ErrorMessage message={errorMsg} onRetry={handleRetry} />
          )}

          {(appState === "success" || (appState === "loading" && movie)) && movie && (
            <div className="space-y-6">
              <MovieCard movie={movie} />
              {sentiment ? (
                <SentimentPanel sentiment={sentiment} movieTitle={movie.Title} />
              ) : (
                // Sentiment still loading
                <div className="rounded-3xl border border-cinema-border bg-cinema-surface p-8 flex items-center gap-4 animate-fade-in">
                  <div className="w-6 h-6 border-2 border-cinema-gold/30 border-t-cinema-gold rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-cinema-text font-display text-sm font-semibold">
                      Generating AI Insights
                    </p>
                    <p className="text-cinema-dim text-xs font-body mt-0.5">
                      Claude is analyzing audience sentiment…
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Idle state hint */}
        {appState === "idle" && (
          <div
            className="text-center mt-6 animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <div className="inline-flex flex-col items-center gap-3 text-cinema-dim">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                className="opacity-30"
              >
                <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14" />
                <rect x="1" y="6" width="14" height="12" rx="2" />
              </svg>
              <p className="text-xs font-mono uppercase tracking-widest opacity-50">
                Results appear here
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-cinema-border text-center">
          <p className="text-cinema-dim text-xs font-mono">
            Powered by{" "}
            <span className="text-cinema-gold">OMDb API</span>
            {" "}·{" "}
            <span className="text-cinema-gold">Claude AI</span>
            {" · "}
            Built with Next.js
          </p>
        </footer>
      </div>
    </main>
  );
}

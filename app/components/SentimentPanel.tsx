"use client";

import { SentimentResult } from "@/app/lib/types";
import { getSentimentConfig } from "@/app/lib/utils";

interface SentimentPanelProps {
  sentiment: SentimentResult;
  movieTitle: string;
}

export default function SentimentPanel({ sentiment, movieTitle }: SentimentPanelProps) {
  const config = getSentimentConfig(sentiment.sentiment);
  const confidencePct = Math.round(sentiment.confidence * 100);

  return (
    <div
      className="w-full animate-fade-up"
      style={{ animationDelay: "0.25s", animationFillMode: "both" }}
    >
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface overflow-hidden">
        {/* Panel header */}
        <div className="px-6 md:px-8 py-5 border-b border-cinema-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* AI badge */}
            <div className="flex items-center gap-2 bg-cinema-deep border border-cinema-border rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cinema-gold animate-pulse" />
              <span className="text-xs font-mono text-cinema-gold uppercase tracking-widest">
                AI Insight
              </span>
            </div>
            <h3 className="font-display text-cinema-text text-lg font-semibold hidden sm:block">
              Audience Sentiment
            </h3>
          </div>

          {/* Overall sentiment badge */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border}`}
          >
            <span className={`text-lg leading-none ${config.color}`}>{config.emoji}</span>
            <span className={`font-display text-sm font-bold tracking-wide ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-7">
          {/* Summary */}
          <div>
            <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest mb-3">
              AI Summary
            </p>
            <p className="text-cinema-text text-base leading-relaxed font-body">
              {sentiment.summary}
            </p>
          </div>

          {/* Audience quote */}
          <div className={`rounded-2xl border ${config.border} ${config.bg} p-5`}>
            <div className="flex gap-3">
              <span className={`font-display text-4xl leading-none ${config.color} opacity-60 mt-1`}>
                "
              </span>
              <p className="text-cinema-text font-body italic text-sm leading-relaxed flex-1">
                {sentiment.audienceQuote.replace(/^"|"$/g, "")}
              </p>
            </div>
            <p className="text-cinema-dim text-xs font-mono mt-3 ml-8">
              — Audience representative voice
            </p>
          </div>

          {/* Confidence meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest">
                Confidence Score
              </p>
              <span className={`font-display text-sm font-bold ${config.color}`}>
                {confidencePct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-cinema-deep overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  sentiment.sentiment === "positive"
                    ? "bg-cinema-emerald"
                    : sentiment.sentiment === "negative"
                    ? "bg-cinema-crimson"
                    : "bg-cinema-amber"
                }`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          {/* Key themes */}
          <div>
            <p className="text-cinema-dim text-xs font-mono uppercase tracking-widest mb-3">
              Key Themes
            </p>
            <div className="flex flex-wrap gap-2">
              {sentiment.keyThemes.map((theme, i) => (
                <span
                  key={i}
                  className={`text-sm font-body px-4 py-2 rounded-full border transition-all duration-200 hover:scale-105 ${config.border} ${config.bg} ${config.color}`}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Critic consensus */}
          <div className="rounded-2xl bg-cinema-deep border border-cinema-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cinema-gold"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-cinema-gold text-xs font-mono uppercase tracking-widest">
                Critic Consensus
              </p>
            </div>
            <p className="text-cinema-muted text-sm leading-relaxed font-body italic">
              {sentiment.criticConsensus}
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-cinema-dim text-xs font-body leading-relaxed border-t border-cinema-border pt-4">
            ⚠ AI-generated sentiment based on available metadata and ratings. Not derived from live review scraping.
          </p>
        </div>
      </div>
    </div>
  );
}

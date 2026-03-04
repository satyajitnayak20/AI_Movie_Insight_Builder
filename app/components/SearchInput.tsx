"use client";

import { useState, useRef } from "react";
import { validateImdbId } from "@/app/lib/utils";

interface SearchInputProps {
  onSearch: (id: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const EXAMPLES = ["tt0133093", "tt0111161", "tt0468569", "tt1375666", "tt0816692"];

  const handleSubmit = () => {
    const trimmed = value.trim();
    setError("");

    if (!trimmed) {
      setError("Please enter an IMDb movie ID.");
      inputRef.current?.focus();
      return;
    }

    if (!validateImdbId(trimmed)) {
      setError('Invalid format. IMDb IDs look like "tt0133093" — starts with "tt" followed by 7-8 digits.');
      inputRef.current?.focus();
      return;
    }

    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleExample = (id: string) => {
    setValue(id);
    setError("");
    onSearch(id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input group */}
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "border-cinema-gold/60 shadow-[0_0_30px_rgba(201,168,76,0.15)]"
            : "border-cinema-border"
        } bg-cinema-surface overflow-hidden`}
      >
        {/* Film reel icon */}
        <div className="pl-5 pr-3 flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-colors duration-300 ${
              isFocused ? "text-cinema-gold" : "text-cinema-dim"
            }`}
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter IMDb ID — e.g. tt0133093"
          disabled={isLoading}
          aria-label="IMDb Movie ID"
          className="flex-1 bg-transparent py-4 pr-3 text-cinema-text placeholder-cinema-dim outline-none text-base font-body tracking-wide disabled:opacity-50"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          aria-label="Search movie"
          className={`m-2 px-6 py-3 rounded-xl font-display text-sm font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
            isLoading || !value.trim()
              ? "bg-cinema-border text-cinema-dim cursor-not-allowed"
              : "bg-cinema-gold text-cinema-black hover:bg-cinema-gold-light active:scale-95 shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
          }`}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-cinema-dim border-t-cinema-muted rounded-full animate-spin" />
              <span className="hidden sm:inline">Analyzing</span>
            </>
          ) : (
            <>
              <span>Search</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 text-cinema-crimson text-sm font-body animate-fade-up"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Example IDs */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-cinema-dim text-xs font-mono uppercase tracking-widest">Try:</span>
        {EXAMPLES.map((id) => (
          <button
            key={id}
            onClick={() => handleExample(id)}
            disabled={isLoading}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-cinema-border text-cinema-muted hover:border-cinema-gold/40 hover:text-cinema-gold-light transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}

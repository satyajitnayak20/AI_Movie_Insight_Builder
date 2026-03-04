"use client";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="w-full rounded-3xl border border-cinema-crimson/30 bg-cinema-crimson/5 p-8 animate-fade-up"
    >
      <div className="flex flex-col items-center text-center gap-5">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-cinema-crimson/10 border border-cinema-crimson/20 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-cinema-crimson"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-cinema-text mb-2">
            Something went wrong
          </h3>
          <p className="text-cinema-muted font-body text-sm leading-relaxed max-w-md">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl border border-cinema-crimson/30 text-cinema-crimson text-sm font-display font-semibold tracking-wide hover:bg-cinema-crimson/10 transition-all duration-200 active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

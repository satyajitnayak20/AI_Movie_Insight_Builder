import {
  validateImdbId,
  formatNumber,
  ratingToPercent,
  getRatingColor,
  getSentimentConfig,
  truncate,
  parseCast,
  parseGenres,
  hasValidPoster,
  deriveSentimentHint,
} from "@/app/lib/utils";
import { MovieData } from "@/app/lib/types";

// --- validateImdbId ---
describe("validateImdbId", () => {
  it("accepts valid 7-digit IMDb IDs", () => {
    expect(validateImdbId("tt0133093")).toBe(true);
    expect(validateImdbId("tt0111161")).toBe(true);
  });

  it("accepts valid 8-digit IMDb IDs", () => {
    expect(validateImdbId("tt10872600")).toBe(true);
  });

  it("rejects IDs without tt prefix", () => {
    expect(validateImdbId("0133093")).toBe(false);
    expect(validateImdbId("ab0133093")).toBe(false);
  });

  it("rejects IDs with too few digits", () => {
    expect(validateImdbId("tt01234")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateImdbId("")).toBe(false);
  });

  it("handles leading/trailing spaces (trim)", () => {
    expect(validateImdbId("  tt0133093  ")).toBe(true);
  });
});

// --- formatNumber ---
describe("formatNumber", () => {
  it("formats numbers with commas", () => {
    expect(formatNumber("1234567")).toBe("1,234,567");
  });

  it("handles pre-formatted strings", () => {
    expect(formatNumber("1,234,567")).toBe("1,234,567");
  });

  it("returns original string for non-numeric", () => {
    expect(formatNumber("N/A")).toBe("N/A");
  });
});

// --- ratingToPercent ---
describe("ratingToPercent", () => {
  it("converts 10 to 100%", () => {
    expect(ratingToPercent("10")).toBe(100);
  });

  it("converts 8.7 to 87%", () => {
    expect(ratingToPercent("8.7")).toBe(87);
  });

  it("returns 0 for N/A", () => {
    expect(ratingToPercent("N/A")).toBe(0);
  });
});

// --- getRatingColor ---
describe("getRatingColor", () => {
  it("returns gold for 8.0+", () => {
    expect(getRatingColor("9.2")).toContain("gold");
    expect(getRatingColor("8.0")).toContain("gold");
  });

  it("returns amber for 6.0–7.4", () => {
    expect(getRatingColor("6.5")).toContain("amber");
  });

  it("returns crimson for below 6.0", () => {
    expect(getRatingColor("4.2")).toContain("crimson");
  });

  it("returns dim for N/A", () => {
    expect(getRatingColor("N/A")).toContain("dim");
  });
});

// --- getSentimentConfig ---
describe("getSentimentConfig", () => {
  it("returns correct config for positive", () => {
    const config = getSentimentConfig("positive");
    expect(config.label).toBe("Positive");
    expect(config.color).toContain("emerald");
  });

  it("returns correct config for negative", () => {
    const config = getSentimentConfig("negative");
    expect(config.label).toBe("Negative");
    expect(config.color).toContain("crimson");
  });

  it("returns correct config for mixed", () => {
    const config = getSentimentConfig("mixed");
    expect(config.label).toBe("Mixed");
    expect(config.color).toContain("amber");
  });
});

// --- truncate ---
describe("truncate", () => {
  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and appends ellipsis", () => {
    const result = truncate("Hello World", 5);
    expect(result).toHaveLength(6); // 5 chars + ellipsis char
    expect(result.endsWith("…")).toBe(true);
  });
});

// --- parseCast ---
describe("parseCast", () => {
  it("splits comma-separated actors", () => {
    expect(parseCast("Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss")).toEqual([
      "Keanu Reeves",
      "Laurence Fishburne",
      "Carrie-Anne Moss",
    ]);
  });

  it("filters empty strings", () => {
    expect(parseCast("")).toEqual([]);
  });
});

// --- parseGenres ---
describe("parseGenres", () => {
  it("splits genres", () => {
    expect(parseGenres("Action, Sci-Fi")).toEqual(["Action", "Sci-Fi"]);
  });
});

// --- hasValidPoster ---
describe("hasValidPoster", () => {
  const baseMovie = { Poster: "" } as MovieData;

  it("returns true for valid URL", () => {
    expect(hasValidPoster({ ...baseMovie, Poster: "https://m.media-amazon.com/images/test.jpg" })).toBe(true);
  });

  it("returns false for N/A", () => {
    expect(hasValidPoster({ ...baseMovie, Poster: "N/A" })).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(hasValidPoster({ ...baseMovie, Poster: "" })).toBe(false);
  });
});

// --- deriveSentimentHint ---
describe("deriveSentimentHint", () => {
  const baseMovie = {
    imdbRating: "8.7",
    Metascore: "87",
  } as MovieData;

  it("generates a hint string for high-rated movies", () => {
    const hint = deriveSentimentHint(baseMovie);
    expect(hint).toContain("highly praised");
    expect(hint).toContain("critically acclaimed");
  });

  it("handles N/A gracefully", () => {
    const hint = deriveSentimentHint({
      ...baseMovie,
      imdbRating: "N/A",
      Metascore: "N/A",
    });
    expect(hint).toBe("");
  });
});

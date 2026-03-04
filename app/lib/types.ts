// Core movie data types

export interface MovieRating {
  Source: string;
  Value: string;
}

export interface MovieData {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: MovieRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  BoxOffice?: string;
  Production?: string;
  Error?: string;
}

export interface SentimentResult {
  summary: string;
  sentiment: "positive" | "mixed" | "negative";
  confidence: number;
  keyThemes: string[];
  audienceQuote: string;
  criticConsensus: string;
}

export interface MovieInsight {
  movie: MovieData;
  sentiment: SentimentResult;
}

export type SentimentLabel = "positive" | "mixed" | "negative";

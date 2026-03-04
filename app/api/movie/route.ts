import { NextRequest, NextResponse } from "next/server";
import { MovieData } from "@/app/lib/types";

/**
 * GET /api/movie?id=tt0133093
 * Fetches movie details from OMDb API using an IMDb ID.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("id");

  // Validate presence
  if (!imdbId) {
    return NextResponse.json(
      { error: "Missing movie ID. Please provide an IMDb ID (e.g., tt0133093)." },
      { status: 400 }
    );
  }

  // Validate format
  if (!/^tt\d{7,8}$/.test(imdbId.trim())) {
    return NextResponse.json(
      { error: "Invalid IMDb ID format. It should look like: tt0133093" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: OMDb API key not set." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbId.trim()}&apikey=${apiKey}&plot=full`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`OMDb responded with status: ${response.status}`);
    }

    const data: MovieData = await response.json();

    // OMDb returns { Response: "False", Error: "..." } on not-found
    if (data.Error || (data as any).Response === "False") {
      return NextResponse.json(
        { error: data.Error || "Movie not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/movie] Error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch movie data. Please try again." },
      { status: 500 }
    );
  }
}

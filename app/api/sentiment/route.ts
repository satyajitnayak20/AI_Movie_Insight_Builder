import { NextRequest, NextResponse } from "next/server";
import { MovieData, SentimentResult } from "@/app/lib/types";
import { deriveSentimentHint } from "@/app/lib/utils";

/**
 * POST /api/sentiment
 * Uses Groq API (free tier) with Llama 3 to generate audience sentiment insights.
 * Body: { movie: MovieData }
 */
export async function POST(request: NextRequest) {
  let body: { movie: MovieData };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { movie } = body;

  if (!movie || !movie.imdbID) {
    return NextResponse.json({ error: "Movie data is required." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Groq API key not set." },
      { status: 500 }
    );
  }

  // Build context-rich prompt
  const sentimentHint = deriveSentimentHint(movie);
  const prompt = `You are a film critic and audience sentiment analyst. Analyze the following movie and provide a structured sentiment insight report.

Movie Information:
- Title: ${movie.Title} (${movie.Year})
- Genre: ${movie.Genre}
- Director: ${movie.Director}
- Cast: ${movie.Actors}
- Plot: ${movie.Plot}
- IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
- Metascore: ${movie.Metascore}/100
- Awards: ${movie.Awards}
- Reception hint: This film is ${sentimentHint}.

Based on this information, generate a realistic audience sentiment analysis as if you had analyzed thousands of audience reviews.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no extra text):
{
  "summary": "A 2-3 sentence AI-generated summary of how audiences feel about this film, written in an engaging analytical tone.",
  "sentiment": "positive",
  "confidence": 0.85,
  "keyThemes": ["theme1", "theme2", "theme3", "theme4"],
  "audienceQuote": "A representative fictional audience quote that captures the prevailing sentiment.",
  "criticConsensus": "A one-sentence fictional critical consensus statement similar to Rotten Tomatoes style."
}

For the sentiment field use only one of these exact values: positive, mixed, negative.
For confidence use a number between 0.0 and 1.0.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 800,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are a film sentiment analyst. You always respond with valid JSON only — no markdown, no explanation, no extra text before or after the JSON object.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[/api/sentiment] Groq error:", errText);
      let detail = `Groq API error (${response.status})`;
      try {
        const errJson = JSON.parse(errText);
        detail = errJson?.error?.message || detail;
      } catch {}
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const sentiment: SentimentResult = JSON.parse(cleaned);

    // Validate required fields
    if (!sentiment.summary || !sentiment.sentiment || !sentiment.keyThemes) {
      throw new Error("Incomplete sentiment data returned from AI.");
    }

    // Ensure sentiment is one of the valid values
    if (!["positive", "mixed", "negative"].includes(sentiment.sentiment)) {
      sentiment.sentiment = "mixed";
    }

    return NextResponse.json(sentiment);
  } catch (err: any) {
    console.error("[/api/sentiment] Error:", err.message);
    return NextResponse.json(
      { error: "Failed to generate AI insights. Please try again." },
      { status: 500 }
    );
  }
}
# 🎬 Movie Insight Builder

> AI-powered movie analysis — enter an IMDb ID and get instant sentiment insights, audience analysis, ratings, cast and more.

![Movie Insight Builder](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Claude AI](https://img.shields.io/badge/Claude-AI-orange) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## ✨ Features

- **IMDb ID lookup** — fetch full movie metadata via OMDb API
- **AI Sentiment Analysis** — Claude generates audience sentiment summaries, key themes, critic consensus, confidence scores
- **Overall Sentiment Classification** — Positive / Mixed / Negative
- **Cinematic UI** — dark editorial theme, Playfair Display typography, smooth animations
- **Responsive design** — works on all screen sizes
- **Input validation** — format checks, helpful errors, graceful 404/500 handling
- **Loading skeletons** — progressive disclosure as data arrives
- **Example IDs** — quick-start buttons for popular films

---

## 🛠 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14** (App Router) | Full-stack React, API routes, built-in optimization |
| Language | **TypeScript** | Type safety, better DX, catch errors at compile time |
| Styling | **Tailwind CSS** | Utility-first, zero runtime, great for design systems |
| Animation | **Framer Motion** | (available) CSS animations used for performance |
| Movie Data | **OMDb API** | Free, reliable, returns all required metadata |
| AI Analysis | **Anthropic Claude** | High-quality, structured JSON sentiment output |
| Deployment | **Vercel** | Zero-config Next.js deployment, edge network |
| Testing | **Jest + Testing Library** | Unit + component tests, industry standard |
| Fonts | **Google Fonts** (Playfair Display, DM Sans, DM Mono) | Editorial, cinematic aesthetic |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18.17+ 
- npm or yarn
- [OMDb API key](https://www.omdbapi.com/apikey.aspx) (free)
- [Anthropic API key](https://console.anthropic.com/) (Claude access)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-insight-builder.git
cd movie-insight-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OMDB_API_KEY=your_omdb_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

---

## 🌐 Deployment to Vercel

### Option A — GitHub Integration (Recommended)

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in the Vercel dashboard:
   - `OMDB_API_KEY` → your key
   - `ANTHROPIC_API_KEY` → your key
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables when prompted, or via:

```bash
vercel env add OMDB_API_KEY
vercel env add ANTHROPIC_API_KEY
```

---

## 📁 Project Structure

```
movie-insight-builder/
├── app/
│   ├── api/
│   │   ├── movie/route.ts        # GET /api/movie?id= — OMDb fetch
│   │   └── sentiment/route.ts    # POST /api/sentiment — Claude AI
│   ├── components/
│   │   ├── SearchInput.tsx       # Input + validation UI
│   │   ├── MovieCard.tsx         # Movie details display
│   │   ├── SentimentPanel.tsx    # AI insights panel
│   │   ├── LoadingSkeleton.tsx   # Loading state UI
│   │   └── ErrorMessage.tsx      # Error display
│   ├── lib/
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── utils.ts              # Pure utility functions
│   ├── globals.css               # Tailwind base + custom styles
│   ├── layout.tsx                # Root layout with fonts + metadata
│   └── page.tsx                  # Main page (orchestrates state)
├── __tests__/
│   ├── utils.test.ts             # Unit tests for utilities
│   └── components.test.tsx       # Component tests
├── .env.example                  # Template for env vars
├── .gitignore
├── jest.config.ts
├── jest.setup.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🔌 API Routes

### `GET /api/movie?id={imdbId}`

Fetches movie details from OMDb API.

**Query Parameters:**
- `id` (required) — IMDb ID in format `tt0133093`

**Responses:**
- `200` — `MovieData` object
- `400` — Validation error
- `404` — Movie not found
- `500` — Server/network error

---

### `POST /api/sentiment`

Generates AI sentiment analysis using Claude.

**Request Body:**
```json
{ "movie": { ...MovieData } }
```

**Response:**
```json
{
  "summary": "...",
  "sentiment": "positive" | "mixed" | "negative",
  "confidence": 0.0–1.0,
  "keyThemes": ["...", "..."],
  "audienceQuote": "...",
  "criticConsensus": "..."
}
```

---

## 🧪 Testing

Tests cover:

- **Utils** — `validateImdbId`, `formatNumber`, `ratingToPercent`, `getRatingColor`, `getSentimentConfig`, `truncate`, `parseCast`, `parseGenres`, `hasValidPoster`, `deriveSentimentHint`
- **SearchInput** — renders, validation errors, valid submit, Enter key, loading state, example buttons
- **ErrorMessage** — renders message, retry button behavior

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

---

## 💡 Assumptions & Notes

1. **OMDb free tier** — limited to 1,000 requests/day. Responses are cached for 1 hour via `next: { revalidate: 3600 }`.

2. **AI Sentiment is analytical, not review-scraping** — The assignment says "scrape or retrieve audience reviews." Given OMDb doesn't provide reviews and IMDb blocks scraping, Claude generates an AI-based sentiment analysis using the movie's metadata (rating, votes, Metascore, plot, awards). This is clearly labeled in the UI.

3. **Claude model** — Using `claude-opus-4-5` for high-quality structured JSON output.

4. **Progressive loading** — Movie details render first, then AI insights load in a second pass. This improves perceived performance.

5. **No localStorage** — All state is in React memory; no persistence between sessions (out of scope for this assignment).

6. **Poster images** — Served from `m.media-amazon.com`. Configured in `next.config.js` image domains.

---

## 🎨 Design Decisions

- **Dark cinematic theme** — deep blacks (`#0A0A0B`), gold accents (`#C9A84C`), editorial typography
- **Playfair Display** — serif display font gives a premium, cinematic feel
- **Film strip decoration** — subtle side decorations reference the physical medium
- **Staggered animations** — content reveals progressively to avoid visual overwhelm
- **Color-coded ratings** — gold (8+), amber (6–7.5), crimson (<6) for instant comprehension

---

## 📄 License

MIT — free to use and modify.

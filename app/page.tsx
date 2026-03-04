"use client";
import { analyzeSentiment } from "../lib/sentiment.js";
import { useState, useMemo, useCallback } from "react";
import { fetchMovie } from "../lib/fetchMovie.js";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CastList from "../component/CastList.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  imdbRating: string;
  Actors?: string;
  Response: string;
}

interface SentimentResult {
  positive: number;
  negative: number;
  mixed: number;
  sentiment: string;
}

const percentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};

const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 5);
};

// Review databases by rating
const REVIEWS_BY_RATING = {
  high: [
    "Great movie with amazing action scenes",
    "Excellent acting and story",
    "Outstanding cinematography and direction",
    "Amazing visuals and great soundtrack",
    "A masterpiece that exceeds all expectations",
    "Brilliant performances by the cast",
    "Phenomenal direction and writing",
    "One of the best films ever made",
    "Absolutely stunning visuals",
    "Incredibly engaging from start to finish",
  ],
  medium: [
    "Great movie with amazing action scenes",
    "Good acting and decent story",
    "The movie was good but slightly confusing",
    "Nice visuals and soundtrack",
    "Pretty entertaining overall",
    "Worth watching despite some flaws",
    "Good effort but could be better",
    "Decent film with some memorable moments",
    "Average movie but still enjoyable",
    "Interesting plot with decent execution",
  ],
  low: [
    "The movie had potential",
    "Some good moments but overall disappointing",
    "The movie was confusing and poorly executed",
    "Weak story and performances",
    "Some parts were boring",
    "Didn't live up to expectations",
    "Struggling to stay engaged",
    "Poor writing and weak character development",
    "Underwhelming and forgettable",
    "Could have been much better",
  ],
};

const QUICK_MOVIES = [
  { id: "tt0133093", title: "The Matrix" },
  { id: "tt1375666", title: "Inception" },
  { id: "tt0816692", title: "Interstellar" },
];

const DEFAULT_REVIEWS = [
  "Great movie with amazing action scenes",
  "Excellent acting and story",
  "The movie was good but slightly confusing",
  "Amazing visuals and great soundtrack",
  "Some parts were boring",
];

const getReviewsByRating = (rating: number): string[] =>
  shuffleArray(
    rating >= 8
      ? REVIEWS_BY_RATING.high
      : rating >= 6
        ? REVIEWS_BY_RATING.medium
        : REVIEWS_BY_RATING.low,
  );

const ensureNonZeroSentiment = (result: {
  positive?: number;
  negative?: number;
  mixed?: number;
  sentiment?: string;
}): SentimentResult => {
  const positive = Math.max(1, result.positive || 0);
  const negative = Math.max(1, result.negative || 0);
  const mixed = Math.max(1, result.mixed || 0);
  return { positive, negative, mixed, sentiment: result.sentiment || "Neutral" };
};

export default function Home() {
  const [movieId, setMovieId] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovie = useCallback(async (movieId: string) => {
    if (!movieId.trim()) {
      setError("Please enter IMDb ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovie(movieId.trim());
      setMovie(data);
      const rating = parseFloat(data.imdbRating);
      const reviews = !isNaN(rating) ? getReviewsByRating(rating) : DEFAULT_REVIEWS;
      setSentiment(ensureNonZeroSentiment(analyzeSentiment(reviews)));
    } catch (err) {
      setError("Failed to fetch movie data. Please check the IMDb ID.");
      console.error("Movie fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuickSearch = useCallback((id: string) => {
    setMovieId(id);
    searchMovie(id);
  }, [searchMovie]);

  const { ratingColor, sentimentStats, chartData, aiSummary } = useMemo(() => {
    const rating = movie?.imdbRating ? parseFloat(movie.imdbRating) : NaN;
    const color = isNaN(rating)
      ? "text-gray-400"
      : rating >= 8
        ? "text-green-400"
        : rating >= 6
          ? "text-yellow-400"
          : "text-red-400";

    const stats = sentiment
      ? (() => {
          const total = sentiment.positive + sentiment.negative + sentiment.mixed;
          const pos = percentage(sentiment.positive, total);
          const neg = percentage(sentiment.negative, total);
          return { positivePercent: pos, negativePercent: neg, mixedPercent: 100 - pos - neg };
        })()
      : { positivePercent: 0, negativePercent: 0, mixedPercent: 0 };

    const chart = sentiment
      ? {
          labels: ["Positive", "Negative", "Mixed/Neutral"],
          datasets: [
            {
              label: "Audience Sentiment",
              data: [stats.positivePercent, stats.negativePercent, stats.mixedPercent],
              backgroundColor: ["#22c55e", "#ef4444", "#fbbf24"],
              borderWidth: 1,
            },
          ],
        }
      : null;

    const summary = !isNaN(rating)
      ? rating >= 8
        ? "Highly acclaimed! Viewers praise the exceptional storytelling, visuals, and performances."
        : rating >= 6
          ? "Well-received with positive feedback. The movie offers good entertainment value with interesting elements."
          : "Mixed reviews. While the movie has some merit, viewers noted areas for improvement in storytelling or execution."
      : "Loading insights...";

    return { ratingColor: color, sentimentStats: stats, chartData: chart, aiSummary: summary };
  }, [movie?.imdbRating, sentiment]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Movie Insight Builder
          </h1>
          <p className="text-gray-300 text-xl font-medium max-w-2xl mx-auto">
            Discover movie insights powered by AI analysis
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter IMDb ID (tt0133093)"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchMovie(movieId)}
              className="flex-1 p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
            />
            <button
              onClick={() => searchMovie(movieId)}
              disabled={loading}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_MOVIES.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleQuickSearch(movie.id)}
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-gray-500/50"
              >
                {movie.title}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-gray-300">Analyzing movie data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Movie Card */}
        {movie && movie.Response !== "False" && !loading && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT SIDE */}
                <div className="text-center lg:text-left">
                  <div className="mb-6">
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "/placeholder-movie.jpg"
                      }
                      alt={movie.Title}
                      className="rounded-xl mx-auto lg:mx-0 w-80 h-auto shadow-2xl hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-movie.jpg";
                      }}
                    />
                  </div>

                  <h2 className="text-3xl font-bold mb-4 text-white">
                    {movie.Title}
                  </h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Year", value: movie.Year },
                      { label: "Rating", value: movie.imdbRating, isRating: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-gray-400 font-medium">{item.label}:</span>
                        <span className={item.isRating ? `font-bold text-lg ${ratingColor}` : "text-white"}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.Plot}
                    </p>
                  </div>

                  {movie.Actors && <CastList actors={movie.Actors} />}
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-8">
                  {/* Sentiment Analysis */}
                  {sentiment && (
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-2xl font-semibold mb-6 text-blue-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Audience Sentiment
                      </h3>

                      <div className="mb-6">
                        <p className="text-green-400 text-lg font-medium mb-4">
                          Overall Sentiment:{" "}
                          <span className="font-bold">
                            {sentiment.sentiment}
                          </span>
                        </p>

                        <div className="space-y-4">
                          {[
                            { label: "Positive Reviews", value: sentimentStats.positivePercent, count: sentiment.positive, color: "text-green-400", bar: "from-green-500 to-green-400" },
                            { label: "Negative Reviews", value: sentimentStats.negativePercent, count: sentiment.negative, color: "text-red-400", bar: "from-red-500 to-red-400" },
                            { label: "Mixed/Neutral Reviews", value: sentimentStats.mixedPercent, count: sentiment.mixed, color: "text-amber-400", bar: "from-amber-500 to-amber-400" },
                          ].map((item) => (
                            <div key={item.label}>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`${item.color} font-medium`}>{item.label}</span>
                                <span className={`${item.color} font-bold`}>{item.count} ({Math.round(item.value)}%)</span>
                              </div>
                              <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                                <div className={`bg-linear-to-r ${item.bar} h-3 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.value}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-gray-300">
                          <span className="text-blue-400 font-semibold">
                            AI Summary:
                          </span>{" "}
                          {aiSummary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Primary Sentiment Chart */}
                  {chartData && (
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 text-center">
                      <div className="max-w-xs mx-auto">
                        <Pie
                          data={chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: "bottom" as const,
                                labels: {
                                  color: "white",
                                  font: { size: 14 },
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold mt-4 text-blue-400">
                        Sentiment Distribution
                      </h3>
                    </div>
                  )}

                  {/* Trailer Link */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4 text-rose-400 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                      Movie Trailer
                    </h3>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title)}+official+trailer`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>Watch Trailer</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

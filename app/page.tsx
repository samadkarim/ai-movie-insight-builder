"use client";
import { analyzeSentiment } from "../lib/sentiment.js";
import { useState } from "react";A
import { fetchMovie } from "../lib/fetchMovie.js";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {

  const [movieId, setMovieId] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchMovie = async () => {

    if (!movieId) {
      alert("Please enter IMDb ID");
      return;
    }

    setLoading(true);

    const data = await fetchMovie(movieId);
    setMovie(data);

    const reviews = [
      "Great movie with amazing action scenes",
      "Excellent acting and story",
      "The movie was good but slightly confusing",
      "Amazing visuals and great soundtrack",
      "Some parts were boring"
    ];

    const result = analyzeSentiment(reviews);
    setSentiment(result);

    setLoading(false);
  };

  const chartData = sentiment
    ? {
        labels: ["Positive", "Negative"],
        datasets: [
          {
            label: "Audience Sentiment",
            data: [sentiment.positive, sentiment.negative],
            backgroundColor: ["#22c55e", "#ef4444"],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const ratingColor =
    movie?.imdbRating >= 8
      ? "text-green-400"
      : movie?.imdbRating >= 6
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center pt-20">

      <h1 className="text-5xl font-bold mb-2">
        AI Movie Insight Builder
      </h1>

      <p className="text-gray-400 mb-10 font-bold text-lg">
        Discover movie insights powered by AI
      </p>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter IMDb ID (tt0133093)"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          className="p-3 rounded-lg bg-gray-500 text-white placeholder-gray-400 w-72 border border-gray-600"
        />

        <button
          onClick={searchMovie}
          className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Search
        </button>

      </div>

      {loading && (
        <p className="mt-4 text-gray-300">Loading movie...</p>
      )}

      {/* Quick Buttons */}

      <div className="flex gap-3 mt-4">

        <button
          onClick={() => setMovieId("tt0133093")}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          The Matrix
        </button>

        <button
          onClick={() => setMovieId("tt1375666")}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          Inception
        </button>

        <button
          onClick={() => setMovieId("tt0816692")}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
        >
          Interstellar
        </button>

      </div>

      {/* Movie Card */}

      {movie && movie.Response !== "False" && (

        <div className="mt-10 bg-gray-900 p-6 rounded-xl max-w-5xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT SIDE */}

          <div className="text-center">

            <img
              src={movie.Poster}
              alt={movie.Title}
              className="rounded-lg mb-4 w-64 mx-auto hover:scale-105 transition"
            />

            <h2 className="text-2xl font-bold mb-3">
              {movie.Title}
            </h2>

            <p>
              <strong>Year:</strong> {movie.Year}
            </p>

            <p className={`mb-3 ${ratingColor}`}>
              <strong>Rating:</strong> {movie.imdbRating}
            </p>

            <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
              {movie.Plot}
            </p>

          </div>

          {/* RIGHT SIDE */}

          <div>

            {sentiment && (

              <div className="mb-6">

                <h3 className="text-xl font-semibold mb-2">
                  Audience Sentiment
                </h3>

                <p className="text-green-400">
                  Overall Sentiment: {sentiment.sentiment}
                </p>

                <p>Positive Reviews: {sentiment.positive}</p>

                <p>Negative Reviews: {sentiment.negative}</p>

                <p className="text-gray-400 mt-2">
                  AI Summary: Most viewers praise the movie for its storytelling,
                  visuals, and performances.
                </p>

              </div>

            )}

            {chartData && (

              <div className="mb-6">

                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  Sentiment Chart
                </h3>

                <div className="w-64 mx-auto">
                  <Pie data={chartData} />
                </div>

              </div>

            )}

            <div className="text-center">

              <h3 className="text-xl font-semibold mb-3 text-rose-300">
                Movie Trailer
              </h3>

              <a
                href={`https://www.youtube.com/results?search_query=${movie.Title}+official+trailer`}
                target="_blank"
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Watch Trailer
              </a>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
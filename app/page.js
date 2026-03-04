"use client";

import { useState } from "react";
import { fetchMovie } from "../Lib/fetchMovie";
import MovieCard from "../components/MovieCard";
import CastList from "../components/CastList";
import SentimentChart from "../components/SentimentChart";
import { analyzeSentiment } from "../Lib/sentiment";

export default function Home() {

  const [movieId, setMovieId] = useState("");
  const [movie, setMovie] = useState(null);
  const [sentiment, setSentiment] = useState(null);

  const handleSearch = async () => {
    const data = await fetchMovie(movieId);
    setMovie(data);

    const reviews = [
      "great movie",
      "good action",
      "bad story",
      "great acting",
    ];

    const result = analyzeSentiment(reviews);
    setSentiment(result);
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white">

      <h1 className="text-4xl font-bold mb-6">
        AI Movie Insight Builder
      </h1>

      <input
        type="text"
        placeholder="Enter IMDb ID (tt0133093)"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
        className="p-3 text-black rounded mr-3"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 px-6 py-3 rounded"
      >
        Search
      </button>

      {movie && <MovieCard movie={movie} />}

      {movie && <CastList actors={movie.Actors} />}

      {sentiment && <SentimentChart data={sentiment} />}
    </div>
  );
}
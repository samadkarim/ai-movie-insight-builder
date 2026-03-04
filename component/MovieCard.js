export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <img src={movie.Poster} alt={movie.Title} className="rounded-lg mb-4"/>

      <h2 className="text-2xl font-bold">{movie.Title}</h2>

      <p>Year: {movie.Year}</p>
      <p>Rating: {movie.imdbRating}</p>

      <p className="mt-3 text-gray-300">{movie.Plot}</p>
    </div>
  );
}
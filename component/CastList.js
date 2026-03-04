export default function CastList({ actors }) {
  if (!actors || actors === "N/A") return null;

  const cast = actors.split(",").map(actor => actor.trim()).filter(actor => actor);

  if (cast.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
        Cast & Crew
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cast.slice(0, 8).map((actor, i) => (
          <div
            key={i}
            className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
          >
            <span className="text-gray-200 font-medium">{actor}</span>
          </div>
        ))}
      </div>

      {cast.length > 8 && (
        <p className="text-gray-400 text-sm mt-3 text-center">
          And {cast.length - 8} more...
        </p>
      )}
    </div>
  );
}
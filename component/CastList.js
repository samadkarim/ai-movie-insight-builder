export default function CastList({ actors }) {
  const cast = actors.split(",");

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Cast</h3>

      <ul className="list-disc ml-6">
        {cast.map((actor, i) => (
          <li key={i}>{actor}</li>
        ))}
      </ul>
    </div>
  );
}
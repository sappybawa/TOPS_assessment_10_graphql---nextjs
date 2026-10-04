import useFetchRestaurants from './useFetchRestaurants.js';

export default function RestaurantList() {
  const { data, loading, error } = useFetchRestaurants();

  if (loading) return <p>Fetching restaurants…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <ul className="restaurants">
      {data.map((r) => (
        <li key={r.id}>
          <strong>{r.name}</strong> — {r.email}
        </li>
      ))}
    </ul>
  );
}

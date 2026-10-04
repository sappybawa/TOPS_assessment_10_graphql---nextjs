// ===== CORRECTED VERSION (fixed by me, without AI) =====
import { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { FOOD_ITEMS } from './foodItems.js';

const GET_CATEGORIES = gql`
  query GetCategories {
    albums(options: { paginate: { page: 1, limit: 5 } }) {
      data { id title }
    }
  }
`;

// FIX 1: The mock API returns lorem-ipsum titles ("quidem molestiae enim"), which never
// equal our food categories, so the AI version always filtered to ZERO items.
// We map the API's category ids to real food labels (adapter layer).
const LABELS = { 1: 'Pizza', 2: 'Burgers', 3: 'Desserts', 4: 'Drinks', 5: 'Salads' };
const ALL = 'all';

export default function CategoryFilter() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
  const [selected, setSelected] = useState(ALL); // FIX 2: "All" is the default, so the page isn't empty

  const categories = useMemo(
    () => (data?.albums?.data ?? []).map((c) => ({ id: String(c.id), label: LABELS[c.id] ?? c.title })),
    [data]
  );

  const filtered = useMemo(
    () => (selected === ALL ? FOOD_ITEMS : FOOD_ITEMS.filter((i) => i.categoryId === selected)),
    [selected]
  );

  if (loading) return <div className="spinner" role="status" aria-label="Loading categories" />;
  if (error) {
    return (
      <div className="error" role="alert">
        Could not load categories: {error.message}{' '}
        {/* FIX 3: let the user retry instead of a dead end */}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Food Menu</h1>
      <div className="chips">
        {[{ id: ALL, label: 'All' }, ...categories].map((c) => (
          <button
            key={c.id /* FIX 4: stable id instead of array index */}
            className={selected === c.id ? 'chip active' : 'chip'}
            aria-pressed={selected === c.id /* FIX 5: accessibility */}
            onClick={() => setSelected(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No items in this category.</p> /* FIX 6: empty state */
      ) : (
        <ul>
          {filtered.map((item) => (
            <li key={item.id}>{item.name} — ₹{item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

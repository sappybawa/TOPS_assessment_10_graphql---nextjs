// ===== AI-GENERATED ORIGINAL (kept unchanged for comparison) =====
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_CATEGORIES = gql`
  query GetCategories {
    albums(options: { paginate: { page: 1, limit: 5 } }) {
      data { id title }
    }
  }
`;

const foodItems = [
  { id: 1, name: 'Margherita Pizza', price: 249, category: 'Pizza' },
  { id: 2, name: 'Farmhouse Pizza', price: 299, category: 'Pizza' },
  { id: 3, name: 'Veg Burger', price: 129, category: 'Burgers' },
  { id: 4, name: 'Cheese Burger', price: 159, category: 'Burgers' },
  { id: 5, name: 'Chocolate Brownie', price: 99, category: 'Desserts' },
  { id: 6, name: 'Gulab Jamun', price: 79, category: 'Desserts' },
  { id: 7, name: 'Cold Coffee', price: 89, category: 'Drinks' },
  { id: 8, name: 'Mojito', price: 109, category: 'Drinks' },
  { id: 9, name: 'Caesar Salad', price: 179, category: 'Salads' },
];

export default function CategoryFilter() {
  const { data, loading, error } = useQuery(GET_CATEGORIES);
  const [selected, setSelected] = useState(null);

  if (loading) return <div className="spinner" />;
  if (error) return <p className="error">Error: {error.message}</p>;

  const categories = data.albums.data;
  const filtered = foodItems.filter((item) => item.category === selected);

  return (
    <div>
      <h1>Food Menu</h1>
      <div className="chips">
        {categories.map((c, index) => (
          <button
            key={index}
            className={selected === c.title ? 'chip active' : 'chip'}
            onClick={() => setSelected(c.title)}
          >
            {c.title}
          </button>
        ))}
      </div>
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>{item.name} — ₹{item.price}</li>
        ))}
      </ul>
    </div>
  );
}

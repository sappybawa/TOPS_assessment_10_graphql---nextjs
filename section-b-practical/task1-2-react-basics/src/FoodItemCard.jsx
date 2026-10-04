import { useState } from 'react';

/** Task 1 — reusable card. Data comes via props, cart interaction via useState. */
export default function FoodItemCard({ name, price, category, isAvailable }) {
  const [isInCart, setIsInCart] = useState(false); // defaults to false per instance

  return (
    <div className={`card ${!isAvailable ? 'card--unavailable' : ''}`}>
      <h3>{name}</h3>
      <p className="category">{category}</p>
      <p className="price">₹{price}</p>
      <p className="stock">{isAvailable ? 'Available' : 'Out of stock'}</p>

      {isInCart ? (
        <span className="added">Added ›</span>
      ) : (
        <button disabled={!isAvailable} onClick={() => setIsInCart(true)}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

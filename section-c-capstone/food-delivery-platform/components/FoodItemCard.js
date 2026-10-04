/**
 * Reusable card. Handles its own loading (skeleton) and error states.
 * Props: item, loading, error, onAdd
 */
export default function FoodItemCard({ item, loading = false, error = null, onAdd }) {
  if (loading) {
    return (
      <div className="card skeleton" aria-busy="true">
        <div className="sk sk-title" /><div className="sk" /><div className="sk sk-btn" />
      </div>
    );
  }
  if (error) {
    return <div className="card card-error">⚠️ {error}</div>;
  }
  return (
    <div className="card">
      <div className="emoji">{item.emoji}</div>
      <h3>{item.name}</h3>
      <p className="muted">{item.category}</p>
      <p className="desc">{item.description}</p>
      <div className="row">
        <strong>₹{item.price}</strong>
        <button onClick={() => onAdd(item)}>Add to Cart</button>
      </div>
    </div>
  );
}

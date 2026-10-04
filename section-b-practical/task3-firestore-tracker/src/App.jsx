import { useEffect, useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';

const ordersRef = collection(db, 'orders');

export default function App() {
  // controlled form — one useState per field
  const [customerName, setCustomerName] = useState('');
  const [itemOrdered, setItemOrdered] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Real-time subscription: new / deleted orders appear instantly.
  useEffect(() => {
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError(err.message)
    );
    return unsubscribe; // cleanup on unmount
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await addDoc(ordersRef, {
        customerName: customerName.trim(),
        itemOrdered: itemOrdered.trim(),
        quantity: Number(quantity),
        createdAt: serverTimestamp(),
      });
      setCustomerName('');
      setItemOrdered('');
      setQuantity(1);
    } catch (err) {
      setError(err.message);
    }
  }

  async function cancelOrder(id) {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1>🍔 Real-Time Order Tracker</h1>

      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        <input placeholder="Item ordered" value={itemOrdered} onChange={(e) => setItemOrdered(e.target.value)} required />
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <button type="submit">Place Order</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Orders ({orders.length})</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul className="orders">
        {orders.map((o) => (
          <li key={o.id}>
            <span><strong>{o.customerName}</strong> ordered {o.quantity} × {o.itemOrdered}</span>
            <button className="cancel" onClick={() => cancelOrder(o.id)}>Cancel Order</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

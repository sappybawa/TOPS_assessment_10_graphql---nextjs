import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Redirect unauthenticated users away (after Firebase has restored the session).
  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/orders');
  }, [loading, user, router]);

  // Real-time order history for the logged-in user.
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // sort client-side (avoids needing a Firestore composite index)
        list.sort((a, b) => (b.createdAt?.seconds ?? Infinity) - (a.createdAt?.seconds ?? Infinity));
        setOrders(list);
      },
      (err) => setError(err.message)
    );
    return unsubscribe;
  }, [user]);

  if (loading || !user) return <p>Checking your session…</p>;

  return (
    <section>
      <h1>Order History</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && <p className="muted">No orders yet — place one from the Menu page.</p>}
      {orders.map((o) => (
        <div className="card order" key={o.id}>
          <div className="row">
            <strong>Order #{o.id.slice(0, 6).toUpperCase()}</strong>
            <span className="badge">{o.status}</span>
          </div>
          <ul>{o.items.map((i) => <li key={i.id}>{i.qty} × {i.name} — ₹{i.price * i.qty}</li>)}</ul>
          {o.discount && <p className="ok">{o.discount.code} (−₹{o.discount.amount})</p>}
          <div className="row">
            <span className="muted">{o.createdAt ? o.createdAt.toDate().toLocaleString() : 'Just now…'}</span>
            <strong>Total ₹{o.total}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}

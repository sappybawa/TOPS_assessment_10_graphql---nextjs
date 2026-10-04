import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import {
  applyDiscount, clearCart, removeDiscount, removeItem, selectDiscountAmount,
  selectSubtotal, selectTotal, updateQuantity,
} from '../store/cartSlice';

export default function CartSummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const { items, discount, discountStatus, discountError } = useSelector((s) => s.cart);
  const subtotal = useSelector(selectSubtotal);
  const discountAmount = useSelector(selectDiscountAmount);
  const total = useSelector(selectTotal);

  const [code, setCode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  async function placeOrder() {
    if (!user) return router.push('/login');
    setPlacing(true);
    setError(null);
    try {
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        items,
        subtotal,
        discount: discount ? { ...discount, amount: discountAmount } : null,
        total,
        status: 'Preparing',
        createdAt: serverTimestamp(),
      });
      dispatch(clearCart());
      router.push('/orders');
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <aside className="summary">
      <h2>Checkout summary</h2>
      {items.length === 0 && <p className="muted">Your cart is empty.</p>}

      {items.map((i) => (
        <div className="cart-row" key={i.id}>
          <span>{i.name}</span>
          <span className="qty">
            <button onClick={() => dispatch(updateQuantity({ id: i.id, qty: i.qty - 1 }))}>−</button>
            {i.qty}
            <button onClick={() => dispatch(updateQuantity({ id: i.id, qty: i.qty + 1 }))}>+</button>
          </span>
          <span>₹{i.price * i.qty}</span>
          <button className="danger" onClick={() => dispatch(removeItem(i.id))}>✕</button>
        </div>
      ))}

      {items.length > 0 && (
        <>
          <div className="promo">
            <input placeholder="Discount code (SAVE10 / FOOD20)" value={code} onChange={(e) => setCode(e.target.value)} />
            <button disabled={!code || discountStatus === 'loading'} onClick={() => dispatch(applyDiscount(code))}>
              {discountStatus === 'loading' ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {discountStatus === 'failed' && <p className="error">{discountError}</p>}
          {discount && (
            <p className="ok">
              {discount.code} applied ({discount.percent}% off){' '}
              <button className="link" onClick={() => dispatch(removeDiscount())}>remove</button>
            </p>
          )}

          <div className="totals">
            <div><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount && <div><span>Discount</span><span>−₹{discountAmount}</span></div>}
            <div className="grand"><span>Total</span><span>₹{total}</span></div>
          </div>

          {error && <p className="error">{error}</p>}
          <button className="primary" onClick={placeOrder} disabled={placing}>
            {placing ? 'Placing…' : user ? 'Place order' : 'Login to place order'}
          </button>
        </>
      )}
    </aside>
  );
}

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/**
 * Async thunk (Redux Thunk, bundled with Redux Toolkit's configureStore):
 * calls our Next.js API route to validate a discount code.
 */
export const applyDiscount = createAsyncThunk('cart/applyDiscount', async (code, { rejectWithValue }) => {
  const res = await fetch('/api/discount', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message || 'Invalid code');
  return json; // { code, percent }
});

const initialState = {
  items: [], // [{ id, name, price, qty }]
  discount: null, // { code, percent }
  discountStatus: 'idle', // idle | loading | succeeded | failed
  discountError: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i.id === payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ id: payload.id, name: payload.name, price: payload.price, qty: 1 });
    },
    removeItem(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
    },
    updateQuantity(state, { payload: { id, qty } }) {
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      if (qty <= 0) state.items = state.items.filter((i) => i.id !== id);
      else item.qty = qty;
    },
    clearCart() {
      return initialState;
    },
    removeDiscount(state) {
      state.discount = null;
      state.discountStatus = 'idle';
      state.discountError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyDiscount.pending, (s) => { s.discountStatus = 'loading'; s.discountError = null; })
      .addCase(applyDiscount.fulfilled, (s, { payload }) => { s.discountStatus = 'succeeded'; s.discount = payload; })
      .addCase(applyDiscount.rejected, (s, { payload }) => {
        s.discountStatus = 'failed';
        s.discountError = payload || 'Could not apply code';
      });
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, removeDiscount } = cartSlice.actions;

// selectors
export const selectSubtotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectDiscountAmount = (s) =>
  s.cart.discount ? Math.round((selectSubtotal(s) * s.cart.discount.percent) / 100) : 0;
export const selectTotal = (s) => selectSubtotal(s) - selectDiscountAmount(s);
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);

export default cartSlice.reducer;

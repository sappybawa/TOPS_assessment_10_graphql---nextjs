import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// configureStore automatically adds the redux-thunk middleware.
export const store = configureStore({ reducer: { cart: cartReducer } });

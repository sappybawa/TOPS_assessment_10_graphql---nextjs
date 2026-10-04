import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { GET_MENU, toMenuItem } from '../lib/apollo';
import { addItem } from '../store/cartSlice';
import FoodItemCard from '../components/FoodItemCard';
import CartSummary from '../components/CartSummary';

export default function Menu() {
  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(GET_MENU);
  const items = useMemo(() => (data?.posts?.data ?? []).map(toMenuItem), [data]);

  return (
    <div className="layout">
      <section>
        <h1>Restaurant Menu</h1>
        <div className="grid">
          {loading && Array.from({ length: 6 }, (_, i) => <FoodItemCard key={i} loading />)}
          {error && <FoodItemCard error={`Could not load menu: ${error.message}`} />}
          {items.map((item) => (
            <FoodItemCard key={item.id} item={item} onAdd={(i) => dispatch(addItem(i))} />
          ))}
        </div>
      </section>
      <CartSummary />
    </div>
  );
}

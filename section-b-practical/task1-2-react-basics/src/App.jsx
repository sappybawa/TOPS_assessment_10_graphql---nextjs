import FoodItemCard from './FoodItemCard.jsx';
import RestaurantList from './RestaurantList.jsx';

const foodItems = [
  { id: 1, name: 'Margherita Pizza', price: 249, category: 'Pizza', isAvailable: true },
  { id: 2, name: 'Veg Burger', price: 129, category: 'Burgers', isAvailable: true },
  { id: 3, name: 'Chocolate Brownie', price: 99, category: 'Dessert', isAvailable: false },
  { id: 4, name: 'Paneer Wrap', price: 149, category: 'Wraps', isAvailable: true },
  { id: 5, name: 'Cold Coffee', price: 89, category: 'Drinks', isAvailable: true },
  { id: 6, name: 'Caesar Salad', price: 179, category: 'Salads', isAvailable: false },
];

export default function App() {
  return (
    <main>
      <h1>Task 1 — Food Item Cards</h1>
      <div className="grid">
        {foodItems.map((item) => (
          <FoodItemCard key={item.id} {...item} />
        ))}
      </div>

      <h1>Task 2 — useFetchRestaurants</h1>
      <RestaurantList />
    </main>
  );
}

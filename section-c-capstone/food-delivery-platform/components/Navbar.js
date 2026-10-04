import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { selectCartCount } from '../store/cartSlice';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const count = useSelector(selectCartCount);

  const link = (href, label) => (
    <Link href={href} className={router.pathname === href ? 'active' : ''}>{label}</Link>
  );

  return (
    <nav className="navbar">
      <span className="brand">🍽️ FoodieAI</span>
      <div className="links">
        {link('/', 'Home')}
        {link('/menu', `Menu (🛒 ${count})`)}
        {link('/orders', 'Order History')}
        {user ? (
          <>
            <span className="muted">{user.email}</span>
            <button onClick={() => signOut(auth)}>Logout</button>
          </>
        ) : (
          link('/login', 'Login / Sign up')
        )}
      </div>
    </nav>
  );
}

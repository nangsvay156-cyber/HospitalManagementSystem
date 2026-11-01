import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../config/nav';
import Dashboard from '../pages/Dashboard';

export default function Home() {
  const { user } = useAuth();

  if (['admin', 'accountant'].includes(user.role)) {
    return <Dashboard />;
  }

  const firstAccessible = NAV_ITEMS.find((item) => item.to !== '/' && item.roles.includes(user.role));
  return <Navigate to={firstAccessible ? firstAccessible.to : '/login'} replace />;
}

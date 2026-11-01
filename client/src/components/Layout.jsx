import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../config/nav';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Activity size={20} strokeWidth={2.5} />
          <span>Meridian HMS</span>
        </div>
        <nav className="nav">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div>
            <div>
              <p style={{ fontWeight: 600 }}>{user.username}</p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 12 }} className="badge badge-neutral">
                {user.role}
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

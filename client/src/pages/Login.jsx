import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/');
  }

  return (
    <div className="login-screen">
      <div className="login-card card">
        <div className="login-brand">
          <Activity size={22} strokeWidth={2.5} />
          <span>Meridian HMS</span>
        </div>
        <h1 style={{ marginBottom: 4 }}>Sign in</h1>
        <p className="subtitle" style={{ marginBottom: 24 }}>Staff access to patients, appointments, and records.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <Loader2 size={16} className="spin" /> : 'Sign in'}
          </button>
        </form>

        <p className="login-hint">Demo: <span className="mono">admin / Admin@123</span> or <span className="mono">dr.smith / Doctor@123</span></p>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Users, Stethoscope, CalendarCheck, Wallet, AlertTriangle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, deptRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/reports/department-stats'),
        ]);
        setStats(dashRes.data);
        setDeptStats(deptRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="state-row"><Loader2 className="spin" size={18} /> Loading dashboard…</div>;
  if (error) return <div className="state-row error">{error}</div>;

  const cards = [
    { label: 'Total patients', value: stats.total_patients, icon: Users },
    { label: 'Total doctors', value: stats.total_doctors, icon: Stethoscope },
    { label: "Today's appointments", value: stats.todays_appointments, icon: CalendarCheck },
    { label: 'Revenue this month', value: `$${Number(stats.monthly_revenue).toFixed(2)}`, icon: Wallet },
    { label: 'Medicine stock alerts', value: stats.medicine_stock_alerts, icon: AlertTriangle, alert: stats.medicine_stock_alerts > 0 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Live snapshot of hospital operations.</p>
        </div>
      </div>

      <div className="vitals-strip">
        {cards.map(({ label, value, icon: Icon, alert }) => (
          <div className={`vital-card card${alert ? ' vital-alert' : ''}`} key={label}>
            <div className="vital-top">
              <Icon size={16} />
              <span>{label}</span>
            </div>
            <p className="vital-value">{value}</p>
            <div className="pulse-line" />
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h2 style={{ marginBottom: 16 }}>Appointments by department</h2>
        {deptStats.length === 0 ? (
          <p className="subtitle">No appointment data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7E3" vertical={false} />
              <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#5B6663' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5B6663' }} />
              <Tooltip cursor={{ fill: '#EFF1EE' }} />
              <Bar dataKey="appointment_count" fill="#0E4B45" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/client';

export default function Reports() {
  const [revenue, setRevenue] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/reports/revenue'), api.get('/reports/doctor-performance')])
      .then(([r, p]) => { setRevenue(r.data); setPerformance(p.data); })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load reports.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-row"><Loader2 className="spin" size={18} /> Loading reports…</div>;
  if (error) return <div className="state-row error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="subtitle">Revenue trends and doctor performance.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ marginBottom: 16 }}>Revenue collected per day</h2>
        {revenue.length === 0 ? (
          <p className="subtitle">No billing activity recorded yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7E3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5B6663' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5B6663' }} />
              <Tooltip />
              <Line type="monotone" dataKey="total_paid" stroke="#0E4B45" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ marginBottom: 16 }}>Doctor performance (completed appointments)</h2>
        {performance.length === 0 ? (
          <p className="subtitle">No completed appointments yet.</p>
        ) : (
          <table>
            <thead><tr><th>Doctor</th><th>Specialization</th><th>Completed</th></tr></thead>
            <tbody>
              {performance.map((row) => (
                <tr key={row.doctor_id}>
                  <td>{row.doctor?.full_name}</td>
                  <td>{row.doctor?.specialization}</td>
                  <td className="mono">{row.completed_appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

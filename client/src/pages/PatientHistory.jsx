import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function PatientHistory() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/patients/${id}/history`)
      .then(({ data }) => setPatient(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load patient history.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="state-row"><Loader2 className="spin" size={18} /> Loading…</div>;
  if (error) return <div className="state-row error">{error}</div>;
  if (!patient) return null;

  return (
    <div>
      <Link to="/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 16, color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Back to patients
      </Link>

      <div className="page-header">
        <div>
          <h1>{patient.full_name}</h1>
          <p className="subtitle">
            {patient.gender} · DOB {patient.date_of_birth} · {patient.blood_group || 'blood group unknown'} · {patient.phone}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Appointments</h3>
        {patient.appointments?.length ? (
          <table>
            <thead><tr><th>Date</th><th>Doctor</th><th>Status</th><th>Reason</th></tr></thead>
            <tbody>
              {patient.appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.appointment_date} {a.appointment_time}</td>
                  <td>{a.doctor?.full_name}</td>
                  <td><StatusBadge value={a.status} /></td>
                  <td>{a.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="subtitle">No appointments yet.</p>}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Medical records</h3>
        {patient.medicalRecords?.length ? (
          <table>
            <thead><tr><th>Visit date</th><th>Doctor</th><th>Diagnosis</th><th>Treatment</th></tr></thead>
            <tbody>
              {patient.medicalRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.visit_date}</td>
                  <td>{r.doctor?.full_name}</td>
                  <td>{r.diagnosis || '—'}</td>
                  <td>{r.treatment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="subtitle">No medical records yet.</p>}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Bills</h3>
        {patient.bills?.length ? (
          <table>
            <thead><tr><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>
              {patient.bills.map((b) => (
                <tr key={b.id}>
                  <td className="mono">${Number(b.total_amount).toFixed(2)}</td>
                  <td className="mono">${Number(b.paid_amount).toFixed(2)}</td>
                  <td className="mono">${Number(b.balance).toFixed(2)}</td>
                  <td><StatusBadge value={b.payment_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="subtitle">No bills yet.</p>}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import ResourcePage from '../components/ResourcePage';
import useOptions from '../hooks/useOptions';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import api from '../api/client';

function PayAction({ row, reload }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (row.payment_status === 'paid') return null;

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post(`/bills/${row.id}/pay`, { amount: parseFloat(amount), payment_method: method });
      setOpen(false);
      reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button className="icon-btn" title="Record payment" onClick={() => setOpen(true)}>
        <CreditCard size={15} />
      </button>
      {open && (
        <Modal title={`Record payment — balance $${Number(row.balance).toFixed(2)}`} onClose={() => setOpen(false)} width={380}>
          <form onSubmit={submit}>
            <div className="field">
              <label>Amount</label>
              <input type="number" step="0.01" required max={row.balance} value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
            </div>
            <div className="field">
              <label>Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="insurance">Insurance</option>
                <option value="online">Online</option>
              </select>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Recording…' : 'Record payment'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default function Billing() {
  const { options: patientOptions } = useOptions('/patients', (p) => p.full_name);
  const { options: appointmentOptions } = useOptions('/appointments', (a) => `#${a.id} · ${a.appointment_date}`);

  return (
    <ResourcePage
      title="Billing"
      subtitle="Invoices, payments, and outstanding balances."
      resource="/bills"
      canCreate={['admin', 'accountant', 'receptionist']}
      canWrite={['admin', 'accountant']}
      columns={[
        { key: 'patient', label: 'Patient', render: (row) => row.patient?.full_name || '—' },
        { key: 'total_amount', label: 'Total', render: (row) => `$${Number(row.total_amount).toFixed(2)}` },
        { key: 'paid_amount', label: 'Paid', render: (row) => `$${Number(row.paid_amount).toFixed(2)}` },
        { key: 'balance', label: 'Balance', render: (row) => `$${Number(row.balance).toFixed(2)}` },
        { key: 'payment_status', label: 'Status', render: (row) => <StatusBadge value={row.payment_status} /> },
      ]}
      formFields={[
        { name: 'patient_id', label: 'Patient', type: 'select', required: true, options: patientOptions },
        { name: 'appointment_id', label: 'Linked appointment', type: 'select', options: appointmentOptions },
        { name: 'consultation_fee', label: 'Consultation fee', type: 'number', required: true },
        { name: 'medicine_charges', label: 'Medicine charges', type: 'number' },
        { name: 'lab_fee', label: 'Lab fee', type: 'number' },
        { name: 'other_charges', label: 'Other charges', type: 'number' },
      ]}
      transformSubmit={(f) => ({
        ...f,
        consultation_fee: parseFloat(f.consultation_fee) || 0,
        medicine_charges: parseFloat(f.medicine_charges) || 0,
        lab_fee: parseFloat(f.lab_fee) || 0,
        other_charges: parseFloat(f.other_charges) || 0,
      })}
      rowActions={(row, reload) => <PayAction row={row} reload={reload} />}
    />
  );
}

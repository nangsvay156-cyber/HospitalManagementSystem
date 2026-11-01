import { CheckCircle2 } from 'lucide-react';
import ResourcePage from '../components/ResourcePage';
import useOptions from '../hooks/useOptions';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Prescriptions() {
  const { user } = useAuth();
  const { options: recordOptions } = useOptions('/medical-records', (r) => `#${r.id} · ${r.diagnosis || 'record'}`);
  const { options: medicineOptions } = useOptions('/medicines', (m) => `${m.name} (${m.stock_quantity} in stock)`);

  async function dispense(row, reload) {
    if (!confirm(`Dispense ${row.quantity} × ${row.medicine?.name}? This will reduce pharmacy stock.`)) return;
    try {
      await api.post(`/prescriptions/${row.id}/dispense`);
      reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Dispense failed.');
    }
  }

  return (
    <ResourcePage
      title="Prescriptions"
      subtitle="Medicines prescribed against a diagnosis, ready for dispensing."
      resource="/prescriptions"
      canWrite={['admin', 'doctor']}
      columns={[
        { key: 'medicalRecord', label: 'Record', render: (row) => `#${row.medicalRecord?.id ?? row.medical_record_id}` },
        { key: 'medicine', label: 'Medicine', render: (row) => row.medicine?.name || '—' },
        { key: 'dosage', label: 'Dosage' },
        { key: 'quantity', label: 'Qty' },
        {
          key: 'dispensed',
          label: 'Dispensed',
          render: (row) => (
            <span className={`badge ${row.dispensed ? 'badge-success' : 'badge-neutral'}`}>
              <span className="badge-dot" />{row.dispensed ? 'Yes' : 'No'}
            </span>
          ),
        },
      ]}
      formFields={[
        { name: 'medical_record_id', label: 'Medical record', type: 'select', required: true, options: recordOptions },
        { name: 'medicine_id', label: 'Medicine', type: 'select', required: true, options: medicineOptions },
        { name: 'dosage', label: 'Dosage', placeholder: 'e.g. 500mg twice daily' },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      ]}
      transformSubmit={(f) => ({ ...f, quantity: parseInt(f.quantity, 10) || 1 })}
      defaultValues={{ quantity: 1 }}
      rowActions={user.role === 'pharmacist' || user.role === 'admin' ? (row, reload) => (
        !row.dispensed && (
          <button className="icon-btn" title="Dispense" onClick={() => dispense(row, reload)}>
            <CheckCircle2 size={15} />
          </button>
        )
      ) : undefined}
    />
  );
}

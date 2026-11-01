import ResourcePage from '../components/ResourcePage';
import useOptions from '../hooks/useOptions';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'].map((s) => ({ value: s, label: s }));

export default function Appointments() {
  const { user } = useAuth();
  const { options: patientOptions } = useOptions('/patients', (p) => p.full_name);
  const { options: doctorOptions } = useOptions('/doctors', (d) => `${d.full_name} (${d.specialization})`);

  async function setStatus(row, status, reload) {
    try {
      await api.patch(`/appointments/${row.id}/status`, { status });
      reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not update status.');
    }
  }

  return (
    <ResourcePage
      title="Appointments"
      subtitle="Book, confirm, and track patient visits."
      resource="/appointments"
      canWrite={['admin', 'receptionist']}
      columns={[
        { key: 'patient', label: 'Patient', render: (row) => row.patient?.full_name || '—' },
        { key: 'doctor', label: 'Doctor', render: (row) => row.doctor?.full_name || '—' },
        { key: 'appointment_date', label: 'Date' },
        { key: 'appointment_time', label: 'Time' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'reason', label: 'Reason' },
      ]}
      formFields={[
        { name: 'patient_id', label: 'Patient', type: 'select', required: true, options: patientOptions },
        { name: 'doctor_id', label: 'Doctor', type: 'select', required: true, options: doctorOptions },
        { name: 'appointment_date', label: 'Date', type: 'date', required: true },
        { name: 'appointment_time', label: 'Time', type: 'time', required: true },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
        { name: 'reason', label: 'Reason', placeholder: 'e.g. Follow-up consultation' },
      ]}
      defaultValues={{ status: 'pending' }}
      rowActions={user.role === 'doctor' ? (row, reload) => (
        row.status === 'pending' || row.status === 'confirmed' ? (
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setStatus(row, 'completed', reload)}>Complete</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setStatus(row, 'cancelled', reload)}>Cancel</button>
          </>
        ) : null
      ) : undefined}
    />
  );
}

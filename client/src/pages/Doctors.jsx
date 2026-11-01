import ResourcePage from '../components/ResourcePage';
import useOptions from '../hooks/useOptions';

export default function Doctors() {
  const { options: departmentOptions } = useOptions('/departments', (d) => d.name);

  return (
    <ResourcePage
      title="Doctors"
      subtitle="Doctor directory, specializations, and department assignment."
      resource="/doctors"
      canWrite={['admin']}
      columns={[
        { key: 'full_name', label: 'Name' },
        { key: 'specialization', label: 'Specialization' },
        { key: 'department', label: 'Department', render: (row) => row.department?.name || '—' },
        { key: 'phone', label: 'Phone' },
        { key: 'consultation_fee', label: 'Fee', render: (row) => `$${Number(row.consultation_fee).toFixed(2)}` },
        { key: 'working_schedule', label: 'Schedule' },
      ]}
      formFields={[
        { name: 'full_name', label: 'Full name', required: true },
        { name: 'specialization', label: 'Specialization', required: true },
        { name: 'department_id', label: 'Department', type: 'select', options: departmentOptions },
        { name: 'phone', label: 'Phone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'consultation_fee', label: 'Consultation fee', type: 'number', required: true },
        { name: 'working_schedule', label: 'Working schedule', placeholder: 'Mon-Fri 09:00-17:00' },
      ]}
      transformSubmit={(f) => ({ ...f, consultation_fee: parseFloat(f.consultation_fee) || 0, department_id: f.department_id || null })}
    />
  );
}

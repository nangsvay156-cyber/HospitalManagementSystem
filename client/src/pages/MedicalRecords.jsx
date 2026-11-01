import ResourcePage from '../components/ResourcePage';
import useOptions from '../hooks/useOptions';

export default function MedicalRecords() {
  const { options: patientOptions } = useOptions('/patients', (p) => p.full_name);
  const { options: doctorOptions } = useOptions('/doctors', (d) => d.full_name);
  const { options: appointmentOptions } = useOptions('/appointments', (a) => `#${a.id} · ${a.appointment_date}`);

  return (
    <ResourcePage
      title="Medical Records"
      subtitle="Diagnoses, treatment history, and clinical notes."
      resource="/medical-records"
      canWrite={['admin', 'doctor']}
      columns={[
        { key: 'patient', label: 'Patient', render: (row) => row.patient?.full_name || '—' },
        { key: 'doctor', label: 'Doctor', render: (row) => row.doctor?.full_name || '—' },
        { key: 'visit_date', label: 'Visit date' },
        { key: 'diagnosis', label: 'Diagnosis' },
        { key: 'prescriptions', label: 'Prescriptions', render: (row) => row.prescriptions?.length ?? 0 },
      ]}
      formFields={[
        { name: 'patient_id', label: 'Patient', type: 'select', required: true, options: patientOptions },
        { name: 'doctor_id', label: 'Doctor', type: 'select', required: true, options: doctorOptions },
        { name: 'appointment_id', label: 'Linked appointment', type: 'select', options: appointmentOptions },
        { name: 'visit_date', label: 'Visit date', type: 'date', required: true },
        { name: 'diagnosis', label: 'Diagnosis' },
        { name: 'symptoms', label: 'Symptoms', type: 'textarea' },
        { name: 'treatment', label: 'Treatment', type: 'textarea' },
        { name: 'allergies', label: 'Allergies' },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}

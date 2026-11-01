import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import ResourcePage from '../components/ResourcePage';
import { useAuth } from '../context/AuthContext';

export default function Patients() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canViewHistory = ['admin', 'doctor'].includes(user.role);

  return (
    <ResourcePage
      title="Patients"
      subtitle="Patient registry and demographic details."
      resource="/patients"
      canWrite={['admin', 'receptionist']}
      columns={[
        { key: 'full_name', label: 'Name' },
        { key: 'gender', label: 'Gender' },
        { key: 'date_of_birth', label: 'DOB' },
        { key: 'phone', label: 'Phone' },
        { key: 'blood_group', label: 'Blood group' },
      ]}
      formFields={[
        { name: 'full_name', label: 'Full name', required: true },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
          { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
        ] },
        { name: 'date_of_birth', label: 'Date of birth', type: 'date', required: true },
        { name: 'phone', label: 'Phone', required: true },
        { name: 'address', label: 'Address' },
        { name: 'blood_group', label: 'Blood group', placeholder: 'O+' },
        { name: 'emergency_contact', label: 'Emergency contact' },
      ]}
      rowActions={canViewHistory ? (row) => (
        <button className="icon-btn" title="View history" onClick={() => navigate(`/patients/${row.id}/history`)}>
          <FileText size={15} />
        </button>
      ) : undefined}
    />
  );
}

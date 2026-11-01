import ResourcePage from '../components/ResourcePage';

export default function Departments() {
  return (
    <ResourcePage
      title="Departments"
      subtitle="Hospital departments and their assigned head doctor."
      resource="/departments"
      canWrite={['admin']}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        {
          key: 'headDoctor',
          label: 'Head doctor',
          render: (row) => row.headDoctor?.full_name || '—',
        },
        {
          key: 'doctors',
          label: 'Doctors',
          render: (row) => row.doctors?.length ?? 0,
        },
      ]}
      formFields={[
        { name: 'name', label: 'Department name', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}

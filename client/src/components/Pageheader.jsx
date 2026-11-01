import './PageHeader.css';

/**
 * Reusable page header used across all list pages
 * (Patients, Doctors, Departments, Appointments, etc.)
 *
 * Usage:
 * <PageHeader
 *   title="Patients"
 *   subtitle="Patient registry and demographic details."
 *   actionLabel="Add Patient"
 *   onAction={() => setShowModal(true)}
 *   Icon={Plus} // from lucide-react
 * />
 */
export default function PageHeader({ title, subtitle, actionLabel, onAction, Icon }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {actionLabel && (
        <button className="btn btn-primary" onClick={onAction}>
          {Icon && <Icon size={16} strokeWidth={2.5} />}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
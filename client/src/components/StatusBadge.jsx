const TONE_MAP = {
  confirmed: 'success', completed: 'success', paid: 'success', active: 'success',
  pending: 'warning', partial: 'warning',
  cancelled: 'danger', unpaid: 'danger',
};

export default function StatusBadge({ value }) {
  const tone = TONE_MAP[String(value).toLowerCase()] || 'neutral';
  return (
    <span className={`badge badge-${tone}`}>
      <span className="badge-dot" />
      {value}
    </span>
  );
}

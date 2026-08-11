const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'dashboard', label: 'Security Dashboard' },
  { id: 'skills', label: 'Metrics & Skills' },
  { id: 'credentials', label: 'Education & Certs' },
  { id: 'hiring', label: 'Hiring? Reach out →', hire: true },
];

export default function TabNav({ active, onChange }) {
  return (
    <div className="tab-nav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${t.hire ? 'tab-hire' : ''} ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

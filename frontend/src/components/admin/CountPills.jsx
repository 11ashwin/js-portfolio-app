export default function CountPills({ counts, active, onChange }) {
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c.count]));
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  const pills = [
    { key: null, label: 'All', count: total },
    { key: 'new', label: 'New', count: byStatus.new || 0 },
    { key: 'contacted', label: 'Contacted', count: byStatus.contacted || 0 },
    { key: 'archived', label: 'Archived', count: byStatus.archived || 0 },
  ];

  return (
    <div className="counts">
      {pills.map((p) => (
        <button key={p.label} className={`count-pill ${active === p.key ? 'active' : ''}`} onClick={() => onChange(p.key)}>
          {p.label} · <b>{p.count}</b>
        </button>
      ))}
    </div>
  );
}

function initials(name) {
  return (
    (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('') || '?'
  );
}

export default function InquiryCard({ inquiry, onStatusChange, onDelete }) {
  const date = new Date(inquiry.created_at).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="inq-card">
      <div className="inq-top">
        <div className="inq-who">
          <div className="inq-avatar">{initials(inquiry.name)}</div>
          <div>
            <div className="inq-name">{inquiry.name}</div>
            <div className="inq-company">
              {inquiry.company} · <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
            </div>
          </div>
        </div>
        <div className="inq-meta-right">
          <span className="inq-date">{date}</span>
          <div className="inq-actions">
            <select className="status-select" value={inquiry.status} onChange={(e) => onStatusChange(inquiry.id, e.target.value)}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="archived">Archived</option>
            </select>
            <button className="icon-btn" onClick={() => onDelete(inquiry.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="inq-body">
        <div>
          <div className="inq-block-label">Role</div>
          <div className="inq-role">{inquiry.role}</div>
          <div className="inq-sub">{inquiry.location || '—'}</div>
          <div className="inq-sub">{inquiry.employment_type || '—'}</div>
        </div>
        <div>
          <div className="inq-block-label">Details</div>
          <div className="inq-desc">{inquiry.description}</div>
          <div className="inq-extra">
            {inquiry.salary_range && <span>💰 {inquiry.salary_range}</span>}
            {inquiry.job_url && (
              <a href={inquiry.job_url} target="_blank" rel="noopener noreferrer">
                Job posting ↗
              </a>
            )}
          </div>
        </div>
        <div>
          <div className="inq-block-label">Interests</div>
          <div className="chips">
            {(inquiry.interests || []).length ? (
              inquiry.interests.map((i) => (
                <span className="chip" key={i}>
                  {i}
                </span>
              ))
            ) : (
              <span className="inq-sub">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

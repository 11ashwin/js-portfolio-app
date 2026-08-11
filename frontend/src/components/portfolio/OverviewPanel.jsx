import { whatIBring, timeline, projects, pipelineStatus } from '../../data/content.js';

function badgeClass(status) {
  if (status === 'Complete') return 'badge-green';
  return 'badge-amber';
}

export default function OverviewPanel() {
  return (
    <div className="tab-panel active">
      <p className="sec-label mb-14">About</p>
      <div className="summary-card mb-28">
        Cybersecurity professional with 4+ years across incident response, WAF management, EDR, cloud
        security, and vulnerability management. Proven track record detecting and neutralising threats
        using MITRE ATT&amp;CK-aligned frameworks in financial media, data centres, and critical
        infrastructure. Actively building AI-augmented security tooling and DevSecOps pipelines. Seeking
        a senior role across Southeast Asia and the Asia-Pacific region.
      </div>

      <p className="sec-label mb-14">What I bring</p>
      <div className="bring-grid">
        {whatIBring.map((item) => (
          <div className="bring-item" key={item}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </div>
        ))}
      </div>

      <p className="sec-label mb-14">Experience</p>
      {/* Placeholder timeline — replace ranges/titles/employers in src/data/content.js with your real work history */}
      <div className="timeline">
        {timeline.map((t) => (
          <div className="tl-item" key={t.role + t.range}>
            <div className="tl-range">{t.range}</div>
            <div className="tl-role">{t.role}</div>
            <div className="tl-org">{t.org}</div>
          </div>
        ))}
      </div>

      <p className="sec-label mb-14">Projects</p>
      {projects.map((p) => (
        <div className="project-card" key={p.name}>
          <div className="project-header">
            <p className="project-name">{p.name}</p>
            <span className={`project-tag ${p.tagClass}`}>{p.tag}</span>
          </div>
          <p className="project-meta">{p.meta}</p>
          <ul className="project-bullets">
            {p.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <p className="sec-label mb-14 mt-36">Pipeline status</p>
      <table className="status-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pipelineStatus.map(([name, desc, status]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{desc}</td>
              <td>
                <span className={`badge ${badgeClass(status)}`}>{status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

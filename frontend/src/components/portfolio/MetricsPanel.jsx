import { stats, skills } from '../../data/content.js';

export default function MetricsPanel() {
  return (
    <div className="tab-panel active">
      <p className="sec-label mb-14">Impact metrics</p>
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.desc}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <p className="sec-label mb-14">Skills</p>
      <div className="skill-grid">
        {skills.map((s) => (
          <div className="skill-card" key={s.title}>
            <div className="skill-title">{s.title}</div>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

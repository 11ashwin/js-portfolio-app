import { interestOptions, preferredLocations } from '../../data/content.js';
import HiringForm from './HiringForm.jsx';

export default function HiringPanel() {
  return (
    <div className="tab-panel active">
      <div className="hire-intro">
        <div>
          <h2>Are you hiring for a cybersecurity role?</h2>
          <p>Tell me about the role and I&apos;ll get back to you directly — usually within 1–2 business days. No recruiter spam, just a genuine role match.</p>
        </div>
      </div>

      <div className="hire-badges">
        {interestOptions.map((opt) => (
          <span className="hire-badge" key={opt}>
            {opt}
          </span>
        ))}
      </div>

      <p className="sec-label mb-14">Preferred locations</p>
      <div className="hire-badges" style={{ marginBottom: 36 }}>
        {preferredLocations.map((loc) => (
          <span className="hire-badge" key={loc}>
            ✓ {loc}
          </span>
        ))}
      </div>

      <HiringForm />
    </div>
  );
}

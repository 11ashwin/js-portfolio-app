const CERT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const certifications = [
  'Certified Ethical Hacker (CEHv13)',
  'Cortex XDR: Multi-Method Malware Prevention',
  'Akamai Web Performance Foundations',
];

export default function CredentialsPanel() {
  return (
    <div className="tab-panel active">
      <p className="sec-label mb-14">Education</p>
      <div className="edu-block">
        <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#e6edf3', marginBottom: 3 }}>
          Bachelor of Engineering
        </p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
          University of Mumbai · 2019
        </p>
      </div>

      <p className="sec-label mb-14">Certifications</p>
      {certifications.map((cert) => (
        <div className="cert-item" key={cert}>
          <div className="cert-icon">{CERT_ICON}</div>
          {cert}
        </div>
      ))}
    </div>
  );
}

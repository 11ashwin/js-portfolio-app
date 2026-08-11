import FalcoDashboard from './FalcoDashboard.jsx';
import DocsSection from './DocsSection.jsx';

export default function DashboardPanel() {
  return (
    <div className="tab-panel active">
      <FalcoDashboard />

      <p className="sec-label mb-14">Platform architecture</p>
      <div className="arch-wrap" style={{ marginBottom: 28 }}>
        <img src="/architecture-diagram.svg" alt="Platform architecture diagram: CI/CD pipeline from GitHub through scanning, signing, GitOps deployment, admission control, and runtime monitoring" style={{ width: '100%', display: 'block' }} />
      </div>

      <DocsSection />
    </div>
  );
}

import { componentBreakdown, securityPrinciples, testAlerts, skillsDemonstrated } from '../../data/content.js';

const PIPELINE_CODE = `Developer (git push)
    │
    ▼
GitHub Repository        source code + Kubernetes manifests
    │
    ▼
GitHub Actions CI/CD
    ├── Gitleaks secret scan        planned — re-integrating into pipeline
    ├── Semgrep (SAST)              source-code analysis, becoming a PR gate
    ├── Trivy filesystem scan
    ├── Socket.dev (SCA)            exploring — dependency / supply-chain risk
    ├── Docker build                ARM64 + AMD64 multi-arch
    ├── Trivy image scan            block on HIGH / CRITICAL CVEs
    ├── OWASP ZAP (DAST)            scans running app · 57 pass / 10 warn / 0 fail
    ├── Generate SBOM               Syft · CycloneDX
    ├── Cosign sign + verify        supply chain integrity
    ├── Push to Docker Hub          versioned, signed image tag
    └── Update deployment.yaml      manifest auto-update, committed to Git
                │
                ▼
          Argo CD                       watches Git → syncs automatically
                │
                ▼
        Kyverno admission control       block :latest tag · block hostPath
                │
                ▼
      Kubernetes (Minikube)
                │
    ┌───────────┼───────────────┬───────────────┬───────────────┐
    │           │               │               │               │
    ▼           ▼               ▼               ▼               ▼
Resume app   Falco     Trivy Operator   Prometheus → Grafana       Kite
                │             (config ✓ / vuln ⚠)     │
                ▼                                        │
          Falcosidekick → Loki ───────────────────────────┘`;

export default function DocsSection() {
  return (
    <>
      <p className="sec-label mb-14">Project documentation</p>
      <details className="docs-toggle">
        <summary>Show full technical documentation (pipeline flow, component breakdown, security principles, test alerts)</summary>

        <div className="doc-section">
          <div className="doc-h2">Overview</div>
          <p className="doc-p">
            A production-inspired DevSecOps platform demonstrating the complete secure software delivery
            lifecycle: code commit, vulnerability scanning, software supply chain protection (SBOM + image
            signing), GitOps deployment, admission control, runtime threat detection, continuous posture
            assessment, monitoring, and cluster management. Every code push triggers an automated chain —
            nothing reaches the cluster unscanned, unsigned, or unverified.
          </p>
        </div>

        <div className="doc-section">
          <div className="doc-h2">Pipeline flow</div>
          <div className="doc-code">{PIPELINE_CODE}</div>
        </div>

        <div className="doc-section">
          <div className="doc-h2">Component breakdown</div>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              {componentBreakdown.map(([name, desc]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <div className="doc-h2">Security principles</div>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Principle</th>
                <th>Implementation</th>
              </tr>
            </thead>
            <tbody>
              {securityPrinciples.map(([name, desc]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <div className="doc-h2">Test alerts generated</div>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Rule triggered</th>
                <th>Action</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {testAlerts.map(([rule, action, sev]) => (
                <tr key={rule}>
                  <td>{rule}</td>
                  <td>{action}</td>
                  <td>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>
                      {sev}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <div className="doc-h2">Skills demonstrated</div>
          <p className="doc-p">{skillsDemonstrated}</p>
        </div>
      </details>
    </>
  );
}

export const contact = {
  name: 'Ashwin Yadav',
  phone: '+91 82916 60070',
  phoneHref: 'tel:+918291660070',
  email: 'ashwin09yadav@gmail.com',
  linkedin: 'linkedin.com/in/ashwinyadav11',
  linkedinHref: 'https://linkedin.com/in/ashwinyadav11',
  // Replace with your real GitHub URL
  github: 'github.com/YOUR_USERNAME',
  githubHref: 'https://github.com/YOUR_USERNAME',
  resumeHref: '/Ashwin_Yadav_Resume.pdf',
};

export const whatIBring = [
  '4+ years Security Operations',
  'SIEM + EDR + WAF experience',
  'Cloud Security (Wiz / Orca)',
  'DevSecOps Engineering',
  'AI Security Research',
  'Kubernetes Security',
];

// Placeholder dates/employers — replace with your real work history
export const timeline = [
  { range: '2024 — Present', role: 'Senior Cyber Security Analyst', org: 'Add your employer + 3–4 bullets: CrowdStrike EDR ops, Chronicle SIEM, threat hunting, incident response, WAF management, cloud security assessments' },
  { range: 'Add year — Add year', role: 'Cyber Security Engineer', org: 'Add your employer + role summary' },
  { range: 'Add year — Add year', role: 'SOC Analyst', org: 'Add your employer + role summary' },
];

export const projects = [
  {
    name: 'Production-inspired DevSecOps platform',
    tag: 'DevSecOps · 2026',
    tagClass: 'tag-blue',
    meta: 'GitHub Actions · Docker · Semgrep · OWASP ZAP · Syft · Cosign · Argo CD · Kyverno · Falco · Trivy Operator · Prometheus · Loki · Grafana · Kite',
    bullets: [
      'Engineered an end-to-end secure CI/CD pipeline on GitHub Actions: Trivy filesystem and image scans, SAST with Semgrep, SBOM generation (Syft, CycloneDX), multi-arch Docker builds, Cosign image signing and signature verification, and automated manifest updates back to Git.',
      'Added a DAST layer with OWASP ZAP against the running application in CI — latest scan cleared 57 passive checks with zero new-fail findings, surfacing header/CSP hardening gaps for remediation.',
      'Evaluating Socket.dev alongside Trivy for deeper supply-chain / dependency-risk analysis, and re-integrating Gitleaks as a dedicated secret-scanning stage in the pipeline.',
      'Implemented GitOps-based continuous deployment with Argo CD — watches the Git repository and automatically synchronises the Kubernetes cluster, keeping it drift-free with no manual deployments.',
      'Enforced admission-control policy with Kyverno — blocks :latest image tags and hostPath mounts so unsafe manifests are rejected before they ever reach the cluster.',
      'Added continuous in-cluster posture assessment with Trivy Operator, generating ConfigAuditReports for every running workload, with VulnerabilityReport scanning currently being debugged.',
      'Integrated Falco runtime security with Falcosidekick alerting, forwarding events into Loki for log aggregation, Prometheus for metrics, and a custom Grafana dashboard for real-time security event monitoring across severity, rules, namespaces, and pods.',
      'Added Kite as a lightweight cluster-management UI for browsing workloads and namespaces alongside Argo CD\u2019s GitOps view.',
      'Hardened infrastructure by enforcing strict Pod Security Contexts — non-root execution and dropped default Linux capabilities — to mitigate container breakout risk.',
    ],
  },
  {
    name: 'PentestAGI — AI-augmented penetration testing',
    tag: 'Research · 2025–2026',
    tagClass: 'tag-amber',
    meta: 'Agentic AI security tooling · use-case evaluation',
    bullets: [
      'Evaluated an AI-driven autonomous penetration testing agent across multiple attack-surface use cases, assessing its ability to perform reconnaissance, vulnerability discovery, and exploitation chaining without manual guidance.',
      'Tested agent behaviour across web application targets — validated subdomain enumeration, service fingerprinting, and automated OWASP Top 10 probe generation, benchmarking against manual methodology.',
      'Investigated prompt-injection resistance and guardrail bypass scenarios to understand where agentic AI fails safely versus unsafely in adversarial contexts.',
      'Documented operational limits, false-positive rates, and integration gaps to inform future red-team augmentation workflows.',
    ],
  },
];

export const pipelineStatus = [
  ['Resume website', 'Static HTML/CSS served via NGINX', 'Complete'],
  ['Docker', 'Multi-arch image, non-root, Docker Hub push', 'Complete'],
  ['GitHub Actions CI', 'Build, scan, sign, push, tag automation', 'Complete'],
  ['Trivy scanning', 'Filesystem & image vulnerability scanning', 'Complete'],
  ['Semgrep (SAST)', 'Static source-code analysis for injection, XSS & insecure patterns', 'In progress'],
  ['OWASP ZAP (DAST)', 'Runtime scan of the deployed app — 57 pass / 10 warn / 0 fail on latest run', 'Partial'],
  ['Gitleaks', 'Dedicated secret-scanning stage in CI', 'Planned'],
  ['Socket.dev', 'Supply-chain / dependency-risk analysis', 'Exploring'],
  ['SBOM generation', 'CycloneDX SBOM via Syft', 'Complete'],
  ['Image signing', 'Cosign sign + verify before deploy', 'Complete'],
  ['Kubernetes', 'Minikube cluster, NGINX Ingress', 'Complete'],
  ['Argo CD / GitOps', 'Synced, healthy, auto-deploy on push', 'Complete'],
  ['Kyverno policies', 'Block latest tag, block hostPath', 'Complete'],
  ['Trivy Operator — config audit', 'ConfigAuditReports for in-cluster workloads (e.g. Argo CD components)', 'Complete'],
  ['Trivy Operator — vulnerability scan', 'VulnerabilityReport jobs stuck at Init — Trivy DB pull from mirror.gcr.io not completing', 'Partial'],
  ['Falco runtime security', 'Container threat detection + alerting', 'Complete'],
  ['Loki', 'Log aggregation, Falco event forwarding', 'Complete'],
  ['Prometheus', 'Metrics scraping, ServiceMonitor configured', 'Complete'],
  ['Grafana dashboard', 'Severity, rules, namespace, pod panels', 'Complete'],
  ['Kite dashboard', 'Web UI for cluster/workload management', 'Complete'],
  ['Manifest auto-update', 'GitHub Actions updates deployment.yaml tag', 'Complete'],
  ['NetworkPolicies', 'Restrict traffic around Argo CD repo-server', 'Planned'],
  ['GitHub Pages', 'Public portfolio hosting', 'Complete'],
  ['Automation scripts', 'install.sh, start.sh, port-forward.sh', 'Complete'],
];

export const stats = [
  { num: '40%', desc: 'Cloud risk reduction in 3 months via Orca Security' },
  { num: '30%', desc: 'Faster MTTD via redesigned CrowdStrike + Chronicle workflows' },
  { num: '0', desc: 'Production downtime during F5 Silverline → F5 XC migration (10+ clients)' },
  { num: '25%', desc: 'Fewer Akamai WAF false positives via policy & bot tuning' },
];

export const skills = [
  { title: 'Detection & response', body: 'CrowdStrike Falcon, Cortex XDR, IBM QRadar SIEM, Google Chronicle, MITRE ATT&CK' },
  { title: 'WAF & web security', body: 'Akamai WAF, F5 Silverline, F5 XC, OWASP Top 10, Bot Management, SSL/TLS' },
  { title: 'Cloud & DevSecOps', body: 'WIZ, Orca Security, AWS, Docker, Kubernetes, GitHub Actions CI/CD, Argo CD, Kyverno, Falco, Trivy & Trivy Operator, Syft, Cosign' },
  { title: 'Offensive tools', body: 'Burp Suite, Kali Linux, Nmap, Wireshark, Metasploit' },
  { title: 'Threat intel & infra', body: 'FortiRecon, Aquilai, Threat Hunting, DDoS Mitigation, Enterprise Linux' },
  { title: 'Frameworks', body: 'MITRE ATT&CK, CVSS, OWASP, NIST CSF, ISO 27001' },
];

export const interestOptions = [
  'SOC / Incident Response',
  'Threat Hunting',
  'WAF / Application Security',
  'Cloud Security',
  'DevSecOps',
  'Kubernetes Security',
];

export const preferredLocations = ['Singapore', 'Malaysia', 'Thailand', 'UAE', 'Australia', 'Remote'];

export const componentBreakdown = [
  ['Docker', 'Packages the application into a container. Runs as a non-root user with minimal Linux capabilities — minimal blast radius on any breakout.'],
  ['GitHub Actions', 'Automates the full build-scan-sign-push-deploy chain on every commit. No manual steps between code and cluster.'],
  ['Gitleaks', 'Secret-scanning stage being re-integrated into the CI pipeline to catch hardcoded credentials before commit.'],
  ['Semgrep', 'Static analysis (SAST) on source code — flags SQL/command injection, XSS, hardcoded secrets and insecure patterns without executing the app. Being wired in as a PR-level security gate.'],
  ['Trivy', "Scans both the filesystem and the final Docker image for known CVEs. Any High or Critical finding blocks the pipeline — nothing ships until it's clean."],
  ['Socket.dev', 'Supply-chain and dependency-risk analysis, currently being evaluated alongside Trivy for deeper SCA coverage.'],
  ['OWASP ZAP', 'Dynamic analysis (DAST) against the running application in CI. Latest run: 57 passive checks passed, 10 warnings (missing security headers), 0 new failures.'],
  ['Syft', 'Generates a CycloneDX SBOM for every image — full software inventory for supply-chain visibility and vulnerability management.'],
  ['Cosign', "Signs every image after it's built, then verifies the signature before it's allowed to proceed — only verified images reach deployment."],
  ['Docker Hub', 'Stores versioned, signed image tags. Only images that passed the Trivy gate and Cosign verification land here.'],
  ['Argo CD', 'Watches the Git repository for manifest changes and automatically synchronises the cluster — Git is the single source of truth.'],
  ['Kyverno', 'Admission controller that validates Kubernetes resources before they\u2019re created — rejects :latest image tags and hostPath mounts.'],
  ['Kubernetes', 'Runs the application on a Minikube cluster with NGINX Ingress. Pod Security Contexts enforce non-root execution and dropped capabilities.'],
  ['Falco', 'Container security agent watching every container action at the kernel level — shells spawned, API server contacts, unexpected file writes — fires a structured alert on rule match.'],
  ['Falcosidekick', 'Routes Falco alerts to Loki (log aggregation) and Prometheus (metric aggregation and persistence).'],
  ['Trivy Operator', 'Continuously scans in-cluster workloads. ConfigAuditReport generation is working (e.g. Argo CD components); VulnerabilityReport jobs are currently stuck at pod-init while pulling the Trivy DB.'],
  ['Loki', 'Aggregates logs from the cluster, including forwarded Falco runtime events, queried and visualised through Grafana.'],
  ['Prometheus', 'Scrapes Falco metrics on a configured interval, stores as time-series data for querying.'],
  ['Grafana', 'Visualises Prometheus and Loki data: total alerts, severity breakdown, top rules, alerts by pod, live event feed.'],
  ['Kite', 'Lightweight web UI for browsing workloads, namespaces, and pods — general cluster administration alongside Argo CD\u2019s GitOps view.'],
];

export const securityPrinciples = [
  ['Shift left', 'Trivy scans the filesystem and image before anything reaches a registry — vulnerability gates are in the pipeline, not an afterthought.'],
  ['Defense in depth', 'Semgrep covers static code analysis (SAST) and OWASP ZAP covers the running application (DAST) — vulnerabilities are caught whether they live in source or only appear at runtime.'],
  ['Supply chain integrity', 'Every image ships with a Syft-generated SBOM and a Cosign signature; only verified, signed images are deployed.'],
  ['Immutable infra', 'No one logs into a server to make changes. Every change goes through Git and is applied by Argo CD.'],
  ['Policy as code', "Kyverno admission policies reject unsafe manifests (mutable tags, host filesystem mounts) before they're created."],
  ['Least privilege', 'Containers run non-root with dropped capabilities. Minimal blast radius on any breakout.'],
  ['Runtime visibility', 'Falco provides continuous monitoring after deployment — unexpected container behaviour is detected and recorded immediately.'],
  ['Continuous assessment', 'Trivy Operator re-scans running workloads in-cluster, catching drift and newly disclosed CVEs after deployment.'],
  ['GitOps', 'Git is the source of truth. Cluster state is always a direct reflection of the repository — no drift, no snowflakes.'],
];

export const testAlerts = [
  ['Terminal shell in container', 'kubectl exec into a running pod', 'notice'],
  ['Run shell untrusted', 'Process spawned a shell outside expected startup paths', 'notice'],
  ['Contact K8s API server', 'Pod attempted to reach the cluster control plane', 'notice'],
  ['Kyverno policy violation', 'Manifest using :latest tag or hostPath rejected at admission', 'notice'],
];

export const skillsDemonstrated =
  'GitHub Actions CI/CD · Docker · Kubernetes · GitOps with Argo CD · Trivy & Trivy Operator · Semgrep (SAST) · OWASP ZAP (DAST) · Syft SBOM generation · Cosign image signing · Kyverno policy enforcement · Falco runtime security · Loki · Prometheus · Grafana · Kite · Kubernetes RBAC and security best practices · DevSecOps automation.';

// Falco demo dashboard — static sample data illustrating the monitoring
// stack. Not a live feed; wire this up to a real metrics endpoint if you
// want it to reflect actual cluster state.
export const falcoDemo = {
  rules: [
    { name: 'Terminal shell in container', count: 3 },
    { name: 'Run shell untrusted', count: 2 },
  ],
  alerts: [
    { sev: 'notice', rule: 'Terminal shell in container', pod: 'pdwkt', time: '09:14:22' },
    { sev: 'notice', rule: 'Terminal shell in container', pod: 'pdwkt', time: '08:51:07' },
    { sev: 'notice', rule: 'Terminal shell in container', pod: 'pdwkt', time: '06:33:45' },
    { sev: 'notice', rule: 'Run shell untrusted', pod: 'b5696', time: '04:12:11' },
    { sev: 'notice', rule: 'Run shell untrusted', pod: 'pdwkt', time: '01:47:58' },
  ],
  timeline: ['12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00'],
  timelineData: [0, 0, 1, 0, 1, 1, 0, 1],
  severity: { labels: ['Notice', 'Warning', 'Critical'], data: [4, 0, 0], colors: ['#58a6ff', '#d29922', '#f85149'] },
};

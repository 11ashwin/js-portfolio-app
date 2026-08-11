import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { falcoDemo } from '../../data/content.js';

const TOOLTIP_STYLE = { backgroundColor: '#161b22', borderColor: 'rgba(255,255,255,.06)', borderWidth: 1, titleColor: '#cdd9e5', bodyColor: '#768390', padding: 8, cornerRadius: 6 };
const TICK_STYLE = { color: '#444c56', font: { family: "'JetBrains Mono',monospace", size: 10 } };
const GRID_STYLE = { color: 'rgba(255,255,255,.04)' };

export default function FalcoDashboard() {
  const timeCanvasRef = useRef(null);
  const sevCanvasRef = useRef(null);
  const timeChartRef = useRef(null);
  const sevChartRef = useRef(null);
  const [range, setRange] = useState('24');

  useEffect(() => {
    timeChartRef.current = new Chart(timeCanvasRef.current, {
      type: 'bar',
      data: {
        labels: falcoDemo.timeline,
        datasets: [
          { label: 'Notice', data: falcoDemo.timelineData, backgroundColor: 'rgba(88,166,255,.4)', borderColor: 'rgba(88,166,255,.8)', borderWidth: 1, borderRadius: 3 },
          { label: 'Warning', data: falcoDemo.timelineData.map(() => 0), backgroundColor: 'rgba(210,153,34,.4)', borderColor: 'rgba(210,153,34,.8)', borderWidth: 1, borderRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { ...TOOLTIP_STYLE, mode: 'index', intersect: false } },
        scales: { x: { grid: GRID_STYLE, ticks: TICK_STYLE }, y: { grid: GRID_STYLE, ticks: { ...TICK_STYLE, stepSize: 1, precision: 0 }, min: 0 } },
      },
    });

    sevChartRef.current = new Chart(sevCanvasRef.current, {
      type: 'doughnut',
      data: {
        labels: falcoDemo.severity.labels,
        datasets: [{ data: falcoDemo.severity.data, backgroundColor: falcoDemo.severity.colors.map((c) => c + '99'), borderColor: falcoDemo.severity.colors, borderWidth: 1, hoverOffset: 4 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: TOOLTIP_STYLE } },
    });

    return () => {
      timeChartRef.current?.destroy();
      sevChartRef.current?.destroy();
    };
  }, []);

  const factor = range === '24' ? 1 : range === '12' ? 0.6 : 0.3;
  const total = Math.max(1, Math.round(4 * factor));
  const maxRuleCount = Math.max(...falcoDemo.rules.map((r) => r.count));

  return (
    <>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', marginBottom: 2 }}>🛡️ Falco Runtime Security</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--muted)' }}>kubernetes · default namespace · resume-deployment</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 9px', borderRadius: 6, cursor: 'pointer' }}
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="24">Last 24 h</option>
            <option value="12">Last 12 h</option>
            <option value="6">Last 6 h</option>
          </select>
          <div className="live-pill">live</div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="dash-5col" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7, marginBottom: 10 }}>
        <div className="dstat dstat-blue" style={{ padding: '10px 12px' }}>
          <div className="dstat-label" style={{ marginBottom: 5 }}>Total</div>
          <div className="dstat-num dstat-num-blue" style={{ fontSize: 26, marginBottom: 3 }}>{total}</div>
          <div className="dstat-hint">alerts · {range} h</div>
        </div>
        <div className="dstat dstat-green" style={{ padding: '10px 12px' }}>
          <div className="dstat-label" style={{ marginBottom: 5 }}>Notice</div>
          <div className="dstat-num dstat-num-green" style={{ fontSize: 26, marginBottom: 3 }}>{total}</div>
          <div className="dstat-hint">low severity</div>
        </div>
        <div className="dstat dstat-amber" style={{ padding: '10px 12px' }}>
          <div className="dstat-label" style={{ marginBottom: 5 }}>Warning</div>
          <div className="dstat-num dstat-num-amber" style={{ fontSize: 26, marginBottom: 3 }}>0</div>
          <div className="dstat-hint">med severity</div>
        </div>
        <div className="dstat dstat-red" style={{ padding: '10px 12px' }}>
          <div className="dstat-label" style={{ marginBottom: 5 }}>Critical</div>
          <div className="dstat-num dstat-num-red" style={{ fontSize: 26, marginBottom: 3 }}>0</div>
          <div className="dstat-hint">high severity</div>
        </div>
        <div className="dstat" style={{ padding: '10px 12px' }}>
          <div className="dstat-label" style={{ marginBottom: 5 }}>Pods</div>
          <div className="dstat-num" style={{ fontSize: 26, color: 'var(--text)', marginBottom: 3 }}>2</div>
          <div className="dstat-hint">active</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="dash-3col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 7, marginBottom: 7 }}>
        <div className="dpanel">
          <div className="dpanel-title">📈 Alerts over time</div>
          <div style={{ position: 'relative', height: 130 }}>
            <canvas ref={timeCanvasRef}></canvas>
          </div>
        </div>
        <div className="dpanel">
          <div className="dpanel-title">🔥 By severity</div>
          <div style={{ position: 'relative', height: 95 }}>
            <canvas ref={sevCanvasRef}></canvas>
          </div>
          <div className="dash-legend" style={{ marginTop: 8 }}>
            {falcoDemo.severity.labels.map((label, i) => (
              <div className="dash-legend-item" key={label}>
                <span className="dash-legend-dot" style={{ background: falcoDemo.severity.colors[i] }}></span>
                {label} ({falcoDemo.severity.data[i]})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules + feed */}
      <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 7, marginBottom: 28 }}>
        <div className="dpanel">
          <div className="dpanel-title">📋 Top Falco rules</div>
          <div>
            {falcoDemo.rules.map((r) => (
              <div className="rule-row" key={r.name}>
                <div className="rule-name">{r.name}</div>
                <div className="rule-bar-wrap">
                  <div className="rule-bar-fill" style={{ width: `${(r.count / maxRuleCount) * 100}%` }}></div>
                </div>
                <div className="rule-count">{r.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="dpanel">
          <div className="dpanel-title">⚡ Recent alerts</div>
          <div>
            {falcoDemo.alerts.map((a, i) => (
              <div className="feed-item" key={i}>
                <span className={`feed-sev sev-${a.sev}`}>{a.sev}</span>
                <div className="feed-body">
                  <div className="feed-rule">{a.rule}</div>
                  <div className="feed-meta">pod: {a.pod} · ns: default</div>
                </div>
                <div className="feed-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { interestOptions } from '../../data/content.js';
import { submitHiringInquiry } from '../../services/api.js';

const initialForm = {
  name: '',
  company: '',
  email: '',
  role: '',
  location: '',
  employmentType: 'Full-time',
  description: '',
  salaryRange: '',
  jobUrl: '',
};

export default function HiringForm() {
  const [form, setForm] = useState(initialForm);
  const [interests, setInterests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { ok: bool, message: string }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleInterest(value) {
    setInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await submitHiringInquiry({ ...form, interests });
      setStatus({ ok: true, message: 'Thanks — your inquiry has been sent. I\u2019ll follow up within 1\u20132 business days.' });
      setForm(initialForm);
      setInterests([]);
    } catch (err) {
      setStatus({
        ok: false,
        message: `Couldn't send that: ${err.message}. If this keeps happening, email me directly at ashwin09yadav@gmail.com.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="hire-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="f-name">
            Your name<span className="req">*</span>
          </label>
          <input id="f-name" required placeholder="Jane Doe" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-company">
            Company<span className="req">*</span>
          </label>
          <input id="f-company" required placeholder="Acme Corp" autoComplete="organization" value={form.company} onChange={(e) => update('company', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-email">
            Work email<span className="req">*</span>
          </label>
          <input id="f-email" type="email" required placeholder="jane@acme.com" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-role">
            Job title / role<span className="req">*</span>
          </label>
          <input id="f-role" required placeholder="Senior SOC Engineer" value={form.role} onChange={(e) => update('role', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-location">Location</label>
          <input id="f-location" placeholder="Singapore · Remote · Hybrid" value={form.location} onChange={(e) => update('location', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-type">Employment type</label>
          <select id="f-type" value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="f-desc">
            Role description<span className="req">*</span>
          </label>
          <textarea
            id="f-desc"
            required
            placeholder="What the role involves, team size, and why you think it could be a fit..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="f-salary">Salary range (optional)</label>
          <input id="f-salary" placeholder="e.g. ₹28–35L / yr" value={form.salaryRange} onChange={(e) => update('salaryRange', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="f-url">Job posting URL (optional)</label>
          <input id="f-url" type="url" placeholder="https://..." value={form.jobUrl} onChange={(e) => update('jobUrl', e.target.value)} />
        </div>
      </div>

      <p className="sec-label mt-36 mb-14">What are you looking for? (select all that apply)</p>
      <div className="interest-grid">
        {interestOptions.map((opt) => (
          <label className="interest-chip" key={opt}>
            <input type="checkbox" checked={interests.includes(opt)} onChange={() => toggleInterest(opt)} />
            {opt}
          </label>
        ))}
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Sending…' : 'Submit hiring inquiry'}
        </button>
        <span className="form-note">Sent directly to Ashwin · no account needed · your details aren&apos;t shared with anyone else</span>
      </div>

      {status && <div className={`form-status show ${status.ok ? 'ok' : 'err'}`}>{status.message}</div>}
    </form>
  );
}

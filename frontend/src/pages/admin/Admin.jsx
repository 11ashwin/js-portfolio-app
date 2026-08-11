import { useEffect, useState, useCallback } from 'react';
import LoginForm from '../../components/admin/LoginForm.jsx';
import CountPills from '../../components/admin/CountPills.jsx';
import InquiryCard from '../../components/admin/InquiryCard.jsx';
import { getToken, clearToken, me, fetchInquiries, updateInquiryStatus, deleteInquiry } from '../../services/api.js';
import '../../styles/admin.css';

export default function Admin() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(null);
  const [filter, setFilter] = useState(null);
  const [counts, setCounts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // ── boot: check for an existing valid session ──
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    me(token)
      .then((data) => setEmail(data.email))
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchInquiries(filter);
      setCounts(data.counts);
      setInquiries(data.inquiries);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        setEmail(null);
      } else {
        setLoadError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (email) load();
  }, [email, load]);

  async function handleStatusChange(id, status) {
    try {
      await updateInquiryStatus(id, status);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this inquiry? This can't be undone.")) return;
    try {
      await deleteInquiry(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    setEmail(null);
  }

  if (checking) {
    return (
      <div className="wrap">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="wrap">
        <LoginForm onSuccess={setEmail} />
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="dash-top">
        <div>
          <h1>Hiring inquiries</h1>
          <div className="who">signed in as {email}</div>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      <CountPills counts={counts} active={filter} onChange={setFilter} />

      {loading && <div className="loading">Loading…</div>}
      {!loading && loadError && <div className="empty-state">{loadError}</div>}
      {!loading && !loadError && inquiries.length === 0 && (
        <div className="empty-state">No inquiries yet — once a recruiter submits the form on your portfolio, it shows up here.</div>
      )}
      {!loading && !loadError && inquiries.length > 0 && (
        <div className="inq-list">
          {inquiries.map((inq) => (
            <InquiryCard key={inq.id} inquiry={inq} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// Same convention as before: empty string for same-origin via Ingress in
// production, explicit URL for local dev. Set at build time via
// VITE_API_BASE (see Dockerfile ARG / docker build --build-arg).
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

const TOKEN_KEY = 'portfolio_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Authenticated fetch wrapper. Throws on 401 after clearing the token so
 * callers can redirect back to the login screen.
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (res.status === 401) {
    clearToken();
    throw new Error('SESSION_EXPIRED');
  }
  return res;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed.');
  return data; // { token, email }
}

export async function me(token) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Session invalid');
  return res.json(); // { email }
}

export async function fetchInquiries(status) {
  const qs = status ? `?status=${status}` : '';
  const res = await apiFetch(`/api/inquiries${qs}`);
  if (!res.ok) throw new Error('Failed to load inquiries.');
  return res.json(); // { counts, inquiries }
}

export async function updateInquiryStatus(id, status) {
  const res = await apiFetch(`/api/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status.');
}

export async function deleteInquiry(id) {
  const res = await apiFetch(`/api/inquiries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete inquiry.');
}

/**
 * Submits the recruiter hiring form. Tries the backend API first; falls
 * back to Formspree (for static-hosting deployments), then to a mailto:
 * link so an inquiry is never silently lost.
 */
export async function submitHiringInquiry(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true, via: 'api' };
  } catch {
    // fall through to Formspree
  }

  // Replace YOUR_FORM_ID with your real Formspree form ID
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true, via: 'formspree' };
  } catch {
    // fall through to mailto
  }

  const subject = encodeURIComponent(`Hiring inquiry: ${payload.role || 'role'} @ ${payload.company || 'company'}`);
  const body = encodeURIComponent(JSON.stringify(payload, null, 2));
  window.location.href = `mailto:ashwin09yadav@gmail.com?subject=${subject}&body=${body}`;
  return { ok: true, via: 'mailto' };
}

import { contact } from '../../data/content.js';

export default function Header({ onHireClick }) {
  return (
    <header>
      <div className="header-eyebrow">
        available for relocation · singapore · malaysia · thailand · uae · australia
        <span className="cursor"></span>
      </div>

      <div className="header-top">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Replace with <img className="header-photo" src="/images/ashwin.jpg" alt="Ashwin Yadav"/> once you add a headshot to /public/images */}
          <div className="header-photo-fallback">AY</div>
          <div>
            <h1>Ashwin Yadav</h1>
            <p className="role">
              // Senior Cybersecurity Engineer
              <br />
              // Open to Singapore, Malaysia, Thailand &amp; APAC relocation
            </p>
          </div>
        </div>

        <div className="header-actions">
          <span className="availability">available now</span>
          <a className="btn-resume" href={contact.resumeHref} download>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Resume
          </a>
          <button className="btn-hire" onClick={onHireClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            For Recruiters
          </button>
        </div>
      </div>

      <div className="contact-row">
        <a className="ci" href={contact.phoneHref}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
          </svg>
          {contact.phone}
        </a>
        <a className="ci" href={`mailto:${contact.email}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {contact.email}
        </a>
        <a className="ci" href={contact.linkedinHref} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          {contact.linkedin}
        </a>
        {/* Add your real GitHub URL in src/data/content.js */}
        <a className="ci" href={contact.githubHref} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
          {contact.github}
        </a>
      </div>
    </header>
  );
}

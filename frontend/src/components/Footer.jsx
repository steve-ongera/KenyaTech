// src/components/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../services/api';

export default function Footer() {
  const [email, setEmail]     = useState('');
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await subscribeNewsletter({ email });
      setMsg(data.message);
      setEmail('');
    } catch {
      setMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="kt-footer">
      {/* Top band */}
      <div className="kt-footer__top">
        <div className="kt-container">
          <div className="kt-footer__newsletter">
            <div>
              <h3 className="kt-footer__nl-title">Stay in the loop</h3>
              <p className="kt-footer__nl-sub">Insights, product updates & Kenyan tech news — delivered monthly.</p>
            </div>
            <form className="kt-footer__nl-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="kt-input"
              />
              <button type="submit" className="kt-btn" disabled={loading}>
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {msg && <p className="kt-footer__nl-msg">{msg}</p>}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="kt-footer__main">
        <div className="kt-container">
          <div className="kt-footer__grid">
            {/* Brand */}
            <div className="kt-footer__brand">
              <Link to="/" className="kt-nav__logo">
                <span className="kt-logo-mark">K</span>
                <span className="kt-logo-text">enya<strong>Tech</strong></span>
              </Link>
              <p className="kt-footer__tagline">
                Building Africa's digital future — one pixel, one pipeline, one product at a time.
              </p>
              <div className="kt-footer__socials">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Company</h4>
              <ul className="kt-footer__list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about#team">Our Team</Link></li>
                <li><Link to="/projects">Portfolio</Link></li>
                <li><Link to="/careers">Careers <span className="kt-badge">Hiring</span></Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Services</h4>
              <ul className="kt-footer__list">
                <li><Link to="/services">Web Development</Link></li>
                <li><Link to="/services">Mobile Apps</Link></li>
                <li><Link to="/services">Cloud & DevOps</Link></li>
                <li><Link to="/services">UI/UX Design</Link></li>
                <li><Link to="/services">Data & AI</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Contact</h4>
              <ul className="kt-footer__contact">
                <li>
                  <span className="kt-footer__contact-icon">📍</span>
                  <span>Westlands, Nairobi, Kenya</span>
                </li>
                <li>
                  <span className="kt-footer__contact-icon">✉️</span>
                  <a href="mailto:hello@kenyatech.co.ke">hello@kenyatech.co.ke</a>
                </li>
                <li>
                  <span className="kt-footer__contact-icon">📞</span>
                  <a href="tel:+254700000000">+254 700 000 000</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="kt-footer__bottom">
        <div className="kt-container">
          <div className="kt-footer__bottom-inner">
            <p>&copy; {new Date().getFullYear()} KenyaTech Ltd. All rights reserved.</p>
            <div className="kt-footer__legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
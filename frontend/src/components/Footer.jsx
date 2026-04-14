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

      {/* Newsletter band */}
      <div className="kt-footer__top">
        <div className="kt-container">
          <div className="kt-footer__newsletter">
            <div>
              <h3 className="kt-footer__nl-title">
                <i className="bi bi-envelope-heart-fill kt-footer__nl-icon" />
                Stay in the loop
              </h3>
              <p className="kt-footer__nl-sub">
                Insights, product updates &amp; Kenyan tech news — delivered monthly.
              </p>
            </div>
            <form className="kt-footer__nl-form" onSubmit={handleSubscribe}>
              <div className="kt-footer__nl-input-wrap">
                <i className="bi bi-envelope kt-footer__nl-input-icon" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="kt-input kt-footer__nl-input"
                />
              </div>
              <button type="submit" className="kt-btn" disabled={loading}>
                {loading
                  ? <><i className="bi bi-arrow-repeat kt-spin" /> Subscribing…</>
                  : <><i className="bi bi-send-fill" /> Subscribe</>}
              </button>
            </form>
            {msg && (
              <p className="kt-footer__nl-msg">
                <i className="bi bi-check-circle-fill" /> {msg}
              </p>
            )}
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
                <a href="https://twitter.com"  target="_blank" rel="noreferrer" aria-label="Twitter / X">
                  <i className="bi bi-twitter-x" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://github.com"   target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="bi bi-github" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <i className="bi bi-facebook" />
                </a>
                <a href="https://youtube.com"  target="_blank" rel="noreferrer" aria-label="YouTube">
                  <i className="bi bi-youtube" />
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Company</h4>
              <ul className="kt-footer__list">
                <li><Link to="/about"><i className="bi bi-building" /> About Us</Link></li>
                <li><Link to="/about#team"><i className="bi bi-people" /> Our Team</Link></li>
                <li><Link to="/projects"><i className="bi bi-grid" /> Portfolio</Link></li>
                <li>
                  <Link to="/careers">
                    <i className="bi bi-briefcase" /> Careers{' '}
                    <span className="kt-badge">Hiring</span>
                  </Link>
                </li>
                <li><Link to="/blog"><i className="bi bi-journal-text" /> Blog</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Services</h4>
              <ul className="kt-footer__list">
                <li><Link to="/services"><i className="bi bi-code-slash" /> Web Development</Link></li>
                <li><Link to="/services"><i className="bi bi-phone" /> Mobile Apps</Link></li>
                <li><Link to="/services"><i className="bi bi-cloud-upload" /> Cloud &amp; DevOps</Link></li>
                <li><Link to="/services"><i className="bi bi-palette" /> UI/UX Design</Link></li>
                <li><Link to="/services"><i className="bi bi-graph-up-arrow" /> Data &amp; AI</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="kt-footer__col">
              <h4 className="kt-footer__col-title">Contact</h4>
              <ul className="kt-footer__contact">
                <li>
                  <i className="bi bi-geo-alt-fill kt-footer__contact-icon" />
                  <span>ABC Place, Waiyaki Way<br />Westlands, Nairobi, Kenya</span>
                </li>
                <li>
                  <i className="bi bi-envelope-fill kt-footer__contact-icon" />
                  <a href="mailto:hello@kenyatech.co.ke">hello@kenyatech.co.ke</a>
                </li>
                <li>
                  <i className="bi bi-telephone-fill kt-footer__contact-icon" />
                  <a href="tel:+254700000000">+254 700 000 000</a>
                </li>
                <li>
                  <i className="bi bi-clock-fill kt-footer__contact-icon" />
                  <span>Mon – Fri, 8 am – 6 pm EAT</span>
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
            <p>
              <i className="bi bi-c-circle" />{' '}
              {new Date().getFullYear()} KenyaTech Ltd. All rights reserved.
            </p>
            <div className="kt-footer__legal">
              <Link to="/privacy"><i className="bi bi-shield-check" /> Privacy Policy</Link>
              <Link to="/terms"><i className="bi bi-file-text" /> Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
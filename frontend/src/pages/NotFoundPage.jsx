// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="kt-404">
      <div className="kt-404__bg">
        <div className="kt-hero__glow kt-hero__glow--1" />
        <div className="kt-hero__glow kt-hero__glow--2" />
      </div>
      <div className="kt-404__inner">
        <span className="kt-404__code">404</span>
        <h1 className="kt-404__title">Page Not Found</h1>
        <p className="kt-404__sub">
          Looks like this page got lost somewhere between Nairobi and the cloud.<br />
          Let's get you back on track.
        </p>
        <div className="kt-404__actions">
          <Link to="/"        className="kt-btn kt-btn--lg">Go Home</Link>
          <Link to="/contact" className="kt-btn kt-btn--ghost kt-btn--lg">Contact Us</Link>
        </div>
        <nav className="kt-404__links">
          <Link to="/services">Services</Link>
          <Link to="/projects">Portfolio</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/careers">Careers</Link>
        </nav>
      </div>
    </div>
  );
}
// src/components/UI.jsx  — shared primitives
import { useState, useEffect } from 'react';

// ─── Section wrapper ──────────────────────────────────────
export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`kt-section ${className}`}>
      {children}
    </section>
  );
}

// ─── Section header ───────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`kt-section-header${center ? ' kt-section-header--center' : ''}`}>
      {eyebrow && <span className="kt-eyebrow">{eyebrow}</span>}
      <h2 className="kt-section-title">{title}</h2>
      {subtitle && <p className="kt-section-sub">{subtitle}</p>}
    </div>
  );
}

// ─── Page hero banner ─────────────────────────────────────
export function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <div className="kt-page-hero">
      <div className="kt-page-hero__bg" />
      <div className="kt-container kt-page-hero__inner">
        {eyebrow && <span className="kt-eyebrow">{eyebrow}</span>}
        <h1 className="kt-page-hero__title">{title}</h1>
        {subtitle && <p className="kt-page-hero__sub">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// ─── Loading spinner ──────────────────────────────────────
export function Spinner({ size = 'md' }) {
  return (
    <div className={`kt-spinner kt-spinner--${size}`}>
      <div className="kt-spinner__ring" />
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ className = '', children, onClick }) {
  return (
    <div className={`kt-card ${className}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
}

// ─── Badge / Tag ──────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  return <span className={`kt-badge kt-badge--${variant}`}>{children}</span>;
}

// ─── Alert ────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  return <div className={`kt-alert kt-alert--${type}`}>{children}</div>;
}

// ─── Skeleton loader ──────────────────────────────────────
export function Skeleton({ height = '20px', width = '100%', className = '' }) {
  return (
    <div
      className={`kt-skeleton ${className}`}
      style={{ height, width }}
    />
  );
}

// ─── Star rating ──────────────────────────────────────────
export function Stars({ rating = 5 }) {
  return (
    <div className="kt-stars" aria-label={`${rating} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'kt-star kt-star--filled' : 'kt-star'}>★</span>
      ))}
    </div>
  );
}

// ─── Counter animation hook ───────────────────────────────
export function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Intersection observer hook ───────────────────────────
export function useInView(threshold = 0.2) {
  const [inView, setInView]   = useState(false);
  const [ref, setRef]         = useState(null);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return [setRef, inView];
}
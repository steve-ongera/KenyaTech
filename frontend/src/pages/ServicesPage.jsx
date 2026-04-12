// src/pages/ServicesPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getServiceCategories } from '../services/api';
import { Section, SectionHeader, PageHero, Spinner, Badge } from '../components/UI';

function ServiceCard({ title, slug, icon, short_desc, category_name, is_featured }) {
  return (
    <Link to={`/services/${slug}`} className={`kt-service-card kt-service-card--full${is_featured ? ' kt-service-card--featured' : ''}`}>
      {is_featured && <span className="kt-service-card__badge">Featured</span>}
      <div className="kt-service-card__icon">
        {icon ? <i className={icon} /> : <span>⚡</span>}
      </div>
      <div className="kt-service-card__meta">{category_name}</div>
      <h3 className="kt-service-card__title">{title}</h3>
      <p className="kt-service-card__desc">{short_desc}</p>
      <span className="kt-service-card__cta">
        Learn more <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
      </span>
    </Link>
  );
}

export default function ServicesPage() {
  const [services, setServices]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [activeCategory, setActive]     = useState('all');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      getServices('?ordering=order'),
      getServiceCategories(),
    ])
      .then(([svc, cats]) => {
        setServices(svc.results || svc);
        setCategories(cats.results || cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.category_name === activeCategory);

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Full-Stack Digital Services for Modern Organisations"
        subtitle="From idea to production — we cover every layer of the digital stack with expert engineering teams."
      />

      <Section>
        <div className="kt-container">
          {/* Filter tabs */}
          <div className="kt-filter-tabs">
            <button
              className={`kt-filter-tab${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActive('all')}
            >All Services</button>
            {categories.map(c => (
              <button
                key={c.slug}
                className={`kt-filter-tab${activeCategory === c.name ? ' active' : ''}`}
                onClick={() => setActive(c.name)}
              >{c.name}</button>
            ))}
          </div>

          {loading ? (
            <div className="kt-flex-center kt-py-8"><Spinner /></div>
          ) : filtered.length > 0 ? (
            <div className="kt-services-grid kt-services-grid--3col">
              {filtered.map(s => <ServiceCard key={s.id} {...s} />)}
            </div>
          ) : (
            <p className="kt-empty">No services found in this category.</p>
          )}
        </div>
      </Section>

      {/* Why choose us */}
      <Section className="kt-section--alt">
        <div className="kt-container">
          <div className="kt-about-split">
            <div className="kt-about-split__text">
              <span className="kt-eyebrow">Why KenyaTech?</span>
              <h2 className="kt-about-split__title">Senior Engineers, Not Junior Teams</h2>
              <p>Every project at KenyaTech is led by a senior engineer with 5+ years of production experience. No bait-and-switch — the person you meet in discovery is the person who builds your product.</p>
              <ul className="kt-check-list">
                {['Fixed-price contracts, no scope creep', 'Weekly demos and progress updates', 'Source code ownership — always yours', 'Post-launch support included', '48-hour response SLA'].map(i => (
                  <li key={i}><span className="kt-check">✓</span>{i}</li>
                ))}
              </ul>
              <Link to="/contact" className="kt-btn">Discuss Your Project →</Link>
            </div>
            <div className="kt-about-split__visual">
              <div className="kt-tech-stack">
                {['React', 'Django', 'Node.js', 'Flutter', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'Next.js', 'Firebase', 'Kubernetes', 'GraphQL'].map(t => (
                  <span key={t} className="kt-tech-badge">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
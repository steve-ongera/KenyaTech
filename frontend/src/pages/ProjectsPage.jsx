// src/pages/ProjectsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getServiceCategories } from '../services/api';
import { Section, SectionHeader, PageHero, Spinner } from '../components/UI';

function ProjectCard({ title, slug, cover_image, short_desc, tech_stack = [], client, status, category_name }) {
  const statusColors = { completed: '#22c55e', ongoing: '#f59e0b', coming_soon: '#6366f1' };
  return (
    <Link to={`/projects/${slug}`} className="kt-project-card kt-project-card--full">
      <div className="kt-project-card__img">
        {cover_image
          ? <img src={cover_image} alt={title} loading="lazy" />
          : <div className="kt-project-card__placeholder"><span>🖥️</span></div>}
        <span className="kt-project-card__status" style={{ background: statusColors[status] }}>
          {status?.replace('_', ' ')}
        </span>
      </div>
      <div className="kt-project-card__body">
        <div className="kt-project-card__meta">
          {client && <span className="kt-project-card__client">{client}</span>}
          {category_name && <span className="kt-tag">{category_name}</span>}
        </div>
        <h3 className="kt-project-card__title">{title}</h3>
        <p className="kt-project-card__desc">{short_desc}</p>
        <div className="kt-project-card__tags">
          {(tech_stack || []).slice(0, 4).map(t => <span key={t} className="kt-tag">{t}</span>)}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setFilter]   = useState('all');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getServiceCategories()])
      .then(([p, c]) => {
        setProjects(p.results || p);
        setCategories(c.results || c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category_name === activeFilter);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work We're Proud to Put Our Name On"
        subtitle="150+ projects across fintech, healthtech, e-commerce, government, and more."
      />
      <Section>
        <div className="kt-container">
          <div className="kt-filter-tabs">
            <button className={`kt-filter-tab${activeFilter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
            {categories.map(c => (
              <button key={c.slug} className={`kt-filter-tab${activeFilter === c.name ? ' active' : ''}`} onClick={() => setFilter(c.name)}>{c.name}</button>
            ))}
          </div>
          {loading ? (
            <div className="kt-flex-center kt-py-8"><Spinner /></div>
          ) : filtered.length > 0 ? (
            <div className="kt-projects-grid kt-projects-grid--3col">
              {filtered.map(p => <ProjectCard key={p.id} {...p} />)}
            </div>
          ) : (
            <p className="kt-empty">No projects found.</p>
          )}
        </div>
      </Section>
    </>
  );
}
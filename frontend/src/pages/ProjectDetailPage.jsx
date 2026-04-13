// src/pages/ProjectDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../services/api';
import { Section, Spinner, PageHero, Badge } from '../components/UI';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(slug)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="kt-loading-screen"><Spinner size="lg" /></div>;
  if (!project) return (
    <div className="kt-container kt-py-8">
      <p>Project not found. <Link to="/projects">Back to portfolio</Link></p>
    </div>
  );

  const statusLabel = { completed: 'Completed', ongoing: 'In Progress', coming_soon: 'Coming Soon' };
  const date = project.completed_date
    ? new Date(project.completed_date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })
    : null;

  return (
    <>
      <PageHero
        eyebrow={project.category_name || 'Project'}
        title={project.title}
        subtitle={project.short_desc}
      />

      <Section>
        <div className="kt-container">
          <div className="kt-detail-layout">
            {/* Main */}
            <div className="kt-detail-layout__main">
              {project.cover_image && (
                <img src={project.cover_image} alt={project.title} className="kt-detail-cover" />
              )}
              <div
                className="kt-prose"
                dangerouslySetInnerHTML={{ __html: project.description || `<p>${project.short_desc}</p>` }}
              />
            </div>

            {/* Aside */}
            <aside className="kt-detail-layout__aside">
              <div className="kt-aside-card">
                <h3 className="kt-aside-card__title">Project Info</h3>
                <ul className="kt-project-meta-list">
                  {project.client && (
                    <li><span>Client</span><strong>{project.client}</strong></li>
                  )}
                  {date && (
                    <li><span>Completed</span><strong>{date}</strong></li>
                  )}
                  <li>
                    <span>Status</span>
                    <strong className={`kt-status kt-status--${project.status}`}>
                      {statusLabel[project.status]}
                    </strong>
                  </li>
                  {project.category_name && (
                    <li><span>Category</span><strong>{project.category_name}</strong></li>
                  )}
                </ul>
                <div className="kt-project-meta-links">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="kt-btn kt-btn--full">
                      View Live Site ↗
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="kt-btn kt-btn--outline kt-btn--full">
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>

              {project.tech_stack?.length > 0 && (
                <div className="kt-aside-card">
                  <h3 className="kt-aside-card__title">Tech Stack</h3>
                  <div className="kt-tech-stack kt-tech-stack--wrap">
                    {project.tech_stack.map(t => (
                      <span key={t} className="kt-tech-badge">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="kt-aside-card kt-aside-card--cta">
                <h3>Like what you see?</h3>
                <p>Let's build something just as impressive for your business.</p>
                <Link to="/contact" className="kt-btn kt-btn--full">Start a Project</Link>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {/* Back link */}
      <div className="kt-container kt-py-4">
        <Link to="/projects" className="kt-back-link">← Back to Portfolio</Link>
      </div>
    </>
  );
}
// src/pages/CareersPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, getDepartments } from '../services/api';
import { Section, SectionHeader, PageHero, Spinner } from '../components/UI';

const PERKS = [
  { icon: '🏡', title: 'Remote-Friendly',       desc: 'Work from anywhere in East Africa. We have hubs in Nairobi, Kampala & Dar.' },
  { icon: '📚', title: 'Learning Budget',        desc: 'KES 50,000/year for courses, conferences, and books. We invest in your growth.' },
  { icon: '🏥', title: 'Full Medical Cover',     desc: 'Comprehensive NHIF-plus cover for you and your immediate family.' },
  { icon: '💰', title: 'Competitive Salary',     desc: 'Market-rate pay benchmarked against Andela and top Kenyan tech firms.' },
  { icon: '📈', title: 'Equity Options',         desc: 'ESOP plan for all permanent staff — share in the company you help build.' },
  { icon: '🍕', title: 'Team Retreats',           desc: 'Quarterly off-sites and an annual all-hands at a Kenyan resort.' },
];

function JobCard({ title, slug, department_name, job_type_display, level_display, location, salary_range, is_featured, created_at }) {
  const posted = created_at
    ? new Date(created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  return (
    <Link to={`/careers/${slug}`} className={`kt-job-card${is_featured ? ' kt-job-card--featured' : ''}`}>
      <div className="kt-job-card__header">
        <div>
          <h3 className="kt-job-card__title">{title}</h3>
          <p className="kt-job-card__dept">{department_name}</p>
        </div>
        {is_featured && <span className="kt-badge kt-badge--accent">Featured</span>}
      </div>
      <div className="kt-job-card__tags">
        {job_type_display && <span className="kt-tag">{job_type_display}</span>}
        {level_display    && <span className="kt-tag">{level_display}</span>}
        {location         && <span className="kt-tag">📍 {location}</span>}
      </div>
      <div className="kt-job-card__footer">
        <span className="kt-job-card__salary">{salary_range || 'Competitive'}</span>
        <span className="kt-job-card__posted">Posted {posted}</span>
      </div>
    </Link>
  );
}

export default function CareersPage() {
  const [jobs, setJobs]               = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeDept, setDept]         = useState('all');
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      getJobs('?ordering=-is_featured,-created_at'),
      getDepartments(),
    ])
      .then(([j, d]) => {
        setJobs(j.results || j);
        setDepartments(d.results || d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeDept === 'all'
    ? jobs
    : jobs.filter(j => j.department_name === activeDept);

  return (
    <>
      <PageHero
        eyebrow="Careers at KenyaTech"
        title="Help Us Build the Digital Backbone of East Africa"
        subtitle="We're a fast-growing team of builders, thinkers, and problem-solvers. If you want to do meaningful work and grow fast, you belong here."
      >
        <div className="kt-page-hero__cta">
          <a href="#open-roles" className="kt-btn kt-btn--lg kt-btn--white">
            View Open Roles
          </a>
        </div>
      </PageHero>

      {/* Perks */}
      <Section className="kt-section--alt">
        <div className="kt-container">
          <SectionHeader
            eyebrow="Why KenyaTech"
            title="Work That Matters, Perks That Show It"
            subtitle="We take care of our people so our people can take care of our clients."
          />
          <div className="kt-perks-grid">
            {PERKS.map(p => (
              <div key={p.title} className="kt-perk-card">
                <span className="kt-perk-card__icon">{p.icon}</span>
                <h3 className="kt-perk-card__title">{p.title}</h3>
                <p className="kt-perk-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Open roles */}
      <Section id="open-roles">
        <div className="kt-container">
          <SectionHeader
            eyebrow={`${jobs.length} Open Position${jobs.length !== 1 ? 's' : ''}`}
            title="Find Your Role"
          />

          {/* Department filter */}
          <div className="kt-filter-tabs">
            <button
              className={`kt-filter-tab${activeDept === 'all' ? ' active' : ''}`}
              onClick={() => setDept('all')}
            >All Departments</button>
            {departments.map(d => (
              <button
                key={d.slug}
                className={`kt-filter-tab${activeDept === d.name ? ' active' : ''}`}
                onClick={() => setDept(d.name)}
              >
                {d.name}
                <span className="kt-filter-tab__count">{d.job_count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="kt-flex-center kt-py-8"><Spinner /></div>
          ) : filtered.length > 0 ? (
            <div className="kt-jobs-list">
              {filtered.map(j => <JobCard key={j.id} {...j} />)}
            </div>
          ) : (
            <div className="kt-empty-state">
              <span className="kt-empty-state__icon">🔍</span>
              <p>No open roles in this department right now.</p>
              <p className="kt-empty-state__sub">
                Send your CV to <a href="mailto:careers@kenyatech.co.ke">careers@kenyatech.co.ke</a> and we'll keep you in mind.
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* Culture band */}
      <section className="kt-cta-band">
        <div className="kt-cta-band__bg" />
        <div className="kt-container kt-cta-band__inner">
          <div className="kt-cta-band__content">
            <h2 className="kt-cta-band__title">Don't See the Right Role?</h2>
            <p className="kt-cta-band__sub">
              We're always interested in exceptional talent. Send us your CV and tell us what you'd love to build.
            </p>
          </div>
          <div className="kt-cta-band__actions">
            <a href="mailto:careers@kenyatech.co.ke" className="kt-btn kt-btn--white kt-btn--lg">
              Send Open Application →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
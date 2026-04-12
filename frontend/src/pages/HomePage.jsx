// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomepageData } from '../services/api';
import { Section, SectionHeader, Spinner, Stars, Badge, useCounter, useInView } from '../components/UI';

/* ─── STAT COUNTER ─────────────────────────────────────── */
function StatItem({ value, suffix, label, icon }) {
  const [ref, inView] = useInView();
  const num = parseInt(value.replace(/\D/g, '')) || 0;
  const count = useCounter(num, 1800, inView);
  return (
    <div className="kt-stat" ref={ref}>
      {icon && <span className="kt-stat__icon">{icon}</span>}
      <h3 className="kt-stat__value">
        {isNaN(num) ? value : count}{suffix}
      </h3>
      <p className="kt-stat__label">{label}</p>
    </div>
  );
}

/* ─── SERVICE CARD ─────────────────────────────────────── */
function ServiceCard({ icon, title, short_desc, slug }) {
  return (
    <Link to={`/services/${slug}`} className="kt-service-card">
      <div className="kt-service-card__icon">
        {icon ? <i className={icon} /> : <span className="kt-service-card__icon-fallback">⚡</span>}
      </div>
      <h3 className="kt-service-card__title">{title}</h3>
      <p className="kt-service-card__desc">{short_desc}</p>
      <span className="kt-service-card__cta">
        Explore <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
      </span>
    </Link>
  );
}

/* ─── PROJECT CARD ─────────────────────────────────────── */
function ProjectCard({ title, short_desc, cover_image, tech_stack = [], slug, client }) {
  return (
    <Link to={`/projects/${slug}`} className="kt-project-card">
      <div className="kt-project-card__img">
        {cover_image
          ? <img src={cover_image} alt={title} loading="lazy" />
          : <div className="kt-project-card__placeholder" />}
      </div>
      <div className="kt-project-card__body">
        {client && <span className="kt-project-card__client">{client}</span>}
        <h3 className="kt-project-card__title">{title}</h3>
        <p className="kt-project-card__desc">{short_desc}</p>
        <div className="kt-project-card__tags">
          {tech_stack.slice(0, 4).map(t => <span key={t} className="kt-tag">{t}</span>)}
        </div>
      </div>
    </Link>
  );
}

/* ─── TESTIMONIAL CARD ─────────────────────────────────── */
function TestimonialCard({ name, role, company, photo, content, rating }) {
  return (
    <div className="kt-testimonial">
      <Stars rating={rating} />
      <blockquote className="kt-testimonial__text">"{content}"</blockquote>
      <div className="kt-testimonial__author">
        {photo
          ? <img src={photo} alt={name} className="kt-testimonial__avatar" />
          : <div className="kt-testimonial__avatar kt-testimonial__avatar--placeholder">{name[0]}</div>}
        <div>
          <strong className="kt-testimonial__name">{name}</strong>
          <span className="kt-testimonial__role">{role}{company ? `, ${company}` : ''}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── BLOG CARD ────────────────────────────────────────── */
function BlogCard({ title, excerpt, cover_image, published_at, read_time_minutes, slug, author_name, tags = [] }) {
  const date = published_at ? new Date(published_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  return (
    <Link to={`/blog/${slug}`} className="kt-blog-card">
      <div className="kt-blog-card__img">
        {cover_image
          ? <img src={cover_image} alt={title} loading="lazy" />
          : <div className="kt-blog-card__placeholder" />}
      </div>
      <div className="kt-blog-card__body">
        <div className="kt-blog-card__meta">
          <span>{date}</span>
          <span className="kt-blog-card__dot" />
          <span>{read_time_minutes} min read</span>
        </div>
        <h3 className="kt-blog-card__title">{title}</h3>
        <p className="kt-blog-card__excerpt">{excerpt}</p>
        <div className="kt-blog-card__tags">
          {tags.slice(0, 3).map(t => <span key={t.slug} className="kt-tag">{t.name}</span>)}
        </div>
      </div>
    </Link>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────── */
const HOW_STEPS = [
  { n: '01', title: 'Discovery Call',    desc: 'We learn your goals, challenges, and vision in a focused 30-minute session.' },
  { n: '02', title: 'Proposal & Plan',   desc: 'We deliver a clear scope, timeline, and fixed price — no surprise invoices.' },
  { n: '03', title: 'Build & Iterate',   desc: 'Agile sprints with weekly demos. You see progress every single week.' },
  { n: '04', title: 'Launch & Support',  desc: 'We ship, monitor, and keep improving. Your growth is our long game.' },
];

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="kt-loading-screen">
      <Spinner size="lg" />
    </div>
  );

  const { hero, services = [], projects = [], testimonials = [], stats = [], team = [], blog_posts = [], clients = [] } = data || {};

  return (
    <>
      {/* ═══ HERO ══════════════════════════════════════════ */}
      <section className="kt-hero" id="home">
        <div className="kt-hero__bg">
          <div className="kt-hero__grid" />
          <div className="kt-hero__glow kt-hero__glow--1" />
          <div className="kt-hero__glow kt-hero__glow--2" />
        </div>
        <div className="kt-container kt-hero__inner">
          <div className="kt-hero__content">
            <span className="kt-eyebrow animate-fade-up" style={{ animationDelay: '0ms' }}>
              {hero?.eyebrow || '🇰🇪 Built in Nairobi, Deployed Globally'}
            </span>
            <h1 className="kt-hero__title animate-fade-up" style={{ animationDelay: '100ms' }}>
              {hero?.title || <>We Build<br /><em>Digital Products</em><br />Africa is Proud Of</>}
            </h1>
            <p className="kt-hero__sub animate-fade-up" style={{ animationDelay: '200ms' }}>
              {hero?.subtitle || 'From Nairobi to the world — we craft fast, beautiful, and scalable web and mobile solutions for startups, enterprises, and government.'}
            </p>
            <div className="kt-hero__cta animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link to={hero?.cta_url || '/contact'} className="kt-btn kt-btn--lg">
                {hero?.cta_label || 'Start a Project'} →
              </Link>
              {hero?.cta2_label && (
                <Link to={hero.cta2_url || '/projects'} className="kt-btn kt-btn--ghost kt-btn--lg">
                  {hero.cta2_label}
                </Link>
              )}
              {!hero?.cta2_label && (
                <Link to="/projects" className="kt-btn kt-btn--ghost kt-btn--lg">
                  See Our Work
                </Link>
              )}
            </div>
          </div>

          {/* Floating cards */}
          <div className="kt-hero__visual animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="kt-hero__mockup">
              <div className="kt-hero__mockup-bar">
                <span /><span /><span />
              </div>
              <div className="kt-hero__mockup-body">
                <div className="kt-hero__mockup-line kt-hero__mockup-line--lg" />
                <div className="kt-hero__mockup-line" />
                <div className="kt-hero__mockup-line" />
                <div className="kt-hero__mockup-grid">
                  <div className="kt-hero__mockup-block kt-hero__mockup-block--green" />
                  <div className="kt-hero__mockup-block" />
                  <div className="kt-hero__mockup-block" />
                  <div className="kt-hero__mockup-block kt-hero__mockup-block--accent" />
                </div>
                <div className="kt-hero__mockup-line" />
                <div className="kt-hero__mockup-line kt-hero__mockup-line--sm" />
              </div>
            </div>
            <div className="kt-hero__float kt-hero__float--1">
              <span className="kt-hero__float-icon">🚀</span>
              <div>
                <strong>150+ Projects</strong>
                <span>Delivered on time</span>
              </div>
            </div>
            <div className="kt-hero__float kt-hero__float--2">
              <span className="kt-hero__float-icon">⭐</span>
              <div>
                <strong>4.9 / 5.0</strong>
                <span>Client satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client logos */}
        {clients.length > 0 && (
          <div className="kt-hero__clients">
            <div className="kt-container">
              <p className="kt-hero__clients-label">Trusted by leading organisations</p>
              <div className="kt-hero__clients-logos">
                {clients.map(c => (
                  <img key={c.id} src={c.logo} alt={c.name} className="kt-hero__client-logo" />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══ STATS ═════════════════════════════════════════ */}
      {stats.length > 0 && (
        <Section className="kt-section--dark-band">
          <div className="kt-container">
            <div className="kt-stats-grid">
              {stats.map(s => (
                <StatItem key={s.id} {...s} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ SERVICES ══════════════════════════════════════ */}
      {services.length > 0 && (
        <Section id="services">
          <div className="kt-container">
            <SectionHeader
              eyebrow="What We Do"
              title="Services Built for the African Digital Era"
              subtitle="We cover the full stack — from pixel-perfect interfaces to robust cloud infrastructure."
            />
            <div className="kt-services-grid">
              {services.map(s => <ServiceCard key={s.id} {...s} />)}
            </div>
            <div className="kt-section-cta">
              <Link to="/services" className="kt-btn kt-btn--outline">View All Services</Link>
            </div>
          </div>
        </Section>
      )}

      {/* ═══ HOW IT WORKS ══════════════════════════════════ */}
      <Section className="kt-section--alt" id="how-it-works">
        <div className="kt-container">
          <SectionHeader
            eyebrow="Our Process"
            title="How We Turn Ideas into Products"
            subtitle="A transparent, milestone-driven process — so you always know what's happening."
          />
          <div className="kt-steps">
            {HOW_STEPS.map((step, i) => (
              <div key={step.n} className="kt-step" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="kt-step__num">{step.n}</div>
                <div className="kt-step__body">
                  <h3 className="kt-step__title">{step.title}</h3>
                  <p className="kt-step__desc">{step.desc}</p>
                </div>
                {i < HOW_STEPS.length - 1 && <div className="kt-step__connector" />}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PROJECTS ══════════════════════════════════════ */}
      {projects.length > 0 && (
        <Section id="projects">
          <div className="kt-container">
            <SectionHeader
              eyebrow="Our Work"
              title="Products We're Proud Of"
              subtitle="Real problems. Real clients. Real results."
            />
            <div className="kt-projects-grid">
              {projects.map(p => <ProjectCard key={p.id} {...p} />)}
            </div>
            <div className="kt-section-cta">
              <Link to="/projects" className="kt-btn kt-btn--outline">View Full Portfolio</Link>
            </div>
          </div>
        </Section>
      )}

      {/* ═══ TEAM ══════════════════════════════════════════ */}
      {team.length > 0 && (
        <Section className="kt-section--alt" id="team">
          <div className="kt-container">
            <SectionHeader
              eyebrow="The People"
              title="Meet the Team Behind the Magic"
              subtitle="Senior engineers, designers, and strategists — all based in East Africa."
            />
            <div className="kt-team-grid">
              {team.map(member => (
                <div key={member.id} className="kt-team-card">
                  <div className="kt-team-card__photo">
                    {member.photo
                      ? <img src={member.photo} alt={member.name} />
                      : <div className="kt-team-card__placeholder">{member.name[0]}</div>}
                  </div>
                  <div className="kt-team-card__info">
                    <h3 className="kt-team-card__name">{member.name}</h3>
                    <p className="kt-team-card__role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="kt-section-cta">
              <Link to="/about#team" className="kt-btn kt-btn--outline">Meet Everyone</Link>
            </div>
          </div>
        </Section>
      )}

      {/* ═══ TESTIMONIALS ══════════════════════════════════ */}
      {testimonials.length > 0 && (
        <Section id="testimonials">
          <div className="kt-container">
            <SectionHeader
              eyebrow="Client Love"
              title="What Our Clients Say"
              subtitle="Don't take our word for it — hear from the people we've built for."
            />
            <div className="kt-testimonials-grid">
              {testimonials.map(t => <TestimonialCard key={t.id} {...t} />)}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ BLOG ══════════════════════════════════════════ */}
      {blog_posts.length > 0 && (
        <Section className="kt-section--alt" id="blog">
          <div className="kt-container">
            <SectionHeader
              eyebrow="Insights"
              title="From Our Engineering Blog"
              subtitle="Deep dives, tutorials, and opinions from the KenyaTech team."
            />
            <div className="kt-blog-grid">
              {blog_posts.map(p => <BlogCard key={p.id} {...p} />)}
            </div>
            <div className="kt-section-cta">
              <Link to="/blog" className="kt-btn kt-btn--outline">Read All Articles</Link>
            </div>
          </div>
        </Section>
      )}

      {/* ═══ CTA BAND ══════════════════════════════════════ */}
      <section className="kt-cta-band">
        <div className="kt-cta-band__bg" />
        <div className="kt-container kt-cta-band__inner">
          <div className="kt-cta-band__content">
            <h2 className="kt-cta-band__title">Ready to Build Something Great?</h2>
            <p className="kt-cta-band__sub">Let's talk about your project. First consultation is always free.</p>
          </div>
          <div className="kt-cta-band__actions">
            <Link to="/contact" className="kt-btn kt-btn--white kt-btn--lg">Start a Conversation →</Link>
            <Link to="/careers" className="kt-btn kt-btn--ghost-white kt-btn--lg">We're Hiring</Link>
          </div>
        </div>
      </section>
    </>
  );
}
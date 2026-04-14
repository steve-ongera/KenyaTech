// src/pages/AboutPage.jsx
//
// Requires Bootstrap Icons in your HTML head (or imported in your CSS):
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
//

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeam, getSiteSettings } from '../services/api';
import { Section, SectionHeader, PageHero, Spinner } from '../components/UI';

const VALUES = [
  { iconClass: 'bi bi-fire',            title: 'Craftsmanship',    desc: 'We obsess over details. Quality isnt a feature — its our default.' },
  { iconClass: 'bi bi-globe-africa',    title: 'African-First',    desc: 'We build for African users, African infrastructure, African reality.' },
  { iconClass: 'bi bi-handshake',       title: 'Partnerships',     desc: 'Were not a vendor — were a long-term partner in your digital journey.' },
  { iconClass: 'bi bi-lightning-fill',  title: 'Velocity',         desc: 'Fast iteration without cutting corners. We ship, learn, and improve.' },
  { iconClass: 'bi bi-shield-lock-fill',title: 'Trust & Integrity',desc: 'Honest timelines, transparent pricing, no hidden surprises.' },
  { iconClass: 'bi bi-graph-up-arrow',  title: 'Impact-Driven',   desc: 'We measure success by your success — not just lines of code shipped.' },
];

const MILESTONES = [
  { year: '2018', title: 'Founded in Nairobi',          desc: 'Three engineers with a shared vision: world-class tech, made in Kenya.' },
  { year: '2019', title: 'First Enterprise Client',     desc: 'Delivered a digital payments platform serving 50,000+ users.' },
  { year: '2021', title: 'Team of 25',                  desc: 'Grew to a full-service studio: engineering, design, and DevOps.' },
  { year: '2022', title: 'East Africa Expansion',       desc: 'Opened satellite offices in Kampala and Dar es Salaam.' },
  { year: '2023', title: '150 Projects Delivered',      desc: 'Crossed the 150-project milestone across 12 industries.' },
  { year: '2024', title: 'AI & Data Practice Launched', desc: 'Dedicated team for machine learning and data engineering.' },
];

export default function AboutPage() {
  const [team, setTeam]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeam('?ordering=order')
      .then(d => setTeam(d.results || d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="About KenyaTech"
        title="We Build the Digital Infrastructure Africa Needs"
        subtitle="Founded in 2018, KenyaTech is a Nairobi-based product studio delivering world-class web, mobile, and cloud solutions to clients across East Africa and beyond."
      />

      {/* ═══ MISSION & VISION ══════════════════════════════ */}
      <Section>
        <div className="kt-container">
          <div className="kt-about-split">
            <div className="kt-about-split__text">
              <span className="kt-eyebrow">Our Mission</span>
              <h2 className="kt-about-split__title">
                Democratising World-Class Technology for African Businesses
              </h2>
              <p>
                We believe every African business deserves access to the same calibre of software that powers Silicon Valley unicorns. KenyaTech bridges that gap — bringing senior engineering talent, modern tooling, and product thinking to organisations of every size.
              </p>
              <p>
                From ambitious startups to government agencies, we've helped over 80 clients transform their operations, reach more customers, and scale confidently in the digital age.
              </p>
              <Link to="/contact" className="kt-btn">
                Start a Conversation <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="kt-about-split__visual">
              <div className="kt-about-stat-stack">
                {[
                  { v: '150+', l: 'Projects Delivered' },
                  { v: '80+',  l: 'Happy Clients' },
                  { v: '6+',   l: 'Years Experience' },
                  { v: '12',   l: 'Industries Served' },
                ].map(s => (
                  <div key={s.l} className="kt-about-stat">
                    <strong>{s.v}</strong>
                    <span>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ VALUES ════════════════════════════════════════ */}
      <Section className="kt-section--alt">
        <div className="kt-container">
          <SectionHeader
            eyebrow="What We Stand For"
            title="Values That Guide Everything We Build"
          />
          <div className="kt-values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="kt-value-card">
                <i className={`kt-value-card__icon ${v.iconClass}`} />
                <h3 className="kt-value-card__title">{v.title}</h3>
                <p className="kt-value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ MILESTONES ════════════════════════════════════ */}
      <Section>
        <div className="kt-container">
          <SectionHeader
            eyebrow="Our Journey"
            title="From a Nairobi Garage to East Africa's Leading Studio"
          />
          <div className="kt-timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`kt-timeline__item${i % 2 === 0 ? '' : ' kt-timeline__item--right'}`}>
                <div className="kt-timeline__year">{m.year}</div>
                <div className="kt-timeline__dot" />
                <div className="kt-timeline__card">
                  <h3 className="kt-timeline__title">{m.title}</h3>
                  <p className="kt-timeline__desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ TEAM ══════════════════════════════════════════ */}
      <Section className="kt-section--alt" id="team">
        <div className="kt-container">
          <SectionHeader
            eyebrow="The People"
            title="The Minds Behind KenyaTech"
            subtitle="A diverse team of engineers, designers, and strategists united by one goal: building great products."
          />
          {loading ? (
            <div className="kt-flex-center"><Spinner /></div>
          ) : (
            <div className="kt-team-grid kt-team-grid--lg">
              {team.length > 0 ? team.map(m => (
                <div key={m.id} className="kt-team-card">
                  <div className="kt-team-card__photo">
                    {m.photo
                      ? <img src={m.photo} alt={m.name} />
                      : <div className="kt-team-card__placeholder">{m.name[0]}</div>}
                  </div>
                  <div className="kt-team-card__info">
                    <h3 className="kt-team-card__name">{m.name}</h3>
                    <p className="kt-team-card__role">{m.role}</p>
                    <p className="kt-team-card__dept">{m.department}</p>
                    <div className="kt-team-card__socials">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                          <i className="bi bi-linkedin" />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X">
                          <i className="bi bi-twitter-x" />
                        </a>
                      )}
                      {m.github && (
                        <a href={m.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                          <i className="bi bi-github" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="kt-empty">Team members coming soon.</p>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* ═══ CTA ═══════════════════════════════════════════ */}
      <Section>
        <div className="kt-container">
          <div className="kt-about-cta">
            <h2>Want to Join the Team?</h2>
            <p>We're always looking for talented engineers, designers, and product thinkers who want to make a dent in Africa's digital economy.</p>
            <div className="kt-about-cta__actions">
              <Link to="/careers" className="kt-btn kt-btn--lg">View Open Roles</Link>
              <Link to="/contact" className="kt-btn kt-btn--outline kt-btn--lg">Get in Touch</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
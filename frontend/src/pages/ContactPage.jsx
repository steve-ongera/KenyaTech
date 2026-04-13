// src/pages/ContactPage.jsx
import { useState } from 'react';
import { Section, PageHero, Alert } from '../components/UI';
import { sendContact, getServices } from '../services/api';
import { useEffect } from 'react';

const CONTACT_INFO = [
  {
    icon: '📍',
    label: 'Visit Us',
    lines: ['ABC Place, Waiyaki Way', 'Westlands, Nairobi, Kenya'],
  },
  {
    icon: '✉️',
    label: 'Email Us',
    lines: ['hello@kenyatech.co.ke', 'careers@kenyatech.co.ke'],
    links: ['mailto:hello@kenyatech.co.ke', 'mailto:careers@kenyatech.co.ke'],
  },
  {
    icon: '📞',
    label: 'Call Us',
    lines: ['+254 700 000 000', 'Mon–Fri, 8am–6pm EAT'],
    links: ['tel:+254700000000', null],
  },
];

const FAQS = [
  { q: 'How long does a typical project take?',          a: 'Most web projects take 6–12 weeks. Mobile apps typically 10–16 weeks. We always agree on a timeline before we start.' },
  { q: 'Do you work with startups?',                    a: 'Absolutely. We have flexible engagement models designed for early-stage startups, including milestone-based payments.' },
  { q: 'Will I own the source code?',                   a: 'Yes. You get full ownership of all code, assets, and IP — no strings attached.' },
  { q: 'Can you work with our existing codebase?',      a: 'Yes. Our engineers are experienced in inheriting and improving existing codebases across all major stacks.' },
  { q: 'What are your payment terms?',                  a: '30% upfront, 40% at mid-project milestone, 30% on delivery. We also offer monthly retainer arrangements.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`kt-faq-item${open ? ' kt-faq-item--open' : ''}`}>
      <button className="kt-faq-item__q" onClick={() => setOpen(!open)}>
        {q}
        <span className="kt-faq-item__chevron">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="kt-faq-item__a">{a}</div>}
    </div>
  );
}

export default function ContactPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', service: '', message: '',
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  useEffect(() => {
    getServices('?ordering=order').then(d => setServices(d.results || d)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const payload = { ...form };
      if (!payload.service) delete payload.service;
      const data = await sendContact(payload);
      setSuccess(data.message || 'Message sent! We will be in touch within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', service: '', message: '' });
    } catch (err) {
      setError(err.data ? Object.values(err.data).flat().join(' ') : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's Talk About Your Project"
        subtitle="Whether you have a fully formed brief or just a rough idea — we'd love to hear from you. First conversation is always free."
      />

      <Section>
        <div className="kt-container">
          <div className="kt-contact-layout">

            {/* Left — info */}
            <div className="kt-contact-info">
              {CONTACT_INFO.map(item => (
                <div key={item.label} className="kt-contact-info-card">
                  <span className="kt-contact-info-card__icon">{item.icon}</span>
                  <div>
                    <strong className="kt-contact-info-card__label">{item.label}</strong>
                    {item.lines.map((line, i) => (
                      item.links?.[i]
                        ? <a key={i} href={item.links[i]} className="kt-contact-info-card__line">{line}</a>
                        : <p key={i} className="kt-contact-info-card__line">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="kt-contact-socials">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="kt-social-btn">LinkedIn</a>
                <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="kt-social-btn">𝕏 Twitter</a>
                <a href="https://github.com"   target="_blank" rel="noreferrer" className="kt-social-btn">GitHub</a>
              </div>

              {/* Map embed placeholder */}
              <div className="kt-map-placeholder">
                <div className="kt-map-placeholder__inner">
                  <span>📍</span>
                  <p>ABC Place, Waiyaki Way, Westlands</p>
                  <a
                    href="https://maps.google.com/?q=Westlands,Nairobi,Kenya"
                    target="_blank"
                    rel="noreferrer"
                    className="kt-btn kt-btn--sm kt-btn--outline"
                  >Open in Maps</a>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="kt-contact-form-wrap">
              {success ? (
                <div className="kt-apply-success">
                  <span className="kt-apply-success__icon">✅</span>
                  <h3>Message Sent!</h3>
                  <p>{success}</p>
                  <button
                    className="kt-btn kt-btn--outline"
                    onClick={() => setSuccess('')}
                  >Send Another Message</button>
                </div>
              ) : (
                <form className="kt-contact-form" onSubmit={handleSubmit} noValidate>
                  <h2 className="kt-contact-form__title">Send Us a Message</h2>
                  {error && <Alert type="error">{error}</Alert>}

                  <div className="kt-form-row">
                    <div className="kt-form-group">
                      <label>Your Name *</label>
                      <input className="kt-input" type="text" value={form.name} onChange={set('name')} required placeholder="John Kamau" />
                    </div>
                    <div className="kt-form-group">
                      <label>Email Address *</label>
                      <input className="kt-input" type="email" value={form.email} onChange={set('email')} required placeholder="john@company.co.ke" />
                    </div>
                  </div>

                  <div className="kt-form-row">
                    <div className="kt-form-group">
                      <label>Phone Number</label>
                      <input className="kt-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+254 700 000 000" />
                    </div>
                    <div className="kt-form-group">
                      <label>Service Interested In</label>
                      <select className="kt-input kt-select" value={form.service} onChange={set('service')}>
                        <option value="">Select a service…</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="kt-form-group">
                    <label>Subject</label>
                    <input className="kt-input" type="text" value={form.subject} onChange={set('subject')} placeholder="e.g. Mobile app development quote" />
                  </div>

                  <div className="kt-form-group">
                    <label>Message *</label>
                    <textarea
                      className="kt-input kt-textarea"
                      rows={6}
                      value={form.message}
                      onChange={set('message')}
                      required
                      placeholder="Tell us about your project, timeline, budget, or anything else you'd like us to know…"
                    />
                  </div>

                  <button type="submit" className="kt-btn kt-btn--lg" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="kt-section--alt">
        <div className="kt-container kt-container--narrow">
          <h2 className="kt-section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Frequently Asked Questions
          </h2>
          <div className="kt-faq-list">
            {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </Section>
    </>
  );
}
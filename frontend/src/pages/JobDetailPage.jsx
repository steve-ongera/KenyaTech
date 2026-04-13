// src/pages/JobDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob, applyForJob } from '../services/api';
import { Section, Spinner, PageHero, Alert } from '../components/UI';

function ApplyForm({ jobSlug, jobTitle }) {
  const [form, setForm]       = useState({
    first_name: '', last_name: '', email: '', phone: '',
    linkedin_url: '', portfolio_url: '', cover_letter: '',
  });
  const [resume, setResume]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setError('Please attach your CV/Resume.'); return; }
    setLoading(true); setError(''); setSuccess('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('resume', resume);
    try {
      const data = await applyForJob(jobSlug, fd);
      setSuccess(data.message || 'Application submitted! We will be in touch soon.');
      setForm({ first_name: '', last_name: '', email: '', phone: '', linkedin_url: '', portfolio_url: '', cover_letter: '' });
      setResume(null);
    } catch (err) {
      setError(err.data ? Object.values(err.data).flat().join(' ') : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="kt-apply-success">
      <span className="kt-apply-success__icon">🎉</span>
      <h3>Application Received!</h3>
      <p>{success}</p>
      <Link to="/careers" className="kt-btn kt-btn--outline">Back to Jobs</Link>
    </div>
  );

  return (
    <form className="kt-apply-form" onSubmit={handleSubmit} noValidate>
      <h3 className="kt-apply-form__title">Apply for {jobTitle}</h3>
      {error && <Alert type="error">{error}</Alert>}

      <div className="kt-form-row">
        <div className="kt-form-group">
          <label>First Name *</label>
          <input className="kt-input" type="text" value={form.first_name} onChange={set('first_name')} required placeholder="Jane" />
        </div>
        <div className="kt-form-group">
          <label>Last Name *</label>
          <input className="kt-input" type="text" value={form.last_name} onChange={set('last_name')} required placeholder="Wanjiru" />
        </div>
      </div>

      <div className="kt-form-row">
        <div className="kt-form-group">
          <label>Email Address *</label>
          <input className="kt-input" type="email" value={form.email} onChange={set('email')} required placeholder="jane@example.com" />
        </div>
        <div className="kt-form-group">
          <label>Phone Number</label>
          <input className="kt-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+254 700 000 000" />
        </div>
      </div>

      <div className="kt-form-row">
        <div className="kt-form-group">
          <label>LinkedIn Profile</label>
          <input className="kt-input" type="url" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="kt-form-group">
          <label>Portfolio / GitHub</label>
          <input className="kt-input" type="url" value={form.portfolio_url} onChange={set('portfolio_url')} placeholder="https://github.com/..." />
        </div>
      </div>

      <div className="kt-form-group">
        <label>Cover Letter</label>
        <textarea
          className="kt-input kt-textarea"
          rows={5}
          value={form.cover_letter}
          onChange={set('cover_letter')}
          placeholder="Tell us why you're a great fit for this role and what excites you about KenyaTech…"
        />
      </div>

      <div className="kt-form-group">
        <label>CV / Resume * <span className="kt-form-hint">(PDF, DOC, DOCX — max 5MB)</span></label>
        <div className="kt-file-upload">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            id="resume-upload"
            onChange={e => setResume(e.target.files[0])}
            className="kt-file-upload__input"
          />
          <label htmlFor="resume-upload" className="kt-file-upload__label">
            {resume ? (
              <><span className="kt-file-upload__icon">📄</span> {resume.name}</>
            ) : (
              <><span className="kt-file-upload__icon">📎</span> Choose file or drag & drop</>
            )}
          </label>
        </div>
      </div>

      <button type="submit" className="kt-btn kt-btn--lg" disabled={loading}>
        {loading ? 'Submitting Application…' : 'Submit Application →'}
      </button>
    </form>
  );
}

export default function JobDetailPage() {
  const { slug } = useParams();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getJob(slug)
      .then(setJob)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="kt-loading-screen"><Spinner size="lg" /></div>;
  if (!job) return (
    <div className="kt-container kt-py-8">
      <p>Job not found. <Link to="/careers">Back to Careers</Link></p>
    </div>
  );

  const parseLines = (text) =>
    text ? text.split('\n').filter(Boolean).map((l, i) => <li key={i}>{l.replace(/^[-•*]\s*/, '')}</li>) : null;

  return (
    <>
      <PageHero
        eyebrow={job.department?.name || 'Open Role'}
        title={job.title}
        subtitle={`${job.job_type_display} · ${job.level_display} · ${job.location}`}
      />

      <Section>
        <div className="kt-container">
          <div className="kt-detail-layout">
            {/* Job content */}
            <div className="kt-detail-layout__main">
              {/* Quick chips */}
              <div className="kt-job-chips">
                <span className="kt-tag">📍 {job.location}</span>
                <span className="kt-tag">⏰ {job.job_type_display}</span>
                <span className="kt-tag">🎯 {job.level_display}</span>
                <span className="kt-tag">💰 {job.salary_range}</span>
                {job.deadline && (
                  <span className="kt-tag">📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                )}
              </div>

              <div className="kt-prose">
                <h2>About the Role</h2>
                <p>{job.description}</p>

                {job.responsibilities && (
                  <>
                    <h2>Responsibilities</h2>
                    <ul>{parseLines(job.responsibilities)}</ul>
                  </>
                )}

                {job.requirements && (
                  <>
                    <h2>Requirements</h2>
                    <ul>{parseLines(job.requirements)}</ul>
                  </>
                )}

                {job.nice_to_have && (
                  <>
                    <h2>Nice to Have</h2>
                    <ul>{parseLines(job.nice_to_have)}</ul>
                  </>
                )}

                {job.benefits && (
                  <>
                    <h2>Benefits & Perks</h2>
                    <ul>{parseLines(job.benefits)}</ul>
                  </>
                )}
              </div>

              {/* Application form toggle */}
              <div className="kt-apply-section">
                {!showForm ? (
                  <button
                    className="kt-btn kt-btn--lg"
                    onClick={() => setShowForm(true)}
                  >
                    Apply for This Role →
                  </button>
                ) : (
                  <ApplyForm jobSlug={slug} jobTitle={job.title} />
                )}
              </div>
            </div>

            {/* Aside */}
            <aside className="kt-detail-layout__aside">
              <div className="kt-aside-card">
                <h3 className="kt-aside-card__title">Job Summary</h3>
                <ul className="kt-project-meta-list">
                  <li><span>Department</span><strong>{job.department?.name}</strong></li>
                  <li><span>Type</span><strong>{job.job_type_display}</strong></li>
                  <li><span>Level</span><strong>{job.level_display}</strong></li>
                  <li><span>Location</span><strong>{job.location}</strong></li>
                  <li><span>Salary</span><strong>{job.salary_range}</strong></li>
                  {job.deadline && (
                    <li>
                      <span>Deadline</span>
                      <strong>{new Date(job.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                    </li>
                  )}
                </ul>
                {!showForm && (
                  <button
                    className="kt-btn kt-btn--full"
                    onClick={() => { setShowForm(true); document.querySelector('.kt-apply-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Apply Now
                  </button>
                )}
              </div>

              <div className="kt-aside-card">
                <h3 className="kt-aside-card__title">Share This Role</h3>
                <div className="kt-share-btns">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noreferrer"
                    className="kt-share-btn"
                  >Share on LinkedIn</a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Hiring: ${job.title} at KenyaTech`)}`}
                    target="_blank" rel="noreferrer"
                    className="kt-share-btn"
                  >Share on 𝕏</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <div className="kt-container kt-py-4">
        <Link to="/careers" className="kt-back-link">← Back to Careers</Link>
      </div>
    </>
  );
}
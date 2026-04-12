// src/pages/ServiceDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getService } from '../services/api';
import { Section, Spinner, Stars, PageHero } from '../components/UI';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getService(slug)
      .then(setService)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="kt-loading-screen"><Spinner size="lg" /></div>;
  if (!service) return <div className="kt-container kt-py-8"><p>Service not found.</p></div>;

  return (
    <>
      <PageHero
        eyebrow={service.category_name || 'Service'}
        title={service.title}
        subtitle={service.short_desc}
      />
      <Section>
        <div className="kt-container">
          <div className="kt-detail-layout">
            <div className="kt-detail-layout__main">
              {service.image && (
                <img src={service.image} alt={service.title} className="kt-detail-cover" />
              )}
              <div
                className="kt-prose"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
            <aside className="kt-detail-layout__aside">
              <div className="kt-aside-card">
                <h3 className="kt-aside-card__title">Ready to get started?</h3>
                <p>Tell us about your project and we'll put together a custom proposal within 48 hours.</p>
                <Link to="/contact" className="kt-btn kt-btn--full">Get a Free Quote</Link>
              </div>
              {service.testimonials?.length > 0 && (
                <div className="kt-aside-card">
                  <h3 className="kt-aside-card__title">What clients say</h3>
                  {service.testimonials.map(t => (
                    <div key={t.id} className="kt-mini-testimonial">
                      <Stars rating={t.rating} />
                      <p>"{t.content}"</p>
                      <strong>{t.name}, {t.company}</strong>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
// src/pages/BlogDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, getBlogPosts } from '../services/api';
import { Section, Spinner, Stars } from '../components/UI';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogPost(slug)
      .then(p => {
        setPost(p);
        // fetch related by first tag
        if (p.tags?.length > 0) {
          getBlogPosts(`?tags__slug=${p.tags[0].slug}&ordering=-published_at`)
            .then(d => {
              const results = (d.results || d).filter(r => r.slug !== slug).slice(0, 3);
              setRelated(results);
            })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="kt-loading-screen"><Spinner size="lg" /></div>;
  if (!post) return (
    <div className="kt-container kt-py-8">
      <p>Article not found. <Link to="/blog">Back to Blog</Link></p>
    </div>
  );

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <>
      {/* Hero */}
      <div className="kt-blog-hero">
        <div className="kt-blog-hero__bg" />
        <div className="kt-container kt-blog-hero__inner">
          <div className="kt-blog-hero__tags">
            {post.tags?.map(t => <span key={t.slug} className="kt-tag">{t.name}</span>)}
          </div>
          <h1 className="kt-blog-hero__title">{post.title}</h1>
          <p className="kt-blog-hero__excerpt">{post.excerpt}</p>
          <div className="kt-blog-hero__meta">
            {post.author && (
              <div className="kt-blog-hero__author">
                {post.author.photo
                  ? <img src={post.author.photo} alt={post.author.name} />
                  : <div className="kt-blog-hero__author-avatar">{post.author.name[0]}</div>}
                <div>
                  <strong>{post.author.name}</strong>
                  <span>{post.author.role}</span>
                </div>
              </div>
            )}
            <div className="kt-blog-hero__info">
              <span>{date}</span>
              <span className="kt-blog-card__dot">·</span>
              <span>{post.read_time_minutes} min read</span>
              <span className="kt-blog-card__dot">·</span>
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image && (
        <div className="kt-blog-cover-wrap">
          <div className="kt-container">
            <img src={post.cover_image} alt={post.title} className="kt-blog-cover" />
          </div>
        </div>
      )}

      <Section>
        <div className="kt-container">
          <div className="kt-blog-detail-layout">
            {/* Article body */}
            <article className="kt-prose kt-blog-detail-layout__main">
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </article>

            {/* Sidebar */}
            <aside className="kt-detail-layout__aside">
              {post.author && (
                <div className="kt-aside-card">
                  <h3 className="kt-aside-card__title">About the Author</h3>
                  <div className="kt-author-card">
                    {post.author.photo
                      ? <img src={post.author.photo} alt={post.author.name} className="kt-author-card__photo" />
                      : <div className="kt-author-card__placeholder">{post.author.name[0]}</div>}
                    <strong className="kt-author-card__name">{post.author.name}</strong>
                    <span className="kt-author-card__role">{post.author.role}</span>
                    {post.author.bio && <p className="kt-author-card__bio">{post.author.bio}</p>}
                  </div>
                </div>
              )}

              <div className="kt-aside-card">
                <h3 className="kt-aside-card__title">Tags</h3>
                <div className="kt-tag-cloud">
                  {post.tags?.map(t => <span key={t.slug} className="kt-tag">{t.name}</span>)}
                </div>
              </div>

              <div className="kt-aside-card kt-aside-card--cta">
                <h3>Build with KenyaTech</h3>
                <p>Enjoyed this article? Let's collaborate on your next project.</p>
                <Link to="/contact" className="kt-btn kt-btn--full">Get in Touch</Link>
              </div>
            </aside>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="kt-related-posts">
              <h2 className="kt-related-posts__title">Related Articles</h2>
              <div className="kt-blog-grid kt-blog-grid--3col">
                {related.map(r => {
                  const rDate = r.published_at
                    ? new Date(r.published_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';
                  return (
                    <article key={r.id} className="kt-blog-card">
                      <Link to={`/blog/${r.slug}`} className="kt-blog-card__img-wrap">
                        {r.cover_image
                          ? <img src={r.cover_image} alt={r.title} loading="lazy" />
                          : <div className="kt-blog-card__placeholder"><span>📝</span></div>}
                      </Link>
                      <div className="kt-blog-card__body">
                        <h3 className="kt-blog-card__title">
                          <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                        </h3>
                        <p className="kt-blog-card__excerpt">{r.excerpt}</p>
                        <div className="kt-blog-card__meta">
                          <span>{rDate}</span>
                          <span className="kt-blog-card__dot">·</span>
                          <span>{r.read_time_minutes} min read</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Section>

      <div className="kt-container kt-py-4">
        <Link to="/blog" className="kt-back-link">← Back to Blog</Link>
      </div>
    </>
  );
}
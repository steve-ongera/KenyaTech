// src/pages/BlogPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, getBlogTags } from '../services/api';
import { Section, PageHero, Spinner } from '../components/UI';

function BlogCard({ title, slug, cover_image, excerpt, published_at, read_time_minutes, author_name, author_photo, tags = [] }) {
  const date = published_at
    ? new Date(published_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';
  return (
    <article className="kt-blog-card">
      <Link to={`/blog/${slug}`} className="kt-blog-card__img-wrap">
        {cover_image
          ? <img src={cover_image} alt={title} loading="lazy" />
          : <div className="kt-blog-card__placeholder"><span>📝</span></div>}
      </Link>
      <div className="kt-blog-card__body">
        <div className="kt-blog-card__tags">
          {tags.slice(0, 3).map(t => (
            <span key={t.slug} className="kt-tag">{t.name}</span>
          ))}
        </div>
        <h2 className="kt-blog-card__title">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h2>
        <p className="kt-blog-card__excerpt">{excerpt}</p>
        <div className="kt-blog-card__footer">
          <div className="kt-blog-card__author">
            {author_photo
              ? <img src={author_photo} alt={author_name} className="kt-blog-card__avatar" />
              : <div className="kt-blog-card__avatar-placeholder">{author_name?.[0] || 'K'}</div>}
            <span>{author_name || 'KenyaTech'}</span>
          </div>
          <div className="kt-blog-card__meta">
            <span>{date}</span>
            <span className="kt-blog-card__dot">·</span>
            <span>{read_time_minutes} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [posts, setPosts]       = useState([]);
  const [tags, setTags]         = useState([]);
  const [activeTag, setTag]     = useState('all');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);

  const fetchPosts = (tag, q, pg) => {
    setLoading(true);
    let params = `?page=${pg}`;
    if (tag !== 'all') params += `&tags__slug=${tag}`;
    if (q) params += `&search=${encodeURIComponent(q)}`;
    getBlogPosts(params)
      .then(d => {
        const results = d.results || d;
        setPosts(pg === 1 ? results : prev => [...prev, ...results]);
        setHasMore(!!d.next);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBlogTags().then(d => setTags(d.results || d)).catch(console.error);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPosts(activeTag, search, 1);
  }, [activeTag, search]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(activeTag, search, next);
  };

  return (
    <>
      <PageHero
        eyebrow="The KenyaTech Blog"
        title="Engineering Insights from the Front Line"
        subtitle="Tutorials, opinions, and deep dives from our team of engineers and designers."
      />

      <Section>
        <div className="kt-container">
          {/* Search & filter */}
          <div className="kt-blog-controls">
            <input
              type="search"
              placeholder="Search articles…"
              className="kt-input kt-blog-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="kt-filter-tabs">
              <button
                className={`kt-filter-tab${activeTag === 'all' ? ' active' : ''}`}
                onClick={() => setTag('all')}
              >All</button>
              {tags.map(t => (
                <button
                  key={t.slug}
                  className={`kt-filter-tab${activeTag === t.slug ? ' active' : ''}`}
                  onClick={() => setTag(t.slug)}
                >{t.name}</button>
              ))}
            </div>
          </div>

          {/* Posts grid */}
          {loading && page === 1 ? (
            <div className="kt-flex-center kt-py-8"><Spinner /></div>
          ) : posts.length > 0 ? (
            <>
              <div className="kt-blog-grid kt-blog-grid--full">
                {posts.map(p => <BlogCard key={p.id} {...p} />)}
              </div>
              {hasMore && (
                <div className="kt-section-cta">
                  <button
                    className="kt-btn kt-btn--outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading…' : 'Load More Articles'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="kt-empty-state">
              <span className="kt-empty-state__icon">📭</span>
              <p>No articles found. Try a different search or tag.</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
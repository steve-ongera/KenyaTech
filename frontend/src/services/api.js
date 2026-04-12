// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || 'API error'), { status: res.status, data: err });
  }
  return res.json();
}

// ─── Homepage ────────────────────────────────────────────
export const getHomepageData = () => request('/homepage/');

// ─── Settings ────────────────────────────────────────────
export const getSiteSettings = () => request('/settings/');
export const getSiteStats    = () => request('/stats/');
export const getClientLogos  = () => request('/client-logos/');

// ─── Services ────────────────────────────────────────────
export const getServices         = (params = '') => request(`/services/${params}`);
export const getService          = (slug)         => request(`/services/${slug}/`);
export const getFeaturedServices = ()             => request('/services/featured/');
export const getServiceCategories = ()            => request('/service-categories/');

// ─── Projects ────────────────────────────────────────────
export const getProjects         = (params = '') => request(`/projects/${params}`);
export const getProject          = (slug)         => request(`/projects/${slug}/`);
export const getFeaturedProjects = ()             => request('/projects/featured/');

// ─── Team ────────────────────────────────────────────────
export const getTeam         = (params = '') => request(`/team/${params}`);
export const getTeamMember   = (slug)         => request(`/team/${slug}/`);
export const getFeaturedTeam = ()             => request('/team/featured/');

// ─── Blog ────────────────────────────────────────────────
export const getBlogPosts    = (params = '') => request(`/blog/${params}`);
export const getBlogPost     = (slug)         => request(`/blog/${slug}/`);
export const getFeaturedPosts = ()            => request('/blog/featured/');
export const getBlogTags     = ()             => request('/blog/tags/');

// ─── Careers ─────────────────────────────────────────────
export const getJobs       = (params = '') => request(`/jobs/${params}`);
export const getJob        = (slug)         => request(`/jobs/${slug}/`);
export const getDepartments = ()            => request('/departments/');
export const applyForJob   = (slug, data)  => request(`/jobs/${slug}/apply/`, {
  method: 'POST',
  body: data instanceof FormData ? data : JSON.stringify(data),
  headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
});

// ─── Testimonials ─────────────────────────────────────────
export const getTestimonials = (params = '') => request(`/testimonials/${params}`);

// ─── FAQ ─────────────────────────────────────────────────
export const getFAQs           = (params = '') => request(`/faqs/${params}`);
export const getFAQCategories  = ()             => request('/faq-categories/');

// ─── Contact ─────────────────────────────────────────────
export const sendContact = (data) => request('/contact/', {
  method: 'POST',
  body: JSON.stringify(data),
});

// ─── Newsletter ──────────────────────────────────────────
export const subscribeNewsletter = (data) => request('/newsletter/', {
  method: 'POST',
  body: JSON.stringify(data),
});
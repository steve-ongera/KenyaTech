// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                        element={<HomePage />} />
          <Route path="/about"                   element={<AboutPage />} />
          <Route path="/services"                element={<ServicesPage />} />
          <Route path="/services/:slug"          element={<ServiceDetailPage />} />
          <Route path="/projects"                element={<ProjectsPage />} />
          <Route path="/projects/:slug"          element={<ProjectDetailPage />} />
          <Route path="/blog"                    element={<BlogPage />} />
          <Route path="/blog/:slug"              element={<BlogDetailPage />} />
          <Route path="/careers"                 element={<CareersPage />} />
          <Route path="/careers/:slug"           element={<JobDetailPage />} />
          <Route path="/contact"                 element={<ContactPage />} />
          <Route path="*"                        element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog',     to: '/blog' },
  { label: 'Careers',  to: '/careers' },
  { label: 'Contact',  to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navClass = scrolled || !isHome
    ? 'kt-nav kt-nav--solid'
    : 'kt-nav kt-nav--transparent';

  return (
    <header className={navClass}>
      <div className="kt-nav__inner">
        {/* Logo */}
        <Link to="/" className="kt-nav__logo">
          <span className="kt-logo-mark">K</span>
          <span className="kt-logo-text">enya<strong>Tech</strong></span>
        </Link>

        {/* Desktop links */}
        <nav className="kt-nav__links">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `kt-nav__link${isActive ? ' kt-nav__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="kt-nav__actions">
          <Link to="/contact" className="kt-btn kt-btn--sm">Get Started</Link>
          <button
            className="kt-nav__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`kt-nav__mobile${menuOpen ? ' kt-nav__mobile--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `kt-nav__mobile-link${isActive ? ' active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/contact" className="kt-btn kt-btn--full mt-2">Get Started</Link>
      </div>
    </header>
  );
}
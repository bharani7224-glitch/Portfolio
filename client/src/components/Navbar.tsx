import React, { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home',      label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'projects',  label: 'Projects' },
  { id: 'about',     label: 'About' },
  { id: 'contact',   label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [active, setActive]       = useState('home');
  const [scrolled, setScrolled]   = useState(false);

  // Track scroll to highlight the correct section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const offsets = NAV_ITEMS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : { id, top: Infinity };
      });

      const current = offsets
        .filter(o => o.top <= 100)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActive(current.id);
      else if (offsets[0]?.top > 100) setActive('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => scrollTo('home')}>
          <div className="logo-icon">
            <Code2 size={18} className="icon-gradient" />
          </div>
          <span className="logo-text">
            Bharani<span>.dev</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`nav-link ${active === id ? 'active' : ''}`}
            >
              {label}
              {active === id && <span className="active-dot" />}
            </button>
          ))}
        </div>

        {/* Desktop Actions: Theme Toggle & CTA */}
        <div className="navbar-actions">
          <ThemeToggle />
          <button
            className="nav-cta btn btn-primary"
            onClick={() => scrollTo('contact')}
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Actions: Theme Toggle & Hamburger */}
        <div className="mobile-header-actions">
          <ThemeToggle className="mobile-theme-toggle" />
          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`mobile-nav-link ${active === id ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
        <div className="mobile-drawer-bottom">
          <button
            className="btn btn-primary mobile-cta"
            onClick={() => scrollTo('contact')}
          >
            Hire Me
          </button>
        </div>
      </div>
    </nav>
  );
};

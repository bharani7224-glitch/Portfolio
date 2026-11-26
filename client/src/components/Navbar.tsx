import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home',      label: '[01] HOME' },
  { id: 'education', label: '[02] EXPERIENCE' },
  { id: 'projects',  label: '[03] PROJECTS' },
  { id: 'about',     label: '[04] DOSSIER' },
  { id: 'contact',   label: '[05] CONTACT' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [active, setActive]     = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const offsets = NAV_ITEMS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : { id, top: Infinity };
      });

      const current = offsets
        .filter((o) => o.top <= 120)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActive(current.id);
      else if (offsets[0]?.top > 120) setActive('home');
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
    <nav className={`swiss-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container swiss-nav-container">
        {/* Brand / Swiss Identification */}
        <div className="swiss-nav-brand" onClick={() => scrollTo('home')}>
          <span className="brand-title">BHARANI.DEV</span>
          <span className="brand-status">
            <span className="status-indicator" /> SYS.ACTIVE
          </span>
        </div>

        {/* Desktop Navigation Ledger */}
        <div className="swiss-nav-links">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`swiss-nav-link ${active === id ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Institutional Contact Action */}
        <div className="swiss-nav-actions">
          <button
            className="btn btn-primary nav-contact-btn"
            onClick={() => scrollTo('contact')}
          >
            INITIATE CONTACT
          </button>

          <button
            className="swiss-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`swiss-mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="mono-tag active">
            <span className="status-indicator" /> NAVIGATION PROTOCOL
          </span>
        </div>
        <div className="mobile-links-stack">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`swiss-mobile-link ${active === id ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary mobile-cta-btn"
          onClick={() => scrollTo('contact')}
        >
          INITIATE CONTACT
        </button>
      </div>
    </nav>
  );
};

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home',      label: 'HOME' },
  { id: 'projects',  label: 'SELECTED WORKS' },
  { id: 'education', label: 'EXPERIENCE' },
  { id: 'about',     label: 'ABOUT' },
  { id: 'contact',   label: 'CONTACT' },
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
        .filter((o) => o.top <= 140)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActive(current.id);
      else if (offsets[0]?.top > 140) setActive('home');
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
    <header className={`panda-nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="panda-navbar">
          {/* Logo Brand */}
          <div className="panda-logo" onClick={() => scrollTo('home')} data-cursor="HOME">
            <span className="logo-text">BHARANI</span>
            <span className="logo-dot" />
            <span className="logo-tag">DEV</span>
          </div>

          {/* Desktop Links Pill */}
          <div className="panda-nav-links">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`panda-nav-link ${active === id ? 'active' : ''}`}
                data-cursor={label}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Action CTA */}
          <div className="panda-nav-actions">
            <button
              className="panda-btn panda-btn-primary nav-cta-pill"
              onClick={() => scrollTo('contact')}
              data-cursor="SAY HI"
            >
              <span>LET'S TALK</span>
              <ArrowUpRight size={15} />
            </button>

            <button
              className="panda-mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              data-cursor="MENU"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div className={`panda-mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`mobile-nav-btn ${active === id ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
          <button
            className="panda-btn panda-btn-primary w-full justify-center mt-4"
            onClick={() => scrollTo('contact')}
          >
            <span>LET'S TALK</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

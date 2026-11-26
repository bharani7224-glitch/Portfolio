import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { EducationSection } from '../sections/EducationSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { AboutSection } from '../sections/AboutSection';
import { ContactSection } from '../sections/ContactSection';
import { SceneCanvas } from '../components/canvas/SceneCanvas';
import { Mail, Phone, MapPin, ArrowUpRight, ArrowUp, Lock } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import { Link } from 'react-router-dom';
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const NAV_LINKS = [
  { label: '[01] HOME',      id: 'home' },
  { label: '[02] EXPERIENCE', id: 'education' },
  { label: '[03] PROJECTS',  id: 'projects' },
  { label: '[04] DOSSIER',     id: 'about' },
  { label: '[05] CONTACT',   id: 'contact' },
];

export const PortfolioPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const profile = PORTFOLIO_DATA.profile;

  // Initialize Lenis ultra-silky smooth inertial scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      gsap.ticker.remove(updateLenis);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Precision 3D WebGL Torus-Monolith Artifact */}
      <SceneCanvas />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />

        {/* Swiss Precision Marquee Ticker */}
        <div className="swiss-ticker" aria-hidden="true">
          <div className="swiss-ticker-track">
            FULL-STACK ARCHITECTURE <span>//</span> SCALABLE .NET SYSTEMS <span>//</span> ENTERPRISE ERP <span>//</span> OCR PIPELINES <span>//</span> REACT &amp; TYPESCRIPT <span>//</span> POSTGRESQL <span>//</span> CLEAN ARCHITECTURE <span>//</span> HIGH CONCURRENCY
            <span>//</span>
            FULL-STACK ARCHITECTURE <span>//</span> SCALABLE .NET SYSTEMS <span>//</span> ENTERPRISE ERP <span>//</span> OCR PIPELINES <span>//</span> REACT &amp; TYPESCRIPT <span>//</span> POSTGRESQL <span>//</span> CLEAN ARCHITECTURE <span>//</span> HIGH CONCURRENCY
          </div>
        </div>

        <EducationSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="site-footer">
        {/* Subtle glowing top divider */}
        <div className="footer-top-divider" />

        <div className="footer-body">
          <div className="container footer-grid">

            {/* Brand column */}
            <div className="footer-brand-col">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <span className="footer-logo-text">Bharani<span>.dev</span></span>
              </div>
              <p className="footer-tagline">
                Crafting premium digital experiences with clean code and modern design. Available for freelance & full-time roles.
              </p>
              {/* Socials */}
              <div className="footer-socials">
                {profile.socials.map((s) => (
                  <a 
                    key={s.platform} 
                    href={s.url}
                    target={s.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer" 
                    aria-label={s.label}
                    className="footer-social-btn"
                  >
                    {s.platform === 'GitHub' && <Github size={18} />}
                    {s.platform === 'LinkedIn' && <Linkedin size={18} />}
                    {s.platform === 'Email' && <Mail size={18} />}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                {NAV_LINKS.map(({ label, id }) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="footer-link">
                      <ArrowUpRight size={13} />
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/admin" className="footer-link" style={{ opacity: 0.7 }}>
                    <Lock size={12} />
                    Admin CMS
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="footer-col">
              <h4 className="footer-col-title">Get In Touch</h4>
              <ul className="footer-contact-list">
                <li>
                  <a href={`mailto:${profile.email}`} className="footer-contact-item">
                    <div className="footer-contact-icon"><Mail size={14} /></div>
                    <span>{profile.email}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="footer-contact-item">
                    <div className="footer-contact-icon"><Phone size={14} /></div>
                    <span>{profile.phone}</span>
                  </a>
                </li>
                <li>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><MapPin size={14} /></div>
                    <span>{profile.location}</span>
                  </div>
                </li>
              </ul>

              {/* Availability badge */}
              <div className="footer-available">
                <span className="avail-dot" />
                Available for new projects
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="footer-divider" />
        </div>
      </footer>
      
      {/* Back to top button */}
      <button 
        className={`hs-back-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
};

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { EducationSection } from '../sections/EducationSection';
import { AboutSection } from '../sections/AboutSection';
import { ContactSection } from '../sections/ContactSection';
import { SceneCanvas } from '../components/canvas/SceneCanvas';
import { CustomCursor } from '../components/CustomCursor';
import { ArrowUp, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import { Link } from 'react-router-dom';
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const NAV_LINKS = [
  { label: 'HOME',       id: 'home' },
  { label: 'PROJECTS',   id: 'projects' },
  { label: 'EXPERIENCE', id: 'education' },
  { label: 'ABOUT',      id: 'about' },
  { label: 'CONTACT',    id: 'contact' },
];

export const PortfolioPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const profile = PORTFOLIO_DATA.profile;

  // Initialize Lenis smooth inertial scrolling with GSAP ticker sync
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
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
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Tactile Magnetic Cursor Follower */}
      <CustomCursor />

      {/* Reactive Iridescent Liquid-Metal WebGL Canvas */}
      <SceneCanvas />

      {/* Floating Pill Navigation Bar */}
      <Navbar />

      <main className="relative z-10">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Full-bleed Angled Velocity Marquee */}
        <div className="velocity-marquee" aria-hidden="true">
          <div className="velocity-marquee-track">
            FULL-STACK ENGINEERING <span>•</span> ERP ARCHITECTURE <span>•</span> OCR AUTOMATION <span>•</span> REACT &amp; TYPESCRIPT <span>•</span> C# .NET 9 <span>•</span> CLEAN ARCHITECTURE <span>•</span> POSTGRESQL <span>•</span>
            FULL-STACK ENGINEERING <span>•</span> ERP ARCHITECTURE <span>•</span> OCR AUTOMATION <span>•</span> REACT &amp; TYPESCRIPT <span>•</span> C# .NET 9 <span>•</span> CLEAN ARCHITECTURE <span>•</span> POSTGRESQL <span>•</span>
          </div>
        </div>

        {/* 3. Selected Works (Projects) */}
        <ProjectsSection />

        {/* 4. High-Contrast Warm Cream Section: Experience & Education */}
        <EducationSection />

        {/* 5. High-Contrast Warm Cream Section: About Bharani */}
        <AboutSection />

        {/* 6. Contact & Collaboration */}
        <ContactSection />
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="panda-footer section-dark">
        <div className="container">
          <div className="footer-top-row flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-[rgba(255,255,255,0.12)]">
            <div className="footer-brand">
              <span className="text-2xl font-black font-['Syne'] text-white">BHARANI.DEV</span>
              <p className="text-zinc-400 text-sm mt-2 max-w-sm">
                Engineering high-concurrency backends, scalable enterprise ERPs, and reactive web experiences.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="sticker-pill lime">
                <span className="pulsing-dot" />
                <span>OPEN FOR APPOINTMENTS</span>
              </div>
              <Link to="/admin" className="sticker-pill dark" data-cursor="CMS">
                <Lock size={12} />
                <span>ADMIN CMS</span>
              </Link>
            </div>
          </div>

          <div className="footer-bottom-grid grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
            {/* Quick Links */}
            <div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-4">
                NAVIGATION
              </span>
              <div className="flex flex-col gap-2.5">
                {NAV_LINKS.map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-left text-sm text-zinc-400 hover:text-[#CCFF00] font-['Plus_Jakarta_Sans'] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Connect */}
            <div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-4">
                DIRECT CHANNELS
              </span>
              <div className="flex flex-col gap-2.5 text-sm text-zinc-400">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#CCFF00]">
                  <Mail size={14} />
                  <span>{profile.email}</span>
                </a>
                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-[#CCFF00]">
                  <Phone size={14} />
                  <span>{profile.phone}</span>
                </a>
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-4">
                NETWORKS
              </span>
              <div className="flex gap-3">
                {profile.socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target={s.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-[#141414] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-black transition-colors"
                    data-cursor={s.label.toUpperCase()}
                  >
                    {s.platform === 'GitHub' && <Github size={16} />}
                    {s.platform === 'LinkedIn' && <Linkedin size={16} />}
                    {s.platform === 'Email' && <Mail size={16} />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center text-xs font-mono text-zinc-500">
            <span>© {new Date().getFullYear()} BHARANI DHARAN. ALL RIGHTS RESERVED.</span>
            <span>BUILT WITH REACT 19 + THREE.JS + TAILWIND</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        className={`panda-scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        data-cursor="TOP"
      >
        <ArrowUp size={22} />
      </button>
    </>
  );
};

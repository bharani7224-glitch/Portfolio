import React, { useState, useEffect } from 'react';
import { ArrowDownRight, Mail, Download, Sparkles, MapPin } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const titles = PORTFOLIO_DATA.profile.roleTaglines;
  const [typedText, setTypedText] = useState('');
  const [titleIdx,  setTitleIdx]  = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cur = titles[titleIdx];
    if (deleting) {
      if (charIdx > 0) {
        t = setTimeout(() => {
          setTypedText(cur.slice(0, charIdx - 1));
          setCharIdx((p) => p - 1);
        }, 30);
      } else {
        t = setTimeout(() => {
          setDeleting(false);
          setTitleIdx((p) => (p + 1) % titles.length);
        }, 200);
      }
    } else {
      if (charIdx < cur.length) {
        t = setTimeout(() => {
          setTypedText(cur.slice(0, charIdx + 1));
          setCharIdx((p) => p + 1);
        }, 70);
      } else {
        t = setTimeout(() => setDeleting(true), 2400);
      }
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, titleIdx, titles]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="panda-hero-root section-dark">
      <div className="container panda-hero-container">
        {/* Availability & Location Bar */}
        <div className="panda-hero-meta-bar">
          <div className="sticker-pill lime" data-cursor="STATUS">
            <span className="pulsing-dot" />
            <span>AVAILABLE FOR HIRE // 10+ MOS @ NAVANALA TECH</span>
          </div>

          <div className="hero-location-pill" data-cursor="LOCATION">
            <MapPin size={13} className="text-[#CCFF00]" />
            <span>{PORTFOLIO_DATA.profile.location.toUpperCase()}</span>
          </div>
        </div>

        {/* Massive Statement Headline with Inline Interactive Stickers */}
        <div className="panda-hero-headline-wrap">
          <h1 className="panda-hero-headline">
            WE ARCHITECT{' '}
            <span className="inline-hero-pill lime" data-cursor="FULL-STACK">
              <Sparkles size={18} />
              HIGH-IMPACT
            </span>{' '}
            DIGITAL ENGINES{' '}
            <span className="inline-hero-pill vermilion" data-cursor="ASP.NET &amp; REACT">
              .NET 9 + REACT
            </span>{' '}
            FOR UNCOMPROMISING PERFORMANCE.
          </h1>
        </div>

        {/* Dynamic Typewriter Role Pill */}
        <div className="panda-role-ticker" data-cursor="SPECIALTY">
          <span className="ticker-label">FOCUS //</span>
          <span className="ticker-text">{typedText}</span>
          <span className="ticker-cursor">_</span>
        </div>

        {/* Bio Descriptor & Actions */}
        <div className="panda-hero-bottom-grid">
          <div className="panda-hero-bio-col">
            <p className="panda-hero-bio">
              I'm <strong className="text-white">Bharani</strong>, a Full-Stack Software Engineer engineering
              scalable cloud backends with <strong>C#, ASP.NET Core, and PostgreSQL</strong> alongside
              ultra-fluid, high-framerate <strong>React &amp; TypeScript</strong> web applications.
            </p>

            {/* Quick Skill Stickers */}
            <div className="hero-skill-stickers">
              <span className="sticker-pill dark">C# .NET</span>
              <span className="sticker-pill dark">ASP.NET CORE</span>
              <span className="sticker-pill dark">REACT.JS</span>
              <span className="sticker-pill dark">POSTGRESQL</span>
              <span className="sticker-pill dark">CLEAN ARCHITECTURE</span>
              <span className="sticker-pill dark">OCR AUTOMATION</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="panda-hero-cta-col">
            <div className="hero-cta-buttons">
              <button
                onClick={() => scrollTo('projects')}
                className="panda-btn panda-btn-primary"
                data-cursor="DISCOVER"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight size={18} />
              </button>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
                className="panda-btn panda-btn-outline"
                data-cursor="SAY HI"
              >
                <Mail size={16} />
                <span>LET'S CONNECT</span>
              </a>

              <a
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="panda-btn panda-btn-outline"
                data-cursor="DOWNLOAD"
              >
                <Download size={15} />
                <span>RESUME</span>
              </a>
            </div>

            {/* Direct Social Links */}
            <div className="hero-social-links">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mr-2">FIND ME:</span>
              {PORTFOLIO_DATA.profile.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="hero-social-icon"
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
      </div>
    </section>
  );
};

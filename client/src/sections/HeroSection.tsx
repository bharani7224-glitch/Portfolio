import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Download, Mail, ExternalLink, Terminal, Shield, Cpu, Database } from 'lucide-react';
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
          setCharIdx(p => p - 1);
        }, 35);
      } else {
        t = setTimeout(() => {
          setDeleting(false);
          setTitleIdx(p => (p + 1) % titles.length);
        }, 250);
      }
    } else {
      if (charIdx < cur.length) {
        t = setTimeout(() => {
          setTypedText(cur.slice(0, charIdx + 1));
          setCharIdx(p => p + 1);
        }, 75);
      } else {
        t = setTimeout(() => setDeleting(true), 2600);
      }
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, titleIdx, titles]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="swiss-hero-root">
      <div className="container swiss-hero-container">
        {/* Top Institutional Ledger Header */}
        <div className="swiss-hero-top-bar">
          <div className="mono-tag active">
            <span className="status-indicator" />
            <span>SYS // DEPLOYMENT VERIFIED: NAVANALA TECHNOLOGIES [10+ MOS]</span>
          </div>
          <div className="mono-tag">
            <span>SPEC: FULL-STACK ARCHITECTURE // C# .NET 9 // REACT</span>
          </div>
        </div>

        {/* Split Editorial Grid */}
        <div className="swiss-hero-grid">
          {/* Left Column: Architectural Dossier */}
          <div className="swiss-hero-left">
            <div className="swiss-mono-kicker">
              <span>[01 // PRINCIPAL ENGINEER]</span>
              <span className="text-muted">LOC // 11.3410° N, 77.7172° E</span>
            </div>

            <h1 className="swiss-hero-title">
              BHARANI
              <span className="swiss-hero-title-sub">DHARAN</span>
            </h1>

            {/* Readout Terminal Ticker */}
            <div className="swiss-terminal-readout">
              <span className="swiss-terminal-prompt">
                <Terminal size={14} /> CORE //
              </span>
              <span className="swiss-terminal-typing">{typedText}</span>
              <span className="swiss-terminal-cursor">_</span>
            </div>

            <p className="swiss-hero-bio">
              Architecting enterprise software solutions, scalable REST APIs, and reactive interfaces.
              Specialized in clean architecture paradigms, PostgreSQL schema design, and high-reliability
              full-stack systems.
            </p>

            {/* Swiss Engineering Metrics Grid */}
            <div className="swiss-metrics-grid">
              <div className="swiss-metric-box">
                <div className="metric-header">
                  <Shield size={14} className="text-emerald" />
                  <span className="metric-index">[01.1]</span>
                </div>
                <div className="metric-label">ARCHITECTURE</div>
                <div className="metric-val">Clean Arch / DDD / RBAC</div>
              </div>

              <div className="swiss-metric-box">
                <div className="metric-header">
                  <Database size={14} className="text-emerald" />
                  <span className="metric-index">[01.2]</span>
                </div>
                <div className="metric-label">DATA INFRASTRUCTURE</div>
                <div className="metric-val">PostgreSQL / EF Core / PL/SQL</div>
              </div>

              <div className="swiss-metric-box">
                <div className="metric-header">
                  <Cpu size={14} className="text-emerald" />
                  <span className="metric-index">[01.3]</span>
                </div>
                <div className="metric-label">SPECIALIZATION</div>
                <div className="metric-val">Enterprise ERP &amp; OCR Automation</div>
              </div>
            </div>

            {/* Precision CTA Actions */}
            <div className="swiss-hero-actions">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
                className="btn btn-primary"
              >
                <Mail size={15} />
                <span>INITIATE CONTACT</span>
                <ArrowUpRight size={14} />
              </a>

              <button className="btn btn-secondary" onClick={() => scrollTo('projects')}>
                <ExternalLink size={14} />
                <span>PROJECT INDEX [03]</span>
              </button>

              <a
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                <Download size={14} />
                <span>DOSSIER / CV</span>
              </a>
            </div>

            {/* Social Coordinates */}
            <div className="swiss-socials-row">
              <span className="mono-tag">CHANNELS:</span>
              {PORTFOLIO_DATA.profile.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="swiss-social-link"
                >
                  {s.platform === 'GitHub' && <Github size={14} />}
                  {s.platform === 'LinkedIn' && <Linkedin size={14} />}
                  {s.platform === 'Email' && <Mail size={14} />}
                  <span>{s.label.toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Swiss Telemetry HUD & Artifact Viewport */}
          <div className="swiss-hero-right">
            <div className="swiss-hud-box swiss-corner">
              <div className="swiss-hud-header">
                <span className="mono-tag active">
                  <span className="status-indicator" /> CALIBER SPECIFICATION
                </span>
                <span className="mono-tag">REF // CH-8001</span>
              </div>

              <div className="swiss-hud-body">
                <div className="swiss-hud-line">
                  <span className="hud-key">CORE ARTIFACT:</span>
                  <span className="hud-val">PRECISION TORUS-MONOLITH</span>
                </div>
                <div className="swiss-hud-line">
                  <span className="hud-key">MATERIAL PBR:</span>
                  <span className="hud-val">LIQUID CHROME &amp; OBSIDIAN</span>
                </div>
                <div className="swiss-hud-line">
                  <span className="hud-key">REFLECTIONS:</span>
                  <span className="hud-val">DARK STUDIO RIM STRIPS</span>
                </div>
                <div className="swiss-hud-line">
                  <span className="hud-key">STATUS CALIBER:</span>
                  <span className="hud-val active">LOCKED &amp; ROTATING [60 FPS]</span>
                </div>
              </div>

              {/* Core Skill Chips (Institutional Table) */}
              <div className="swiss-hud-chips">
                <div className="chip-cell">[01] C# .NET 9</div>
                <div className="chip-cell">[02] ASP.NET CORE</div>
                <div className="chip-cell">[03] REACT 19</div>
                <div className="chip-cell">[04] POSTGRESQL</div>
                <div className="chip-cell">[05] CLEAN ARCH</div>
                <div className="chip-cell">[06] OCR SYSTEMS</div>
              </div>

              <div className="swiss-hud-footer">
                <span className="mono-tag">DAMPED INERTIA: ACTIVE</span>
                <span className="mono-tag">INTERACTION: SCROLL / PARALLAX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

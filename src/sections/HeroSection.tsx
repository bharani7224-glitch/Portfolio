import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ExternalLink, Mail, MapPin, ChevronDown } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { 
  ReactIcon, NetCoreIcon, PostgresIcon, 
  ApiIcon, LinqIcon, EfCoreIcon, HtmlCssIcon, 
  CleanArchIcon, JwtIcon, GitIcon, OcrIcon
} from '../components/TechIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import './HeroSection.css';

interface NodeConfig {
  name: string;
  tier: number;
  proficiency: number;
  icon: React.ReactElement;
  bgClass: string;
  posClass: string;
}

const PYRAMID_NODES: NodeConfig[] = [
  // Tier 1 (Apex)
  { 
    name: 'ASP.NET Core', 
    tier: 1, 
    proficiency: 75, 
    icon: <NetCoreIcon size={22} className="tech-netcore" />, 
    bgClass: 'tech-netcore-bg', 
    posClass: 'p-1-1' 
  },
  { 
    name: 'C#', 
    tier: 1, 
    proficiency: 70, 
    icon: <LinqIcon size={22} className="tech-linq" />, 
    bgClass: 'tech-linq-bg', 
    posClass: 'p-1-2' 
  },

  // Tier 2
  { 
    name: 'REST APIs', 
    tier: 2, 
    proficiency: 75, 
    icon: <ApiIcon size={20} className="tech-api" />, 
    bgClass: 'tech-api-bg', 
    posClass: 'p-2-1' 
  },
  { 
    name: 'Entity Framework Core', 
    tier: 2, 
    proficiency: 65, 
    icon: <EfCoreIcon size={20} className="tech-efcore" />, 
    bgClass: 'tech-efcore-bg', 
    posClass: 'p-2-2' 
  },
  { 
    name: 'PostgreSQL', 
    tier: 2, 
    proficiency: 65, 
    icon: <PostgresIcon size={20} className="tech-postgres" />, 
    bgClass: 'tech-postgres-bg', 
    posClass: 'p-2-3' 
  },

  // Tier 3
  { 
    name: 'React', 
    tier: 3, 
    proficiency: 65, 
    icon: <ReactIcon size={20} className="tech-react" />, 
    bgClass: 'tech-react-bg', 
    posClass: 'p-3-1' 
  },
  { 
    name: 'HTML / CSS', 
    tier: 3, 
    proficiency: 65, 
    icon: <HtmlCssIcon size={20} className="tech-htmlcss" />, 
    bgClass: 'tech-htmlcss-bg', 
    posClass: 'p-3-2' 
  },
  { 
    name: 'Clean Architecture', 
    tier: 3, 
    proficiency: 60, 
    icon: <CleanArchIcon size={20} className="tech-cleanarch" />, 
    bgClass: 'tech-cleanarch-bg', 
    posClass: 'p-3-3' 
  },

  // Tier 4 (Base)
  { 
    name: 'JWT Authentication', 
    tier: 4, 
    proficiency: 60, 
    icon: <JwtIcon size={18} className="tech-jwt" />, 
    bgClass: 'tech-jwt-bg', 
    posClass: 'p-4-1' 
  },
  { 
    name: 'Git / GitHub', 
    tier: 4, 
    proficiency: 60, 
    icon: <GitIcon size={18} className="tech-git" />, 
    bgClass: 'tech-git-bg', 
    posClass: 'p-4-2' 
  },
  { 
    name: 'OCR', 
    tier: 4, 
    proficiency: 60, 
    icon: <OcrIcon size={18} className="tech-ocr" />, 
    bgClass: 'tech-ocr-bg', 
    posClass: 'p-4-3' 
  },
];

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
        }, 40);
      } else {
        t = setTimeout(() => {
          setDeleting(false);
          setTitleIdx(p => (p + 1) % titles.length);
        }, 300);
      }
    } else {
      if (charIdx < cur.length) {
        t = setTimeout(() => {
          setTypedText(cur.slice(0, charIdx + 1));
          setCharIdx(p => p + 1);
        }, 85);
      } else {
        t = setTimeout(() => setDeleting(true), 2400);
      }
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, titleIdx, titles]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="hs-root">
      <div className="hs-bg">
        <div className="hs-blob b1" />
        <div className="hs-blob b2" />
        <div className="hs-blob b3" />
        <div className="hs-grid" />
        <div className="hs-noise" />
      </div>

      <div className="container hs-wrap">
        <div className="hs-left">
          <div className="hs-pill">
            <span className="hs-pulse" />
            <span>{PORTFOLIO_DATA.profile.statusPill}</span>
          </div>

          <h1 className="hs-name">
            I'm <span className="hs-gradient-text">{PORTFOLIO_DATA.profile.name}</span>
            <span className="hs-underline-bar" />
          </h1>

          <div className="hs-tw">
            <span className="hs-tw-icon">{'</>'}</span>
            <span className="hs-tw-text">{typedText}</span>
            <span className="hs-tw-cursor">|</span>
          </div>

          <p className="hs-desc">
            I craft <strong>premium digital experiences</strong> — from pixel-perfect interfaces
            to robust back-end systems. Passionate about clean architecture and breathtaking UI.
          </p>

          <div className="hs-location">
            <MapPin size={14} />
            <span>{PORTFOLIO_DATA.profile.location}</span>
          </div>

          <div className="hs-ctas">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} className="hs-btn-hire">
              <span className="hs-btn-hire-shine" />
              <Mail size={16} />
              <span>Hire Me</span>
              <ArrowRight size={15} className="hs-arrow" />
            </a>

            <button className="hs-btn-work" onClick={() => scrollTo('projects')}>
              <ExternalLink size={15} />
              <span>View My Work</span>
            </button>

            <a href={PORTFOLIO_DATA.profile.resumeUrl} target="_blank" rel="noreferrer" className="hs-btn-resume">
              <Download size={14} />
              <span>Resume</span>
            </a>
          </div>

          <div className="hs-socials">
            <span className="hs-socials-label">Find me on</span>
            {PORTFOLIO_DATA.profile.socials.map((s) => (
              <a 
                key={s.platform} 
                href={s.url} 
                target={s.url.startsWith('http') ? '_blank' : undefined} 
                rel="noreferrer" 
                aria-label={s.label} 
                className="hs-social"
              >
                {s.platform === 'GitHub' && <Github size={17} />}
                {s.platform === 'LinkedIn' && <Linkedin size={17} />}
                {s.platform === 'Email' && <Mail size={17} />}
              </a>
            ))}
          </div>
        </div>

        <div className="hs-right">
          <div className="hs-pyramid-wrapper">
            <svg className="hs-pyramid-lines" viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Tier 1 internal */}
              <line x1="144" y1="43" x2="256" y2="43" className="hs-py-line" />

              {/* Tier 1 to Tier 2 */}
              <line x1="144" y1="43" x2="80" y2="137" className="hs-py-line" />
              <line x1="144" y1="43" x2="200" y2="137" className="hs-py-line" />
              <line x1="256" y1="43" x2="200" y2="137" className="hs-py-line" />
              <line x1="256" y1="43" x2="320" y2="137" className="hs-py-line" />

              {/* Tier 2 internal */}
              <line x1="80" y1="137" x2="200" y2="137" className="hs-py-line" />
              <line x1="200" y1="137" x2="320" y2="137" className="hs-py-line" />

              {/* Tier 2 to Tier 3 */}
              <line x1="80" y1="137" x2="64" y2="230" className="hs-py-line" />
              <line x1="80" y1="137" x2="200" y2="230" className="hs-py-line" />
              <line x1="200" y1="137" x2="64" y2="230" className="hs-py-line" />
              <line x1="200" y1="137" x2="200" y2="230" className="hs-py-line" />
              <line x1="200" y1="137" x2="336" y2="230" className="hs-py-line" />
              <line x1="320" y1="137" x2="200" y2="230" className="hs-py-line" />
              <line x1="320" y1="137" x2="336" y2="230" className="hs-py-line" />

              {/* Tier 3 internal */}
              <line x1="64" y1="230" x2="200" y2="230" className="hs-py-line" />
              <line x1="200" y1="230" x2="336" y2="230" className="hs-py-line" />

              {/* Tier 3 to Tier 4 */}
              <line x1="64" y1="230" x2="56" y2="320" className="hs-py-line" />
              <line x1="64" y1="230" x2="200" y2="320" className="hs-py-line" />
              <line x1="200" y1="230" x2="56" y2="320" className="hs-py-line" />
              <line x1="200" y1="230" x2="200" y2="320" className="hs-py-line" />
              <line x1="200" y1="230" x2="344" y2="320" className="hs-py-line" />
              <line x1="336" y1="230" x2="200" y2="320" className="hs-py-line" />
              <line x1="336" y1="230" x2="344" y2="320" className="hs-py-line" />

              {/* Tier 4 internal */}
              <line x1="56" y1="320" x2="200" y2="320" className="hs-py-line" />
              <line x1="200" y1="320" x2="344" y2="320" className="hs-py-line" />
            </svg>

            {PYRAMID_NODES.map((node, index) => (
              <div 
                key={node.name} 
                className={`hs-py-node ${node.posClass}`} 
                style={{ animationDelay: `${index * -0.35}s` }}
              >
                {/* Tooltip on hover */}
                <div className="hs-py-tooltip">
                  <div className="hs-py-tooltip-header">
                    <span className="hs-py-tooltip-name">{node.name}</span>
                    <span className="hs-py-tooltip-pct">{node.proficiency}%</span>
                  </div>
                  <div className="hs-py-tooltip-track">
                    <div 
                      className="hs-py-tooltip-fill" 
                      style={{ width: `${node.proficiency}%` }} 
                    />
                  </div>
                </div>

                <div className={`hs-py-coin ${node.bgClass}`}>
                  {node.icon}
                </div>
                <span className="hs-py-label">{node.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hs-scroll" onClick={() => scrollTo('education')}>
        <span>Scroll Down</span>
        <div className="hs-scroll-arrow-box">
          <ChevronDown size={16} className="hs-scroll-arrow" />
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowRight, Monitor, Cpu, Database, Award } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import './Home.css';


interface HomeProps {
  setCurrentPage: (page: string) => void;
}

const TITLES = [
  'Full Stack Web Developer',
  'React & Node.js Specialist',
  'UI/UX Enthusiast',
  'Innovative Problem Solver'
];

export const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  const [typedText, setTypedText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = TITLES;

  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenTitles = 2000;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentFullText = titles[titleIndex];

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setTypedText(currentFullText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }, 300);
      }
    } else {
      if (charIndex < currentFullText.length) {
        timer = setTimeout(() => {
          setTypedText(currentFullText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), delayBetweenTitles);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, titleIndex, titles]);

  const serviceCards = [
    {
      icon: <Monitor size={24} className="service-icon-primary" />,
      title: 'Frontend Engineering',
      desc: 'Building responsive, highly-interactive user interfaces using React, TypeScript, and modern state-management structures.'
    },
    {
      icon: <Database size={24} className="service-icon-secondary" />,
      title: 'Backend Systems',
      desc: 'Designing stable REST APIs, serverless handlers, database schemas (SQL/NoSQL) and securing backend communications.'
    },
    {
      icon: <Cpu size={24} className="service-icon-accent" />,
      title: 'Vite & Performance',
      desc: 'Optimizing application bundles for lightning fast speeds, utilizing code splitting, caching and static page builds.'
    }
  ];

  return (
    <div className="home-page page-enter container">
      {/* Hero Section */}
      <section className="hero-section">
        <ScrollReveal animation="fade-up" delay={100} className="hero-content">
          <div className="badge-wrapper">
            <span className="hero-badge"><Award size={14} /> Available for projects</span>
          </div>
          <h1 className="hero-title">
            Hey, I'm <span className="name-glow">Bharani</span>
          </h1>
          <div className="typewriter-container">
            <span className="typewriter-text">{typedText}</span>
            <span className="cursor">|</span>
          </div>
          <p className="hero-description">
            I design and build premium web applications with elegant interfaces and clean code architecture. Dedicated to creating responsive digital solutions that solve real-world problems.
          </p>
          <div className="hero-actions">
            <button onClick={() => setCurrentPage('projects')} className="btn btn-primary">
              Explore Projects <ArrowRight size={16} />
            </button>
            <button onClick={() => setCurrentPage('about-contact')} className="btn btn-secondary">
              Let's Connect
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-left" delay={300} className="hero-visual">
          <div className="visual-circle-glow"></div>
          <div className="code-box glass-card">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="code-filename">portfolio.ts</span>
            </div>
            <pre className="code-content">
              <code>
{`const developer = {
  name: 'Bharani',
  role: 'Full Stack Engineer',
  skills: ['React', 'Node', 'Vite', 'CSS3','ASP.Net Core'],
  passion: 'Stunning Glassmorphism UI',
  status: 'Ready to build something epic'
};

// Let's create something together!
console.log(\`Running \${developer.name}'s project...\`);`}
              </code>
            </pre>
          </div>
        </ScrollReveal>
      </section>

      {/* Services / What I Do Section */}
      <section className="services-section">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <h2>What I <span>Deliver</span></h2>
            <p>End-to-end expertise focused on clean layout, modern aesthetics, and performance optimization.</p>
          </div>
        </ScrollReveal>

        <div className="services-grid">
          {serviceCards.map((card, idx) => (
            <ScrollReveal 
              key={idx} 
              animation="fade-up" 
              delay={idx * 150}
              className="service-card-reveal-wrapper"
            >
              <div className="service-card glass-card">
                <div className="service-icon-wrapper">
                  {card.icon}
                </div>
                <h3 className="service-title">{card.title}</h3>
                <p className="service-desc">{card.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

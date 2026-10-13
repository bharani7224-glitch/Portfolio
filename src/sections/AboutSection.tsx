import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Monitor, Database, Cpu } from 'lucide-react';
import bharaniImg from '../assets/bharani.jpg';
import { ScrollReveal } from '../components/ScrollReveal';
import { PORTFOLIO_DATA } from '../portfolioData';
import './AboutSection.css';

const serviceIcons = [
  <Monitor key="net" size={22} />,
  <Database key="db" size={22} />,
  <Cpu key="fe" size={22} />
];

export const AboutSection: React.FC = () => {
  const [animated, setAnimated] = useState(false);
  const profile = PORTFOLIO_DATA.profile;
  const skills = PORTFOLIO_DATA.skillsPyramid;
  const services = PORTFOLIO_DATA.services;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="container">
        <ScrollReveal animation="fade-up" triggerOnce>
          <div className="section-header">
            <h2>About <span>Me</span></h2>
            <div className="section-divider" />
            <p>Get to know my background, skills, and what I bring to every project.</p>
          </div>
        </ScrollReveal>

        {/* Intro row */}
        <div className="about-intro">
          <ScrollReveal animation="fade-right" triggerOnce className="about-img-wrapper">
            <div className="about-img-frame">
              <div className="about-img-glow" />
              <img src={bharaniImg} alt="Bharani" className="about-img" />
              <div className="about-chip">
                <span className="chip-dot-green" />
                Open to Work
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={150} triggerOnce>
            <div className="about-bio">
              {/* <h3 className="about-bio-title">About <span>{profile.name}</span></h3> */}
              <p className="about-bio-text">{profile.bioAbout1}</p>
              <p className="about-bio-text">{profile.bioAbout2}</p>

              <div className="about-info">
                <div className="about-info-item">
                  <MapPin size={16} className="info-icon" />
                  <span>{profile.location}</span>
                </div>
                <div className="about-info-item">
                  <Mail size={16} className="info-icon" />
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </div>
                <div className="about-info-item">
                  <Phone size={16} className="info-icon" />
                  <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Skills */}
        <div className="about-skills-block">
          <ScrollReveal animation="fade-up" triggerOnce>
            <h3 className="about-sub-title">Core <span>Skills</span></h3>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100} triggerOnce>
            <div className="skills-card">
              {skills.map((skill, i) => (
                <div key={i} className="skill-row">
                  <div className="skill-row-header">
                    <span className="skill-row-name">{skill.name}</span>
                    <span className="skill-row-pct">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-track">
                    <div
                      className="skill-fill"
                      style={{
                        width: animated ? `${skill.proficiency}%` : '0%',
                        background: 'var(--accent-gradient)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Services */}
        <div className="about-services">
          <ScrollReveal animation="fade-up" triggerOnce>
            <h3 className="about-sub-title">What I <span>Deliver</span></h3>
          </ScrollReveal>
          <div className="services-grid">
            {services.map((svc, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 120} triggerOnce>
                <div className="svc-card">
                  <div className="svc-icon">
                    {serviceIcons[i % serviceIcons.length]}
                  </div>
                  <h4 className="svc-title">{svc.title}</h4>
                  <p className="svc-desc">{svc.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

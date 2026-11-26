import React from 'react';
import { MapPin, Mail, Phone, Server, Database, Layers, Check } from 'lucide-react';
import bharaniImg from '../assets/bharani.jpg';
import { PORTFOLIO_DATA } from '../portfolioData';
import './AboutSection.css';

const DELIVERABLE_ICONS = [
  <Server key="srv" size={18} className="text-emerald" />,
  <Database key="db" size={18} className="text-emerald" />,
  <Layers key="fe" size={18} className="text-emerald" />,
];

export const AboutSection: React.FC = () => {
  const profile = PORTFOLIO_DATA.profile;
  const skills = PORTFOLIO_DATA.skillsPyramid;
  const services = PORTFOLIO_DATA.services;

  return (
    <section id="about" className="swiss-about-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="mono-tag active mb-2">
              <span className="status-indicator" />
              <span>DOSSIER // SPECIFICATION</span>
            </div>
            <h2>
              ENGINEERING <span>DOSSIER</span>
            </h2>
          </div>
          <p>
            Comprehensive technical profile, architectural competencies, and core deliverables.
          </p>
        </div>

        {/* Editorial Split Grid */}
        <div className="swiss-about-grid">
          {/* Left Column: Portrait & Telemetry Frame */}
          <div className="swiss-portrait-card swiss-corner">
            <div className="portrait-inner-frame">
              <img src={bharaniImg} alt={profile.name} className="portrait-image" />
              <div className="portrait-status-banner">
                <span className="status-indicator" />
                <span>ACTIVE // 10+ MONTHS EXP</span>
              </div>
            </div>

            <div className="portrait-meta-stack">
              <div className="meta-line">
                <span className="meta-k">ENGINEER:</span>
                <span className="meta-v">{profile.name.toUpperCase()}</span>
              </div>
              <div className="meta-line">
                <span className="meta-k">LOCATION:</span>
                <span className="meta-v">{profile.location.toUpperCase()}</span>
              </div>
              <div className="meta-line">
                <span className="meta-k">COORDINATES:</span>
                <span className="meta-v">11.3410° N, 77.7172° E</span>
              </div>
              <div className="meta-line">
                <span className="meta-k">COMMUNICATION:</span>
                <span className="meta-v text-emerald">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Deliverables */}
          <div className="swiss-about-content">
            <div className="content-block">
              <span className="mono-tag">[01 // BIOGRAPHY STATEMENT]</span>
              <p className="bio-lead">{profile.bioAbout1}</p>
              <p className="bio-sub">{profile.bioAbout2}</p>
            </div>

            {/* Direct Contact Coordinates Bar */}
            <div className="swiss-coords-bar">
              <div className="coord-item">
                <MapPin size={13} className="text-emerald" />
                <span>{profile.location}</span>
              </div>
              <div className="coord-item">
                <Mail size={13} className="text-emerald" />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
              <div className="coord-item">
                <Phone size={13} className="text-emerald" />
                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
              </div>
            </div>

            {/* Core Competencies Matrix */}
            <div className="content-block">
              <div className="skills-header-bar">
                <span className="mono-tag">[02 // CORE TECHNICAL CALIBER]</span>
                <span className="mono-tag text-muted">AUDITED PROFICIENCY</span>
              </div>
              <div className="swiss-skills-ledger">
                {skills.slice(0, 10).map((skill, i) => (
                  <div key={i} className="skill-ledger-row">
                    <div className="skill-label-side">
                      <span className="skill-idx">[{String(i + 1).padStart(2, '0')}]</span>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <div className="skill-metric-side">
                      <div className="skill-track-bar">
                        <div className="skill-fill-bar" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <span className="skill-pct-val">{skill.proficiency}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Deliverables */}
            <div className="content-block">
              <span className="mono-tag">[03 // INSTITUTIONAL DELIVERABLES]</span>
              <div className="swiss-services-grid">
                {services.map((svc, i) => (
                  <div key={i} className="swiss-service-module swiss-corner">
                    <div className="service-header">
                      {DELIVERABLE_ICONS[i % DELIVERABLE_ICONS.length]}
                      <span className="service-idx">[03.{i + 1}]</span>
                    </div>
                    <h4 className="service-title">{svc.title}</h4>
                    <p className="service-desc">{svc.description}</p>
                    <div className="service-footer">
                      <Check size={12} className="text-emerald" />
                      <span>PRODUCTION GRADE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

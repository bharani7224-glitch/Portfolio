import React from 'react';
import { MapPin, Mail, Phone, Server, Database, Code, CheckCircle2 } from 'lucide-react';
import bharaniImg from '../assets/bharani.jpg';
import { PORTFOLIO_DATA } from '../portfolioData';
import './AboutSection.css';

const DELIVERABLE_ICONS = [
  <Server key="srv" size={20} className="text-[#CCFF00]" />,
  <Database key="db" size={20} className="text-[#CCFF00]" />,
  <Code key="fe" size={20} className="text-[#CCFF00]" />,
];

export const AboutSection: React.FC = () => {
  const profile = PORTFOLIO_DATA.profile;
  const skills = PORTFOLIO_DATA.skillsPyramid;
  const services = PORTFOLIO_DATA.services;

  return (
    <section id="about" className="panda-about-section section-cream">
      <div className="container">
        {/* Editorial Header */}
        <div className="editorial-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(17,17,17,0.12)] pb-8">
          <div>
            <span className="kicker text-[#FF4D29]">THE DEVELOPER PROFILE</span>
            <h2 className="text-[#111111]">
              ABOUT <span className="text-[#FF4D29]">BHARANI.</span>
            </h2>
          </div>
          <p className="text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Full-stack engineer dedicated to clean architecture, reliable microservices, and pixel-precise, responsive interfaces.
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="panda-about-grid">
          {/* Left Column: Portrait Card */}
          <div className="panda-portrait-wrap">
            <div className="portrait-card-frame" data-cursor="BHARANI">
              <img src={bharaniImg} alt={profile.name} className="portrait-img" />
              <div className="portrait-badge-overlay">
                <span className="sticker-pill vermilion">
                  <span className="pulsing-dot" />
                  <span>SOFTWARE DEVELOPER</span>
                </span>
              </div>
            </div>

            {/* Direct Contact Pills */}
            <div className="portrait-details-box">
              <div className="detail-row">
                <MapPin size={15} className="text-[#FF4D29]" />
                <span className="font-semibold text-zinc-800">{profile.location}</span>
              </div>
              <div className="detail-row">
                <Mail size={15} className="text-[#FF4D29]" />
                <a href={`mailto:${profile.email}`} className="hover:text-[#FF4D29] transition-colors">
                  {profile.email}
                </a>
              </div>
              <div className="detail-row">
                <Phone size={15} className="text-[#FF4D29]" />
                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="hover:text-[#FF4D29] transition-colors">
                  {profile.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Core Competencies */}
          <div className="panda-about-content">
            <div className="editorial-lead-block">
              <h3 className="editorial-lead-statement">
                "TURNING COMPLEX BUSINESS LOGIC INTO ELEGANT, RESILIENT DIGITAL ARCHITECTURES."
              </h3>
              <p className="editorial-body-para">{profile.bioAbout1}</p>
              <p className="editorial-body-para">{profile.bioAbout2}</p>
            </div>

            {/* Core Competencies Stickers */}
            <div className="skills-editorial-block">
              <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.12)] pb-4 mb-6">
                <span className="sticker-pill vermilion">CORE COMPETENCIES</span>
                <span className="font-mono text-xs text-[#6E6E73] uppercase tracking-wider">
                  AUDITED PROFICIENCIES
                </span>
              </div>

              <div className="skills-stickers-cloud">
                {skills.map((skill, i) => (
                  <div key={i} className="skill-badge-item" data-cursor={`${skill.proficiency}%`}>
                    <span className="skill-title">{skill.name}</span>
                    <span className="skill-meter-pill">{skill.proficiency}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables / Services */}
            <div className="services-editorial-block">
              <div className="flex items-center justify-between border-b border-[rgba(17,17,17,0.12)] pb-4 mb-6">
                <span className="sticker-pill cream">SYSTEM DELIVERABLES</span>
                <span className="font-mono text-xs text-[#6E6E73] uppercase tracking-wider">
                  WHAT I BUILD
                </span>
              </div>

              <div className="services-cards-grid">
                {services.map((svc, i) => (
                  <div key={i} className="panda-service-card" data-cursor="CAPABILITY">
                    <div className="service-card-icon">
                      {DELIVERABLE_ICONS[i % DELIVERABLE_ICONS.length]}
                    </div>
                    <h4 className="service-card-title">{svc.title}</h4>
                    <p className="service-card-desc">{svc.description}</p>
                    <div className="service-card-tag">
                      <CheckCircle2 size={13} className="text-[#CCFF00]" />
                      <span>PRODUCTION READY</span>
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

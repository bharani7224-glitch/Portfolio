import React from 'react';
import { Calendar, MapPin, Building2, Award } from 'lucide-react';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { TimelineEntry } from '../portfolioData';
import './EducationSection.css';

const TimelineCard: React.FC<{ item: TimelineEntry; isEducation?: boolean }> = ({
  item,
  isEducation = false,
}) => {
  return (
    <div className="panda-timeline-card" data-cursor={isEducation ? 'DEGREE' : 'EXPERIENCE'}>
      <div className="timeline-card-header">
        <span className="sticker-pill cream">
          <Calendar size={12} className="text-[#FF4D29]" />
          <span>{item.period}</span>
        </span>
        {item.grade && (
          <span className="sticker-pill vermilion">
            <Award size={12} />
            <span>{item.grade}</span>
          </span>
        )}
      </div>

      <h3 className="timeline-card-title">{item.title}</h3>

      <div className="timeline-card-company">
        <Building2 size={15} className="text-[#FF4D29]" />
        <span>{item.institution}</span>
        <span className="text-zinc-400">•</span>
        <MapPin size={14} className="text-zinc-500" />
        <span>{item.location}</span>
      </div>

      <p className="timeline-card-desc">{item.description}</p>
    </div>
  );
};

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="panda-edu-section section-cream">
      <div className="container">
        {/* Editorial Header */}
        <div className="editorial-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(17,17,17,0.12)] pb-8">
          <div>
            <span className="kicker text-[#FF4D29]">CHRONOLOGY &amp; TRAJECTORY</span>
            <h2 className="text-[#111111]">
              EXPERIENCE &amp; <span className="text-[#FF4D29]">ACADEMICS.</span>
            </h2>
          </div>
          <p className="text-[#6E6E73] font-['Plus_Jakarta_Sans']">
            Proven deployment record in dynamic software teams alongside rigorous academic foundation in computer applications.
          </p>
        </div>

        {/* 2-Column High-Contrast Editorial Grid */}
        <div className="panda-edu-grid">
          {/* Column 1: Professional Experience */}
          <div className="panda-edu-col">
            <div className="col-header-pill-row">
              <span className="sticker-pill vermilion">INDUSTRIAL DEPLOYMENT</span>
              <span className="font-mono text-xs text-[#6E6E73] uppercase tracking-wider">
                10+ MONTHS EXP
              </span>
            </div>
            <div className="cards-stack">
              {PORTFOLIO_DATA.experience.map((item, i) => (
                <TimelineCard key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Column 2: Academic Background */}
          <div className="panda-edu-col">
            <div className="col-header-pill-row">
              <span className="sticker-pill cream">ACADEMIC FOUNDATION</span>
              <span className="font-mono text-xs text-[#6E6E73] uppercase tracking-wider">
                BCA GRADUATION
              </span>
            </div>
            <div className="cards-stack">
              {PORTFOLIO_DATA.education.map((item, i) => (
                <TimelineCard key={i} item={item} isEducation />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Calendar, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { TimelineEntry } from '../portfolioData';
import './EducationSection.css';

const TimelineRow: React.FC<{ item: TimelineEntry; index: string }> = ({ item, index }) => {
  return (
    <div className="swiss-timeline-entry swiss-corner">
      <div className="entry-header">
        <div className="entry-meta">
          <span className="mono-tag active">
            <span className="status-indicator" /> {index}
          </span>
          <span className="entry-period">
            <Calendar size={12} /> {item.period}
          </span>
        </div>
        {item.grade && (
          <span className="entry-grade-badge">
            <CheckCircle2 size={12} /> {item.grade}
          </span>
        )}
      </div>

      <h4 className="entry-title">{item.title}</h4>

      <div className="entry-institution">
        <Building2 size={13} />
        <span>{item.institution}</span>
        <span className="text-muted">//</span>
        <MapPin size={12} />
        <span>{item.location}</span>
      </div>

      <p className="entry-desc">{item.description}</p>
    </div>
  );
};

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="swiss-edu-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="mono-tag active mb-2">
              <span className="status-indicator" />
              <span>DOSSIER // CHRONOLOGY</span>
            </div>
            <h2>
              RECORD &amp; <span>DEPLOYMENT</span>
            </h2>
          </div>
          <p>
            Academic background and institutional software engineering deployments across full-stack production environments.
          </p>
        </div>

        {/* 2-Column Swiss Grid */}
        <div className="swiss-edu-grid">
          {/* Column 1: Academic Foundation */}
          <div className="swiss-edu-col">
            <div className="col-label-bar">
              <span className="mono-tag">[01 // ACADEMIC RECORD]</span>
              <span className="mono-tag text-muted">VERIFIED DEGREES</span>
            </div>
            <div className="timeline-stack">
              {PORTFOLIO_DATA.education.map((item, i) => (
                <TimelineRow key={i} item={item} index={`ACAD // 0${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Column 2: Industrial Deployment */}
          <div className="swiss-edu-col">
            <div className="col-label-bar">
              <span className="mono-tag active">[02 // INDUSTRIAL DEPLOYMENT]</span>
              <span className="mono-tag text-muted">PRODUCTION EXPERIENCE</span>
            </div>
            <div className="timeline-stack">
              {PORTFOLIO_DATA.experience.map((item, i) => (
                <TimelineRow key={i} item={item} index={`PROD // 0${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

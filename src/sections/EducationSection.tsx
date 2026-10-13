import React from 'react';
import { GraduationCap, Briefcase, Calendar, MapPin } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { TimelineEntry } from '../portfolioData';
import './EducationSection.css';

interface TimelineCardProps {
  item: TimelineEntry;
  delay?: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, delay = 0 }) => {
  const isEdu = item.type === 'education';

  return (
    <ScrollReveal animation="fade-up" delay={delay} triggerOnce>
      <div className={`edu-card ${isEdu ? 'study-card' : 'work-card'}`}>
        <div className="edu-card-icon">
          {isEdu ? <GraduationCap size={20} /> : <Briefcase size={20} />}
        </div>
        <div className="edu-card-body">
          <div className="edu-card-meta">
            <span className="edu-period">
              <Calendar size={12} /> {item.period}
            </span>
            <span className="edu-location">
              <MapPin size={12} /> {item.location}
            </span>
          </div>
          <h4 className="edu-title">{item.title}</h4>
          <span className="edu-institution">{item.institution}</span>
          <p className="edu-desc">{item.description}</p>
          {item.grade && (
            <span className="edu-grade">{item.grade}</span>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="education-section">
      <div className="container">
        <ScrollReveal animation="fade-up" triggerOnce>
          <div className="section-header">
            <h2>Education & <span>Experience</span></h2>
            <div className="section-divider" />
            <p>My academic foundation and professional journey that shaped my skills.</p>
          </div>
        </ScrollReveal>

        <div className="edu-grid">
          {/* Education Column */}
          <div className="edu-column">
            <ScrollReveal animation="fade-right" triggerOnce>
              <div className="edu-column-label">
                <GraduationCap size={16} />
                Education
              </div>
            </ScrollReveal>
            <div className="edu-timeline">
              {PORTFOLIO_DATA.education.map((item, i) => (
                <TimelineCard key={i} item={item} delay={i * 150} />
              ))}
            </div>
          </div>

          {/* Experience Column */}
          <div className="edu-column">
            <ScrollReveal animation="fade-left" triggerOnce>
              <div className="edu-column-label work">
                <Briefcase size={16} />
                Experience
              </div>
            </ScrollReveal>
            <div className="edu-timeline">
              {PORTFOLIO_DATA.experience.map((item, i) => (
                <TimelineCard key={i} item={item} delay={i * 150} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

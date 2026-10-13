import React, { useState } from 'react';
import { ExternalLink, X, Sparkles, Filter, Layers, Server } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { ScrollReveal } from '../components/ScrollReveal';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { ProjectEntry } from '../portfolioData';
import './ProjectsSection.css';

const FILTERS = [
  { key: 'all', label: 'All Work', icon: <Sparkles size={13} /> },
  { key: 'frontend', label: 'Frontend', icon: <Layers size={13} /> },
  { key: 'fullstack', label: 'Full Stack', icon: <Server size={13} /> },
  { key: 'systems', label: 'Systems', icon: <Filter size={13} /> },
] as const;

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'frontend' | 'fullstack' | 'systems'>('all');
  const [selected, setSelected] = useState<ProjectEntry | null>(null);

  const projects = PORTFOLIO_DATA.projects;
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <ScrollReveal animation="fade-up" triggerOnce>
          <div className="section-header">
            <h2>Featured <span>Projects</span></h2>
            <div className="section-divider" />
            <p>A curated selection of applications I've designed and engineered — focused on performance, aesthetics, and clean code.</p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal animation="fade-up" delay={100} triggerOnce className="proj-filter-reveal">
          <div className="proj-filter-row">
            <div className="proj-filter-tabs">
              {FILTERS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`proj-filter-btn ${filter === key ? 'active' : ''}`}
                  onClick={(e) => {
                    setFilter(key as typeof filter);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="proj-grid">
          {filtered.map((project, idx) => (
            <ScrollReveal key={project.id} animation="fade-up" delay={idx * 120} triggerOnce>
              <div
                className={`proj-card ${project.hasShine ? 'proj-card-shine' : ''}`}
                onClick={() => setSelected(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(project);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${project.title}`}
              >
                <div className="proj-card-accent" />

                <div className="proj-badge">
                  <Sparkles size={11} /> {project.highlights}
                </div>

                <h3 className="proj-title">{project.title}</h3>
                <p className="proj-desc">{project.shortDesc}</p>

                <div className="proj-tags">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="proj-tag">{tag}</span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="proj-tag-more">+{project.tags.length - 3}</span>
                  )}
                </div>

                <div className="proj-footer">
                  <span className="proj-read-more">View Details →</span>
                  <span className="proj-category-badge">{project.category}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {filtered.length === 0 && (
            <div className="proj-empty">
              No projects in this category yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="proj-modal-overlay" onClick={() => setSelected(null)}>
          <div className="proj-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="proj-modal-accent" />
            <button className="proj-modal-close" onClick={() => setSelected(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="proj-modal-header">
              <span className="proj-modal-badge">{(selected.categoryLabel || selected.category).toUpperCase()}</span>
              <h3>{selected.title}</h3>
            </div>

            <div className="proj-modal-body">
              <p className="proj-modal-desc">{selected.longDesc}</p>

              <div className="proj-modal-section">
                <h4>Key Features</h4>
                <ul>
                  {selected.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="proj-modal-section">
                <h4>Technologies Used</h4>
                <div className="proj-tags">
                  {selected.tags.map((tag, i) => (
                    <span key={i} className="proj-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {(selected.demoUrl || selected.githubUrl) && (
                <div className="proj-modal-actions">
                  {selected.demoUrl && (
                    <a href={selected.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {selected.githubUrl && (
                    <a href={selected.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                      <Github size={16} /> Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

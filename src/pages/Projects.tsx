import React, { useState } from 'react';
import { ExternalLink, Filter, X, Sparkles, Server, Layers } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { ScrollReveal } from '../components/ScrollReveal';
import './Projects.css';


import { PORTFOLIO_DATA } from '../portfolioData';
import type { ProjectEntry } from '../portfolioData';

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'frontend' | 'fullstack' | 'systems'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);

  const projectsData = PORTFOLIO_DATA.projects;

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <div className="projects-page page-enter container">
      <ScrollReveal animation="fade-up">
        <div className="section-header">
          <h2>My Featured <span>Projects</span></h2>
          <p>A selection of recent applications I have designed and engineered, focusing on modular structures, visual fidelity, and clean code.</p>
        </div>
      </ScrollReveal>

      {/* Filter Tabs */}
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="filter-wrapper">
          <div className="filter-tabs glass-card">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Work
            </button>
            <button 
              className={`filter-btn ${filter === 'frontend' ? 'active' : ''}`}
              onClick={() => setFilter('frontend')}
            >
              <Layers size={14} /> Frontend
            </button>
            <button 
              className={`filter-btn ${filter === 'fullstack' ? 'active' : ''}`}
              onClick={() => setFilter('fullstack')}
            >
              <Server size={14} /> Full Stack
            </button>
            <button 
              className={`filter-btn ${filter === 'systems' ? 'active' : ''}`}
              onClick={() => setFilter('systems')}
            >
              <Filter size={14} /> Systems
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project, idx) => (
          <ScrollReveal 
            key={project.id} 
            animation="fade-up" 
            delay={idx * 150}
            className="project-reveal-wrapper"
          >
            <div 
              className="project-card glass-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-badge">
                <Sparkles size={12} /> {project.highlights}
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-short-desc">{project.shortDesc}</p>
              
              <div className="project-tags">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="project-tag">{tag}</span>
                ))}
                {project.tags.length > 3 && (
                  <span className="project-tag-more">+{project.tags.length - 3}</span>
                )}
              </div>

              <div className="project-footer">
                <span className="read-more">View Details &rarr;</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Modal Detail View */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <span className="modal-badge">{(selectedProject.categoryLabel || selectedProject.category).toUpperCase()}</span>
              <h3>{selectedProject.title}</h3>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedProject.longDesc}</p>
              
              <div className="modal-features">
                <h4>Key Features</h4>
                <ul>
                  {selectedProject.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-tech-stack">
                <h4>Technologies Used</h4>
                <div className="modal-tags">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="modal-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {(selectedProject.demoUrl || selectedProject.githubUrl) && (
              <div className="modal-actions">
                {selectedProject.demoUrl && (
                  <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Live Demo <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    GitHub Repo <Github size={14} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

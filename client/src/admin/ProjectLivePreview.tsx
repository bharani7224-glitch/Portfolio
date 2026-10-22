import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import type { ProjectFormData } from '../services/api';
import '../sections/ProjectsSection.css';

interface ProjectLivePreviewProps {
  project: ProjectFormData;
}

export const ProjectLivePreview: React.FC<ProjectLivePreviewProps> = ({ project }) => {
  const displayTitle = project.title || 'Untitled Project';
  const displayDesc = project.shortDescription || 'Enter a short description to see it previewed here...';
  const displayTags = project.technologies.length > 0 ? project.technologies : ['Technology', 'Stack'];
  const displayCategory = project.category || 'fullstack';
  const isFeatured = project.featured;

  return (
    <div className="proj-preview-container" style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <div
        className={`proj-card ${isFeatured ? 'proj-card-shine' : ''}`}
        style={{
          cursor: 'default',
          transform: 'none',
          boxShadow: isFeatured
            ? '0 10px 30px -10px rgba(99, 102, 241, 0.4)'
            : '0 8px 24px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div className="proj-card-accent" />

        {project.thumbnailUrl && (
          <div style={{
            width: '100%',
            height: '140px',
            marginBottom: '16px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.05)',
            position: 'relative'
          }}>
            <img
              src={project.thumbnailUrl}
              alt={displayTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="proj-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={11} />
          {isFeatured ? 'Featured Project' : (displayCategory.toUpperCase())}
        </div>

        <h3 className="proj-title" style={{ fontSize: '1.25rem', marginTop: '12px' }}>
          {displayTitle}
        </h3>

        <p className="proj-desc" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
          {displayDesc}
        </p>

        <div className="proj-tags" style={{ margin: '16px 0' }}>
          {displayTags.slice(0, 4).map((tag, i) => (
            <span key={i} className="proj-tag">
              {tag}
            </span>
          ))}
          {displayTags.length > 4 && (
            <span className="proj-tag-more">+{displayTags.length - 4}</span>
          )}
        </div>

        <div className="proj-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--accent, #6366f1)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={13} /> Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <Github size={13} /> Code
              </a>
            )}
          </div>
          <span className="proj-category-badge">{displayCategory}</span>
        </div>
      </div>
    </div>
  );
};

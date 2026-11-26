import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ExternalLink, X, Loader2 } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { ProjectEntry } from '../portfolioData';
import { publicApi } from '../services/api';
import type { ProjectDto } from '../services/api';
import './ProjectsSection.css';

const FILTERS = [
  { key: 'all', label: 'ALL WORKS' },
  { key: 'fullstack', label: 'FULL STACK' },
  { key: 'systems', label: 'ERP & OCR' },
  { key: 'frontend', label: 'CLIENT UI' },
] as const;

function mapDtoToProjectEntry(dto: ProjectDto): ProjectEntry {
  return {
    id: dto.id,
    title: dto.title,
    shortDesc: dto.shortDescription,
    longDesc: dto.description,
    category: (dto.category === 'frontend' || dto.category === 'systems' ? dto.category : 'fullstack') as 'frontend' | 'fullstack' | 'systems',
    categoryLabel: dto.category ? dto.category.toUpperCase() : 'Full Stack',
    tags: dto.technologies || [],
    features: [
      dto.shortDescription,
      dto.technologies.length > 0 ? `Core Technologies: ${dto.technologies.join(', ')}` : '',
    ].filter(Boolean),
    demoUrl: dto.liveDemoUrl || undefined,
    githubUrl: dto.githubUrl || undefined,
    highlights: dto.featured ? 'FEATURED CASE STUDY' : (dto.category || 'SYSTEM').toUpperCase(),
    hasShine: dto.featured,
  };
}

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'frontend' | 'fullstack' | 'systems'>('all');
  const [selected, setSelected] = useState<ProjectEntry | null>(null);

  // API State
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    publicApi
      .getProjects()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.data && res.data.length > 0) {
          setProjects(res.data.map(mapDtoToProjectEntry));
        } else {
          setProjects(PORTFOLIO_DATA.projects);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects(PORTFOLIO_DATA.projects);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="panda-projects-section section-dark">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="editorial-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(255,255,255,0.12)] pb-8">
          <div>
            <span className="kicker text-[#CCFF00]">SELECTED ARCHITECTURES</span>
            <h2 className="text-white">
              ENGINEERED <span className="text-[#CCFF00]">SOLUTIONS.</span>
            </h2>
          </div>

          <p className="text-zinc-400 font-['Plus_Jakarta_Sans']">
            Production-grade ERP platforms, high-throughput OCR pipelines, and modern reactive full-stack web applications.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-8 pb-12">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`panda-filter-btn ${filter === f.key ? 'active' : ''}`}
              data-cursor="FILTER"
            >
              <span>{f.label}</span>
              <span className="filter-count">
                {f.key === 'all'
                  ? projects.length
                  : projects.filter((p) => p.category === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-[#CCFF00]" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">FETCHING SYSTEM RECORDS...</span>
          </div>
        )}

        {/* Asymmetric 2-Column Staggered Case-Study Grid */}
        {!isLoading && (
          <div className="panda-projects-grid">
            {filtered.map((project, idx) => {
              const isStaggered = idx % 2 === 1;
              return (
                <div
                  key={project.id}
                  className={`panda-project-card ${isStaggered ? 'md:mt-16' : ''}`}
                  onClick={() => setSelected(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View case study for ${project.title}`}
                  data-cursor="VIEW PROJECT"
                >
                  {/* Card Visual Header / Banner */}
                  <div className="card-visual-header">
                    <div className="flex items-center justify-between w-full">
                      <span className="sticker-pill lime">
                        {project.categoryLabel || project.category.toUpperCase()}
                      </span>
                      <span className="card-index-num font-mono text-xs text-zinc-400">
                        CASE // 0{idx + 1}
                      </span>
                    </div>

                    <div className="card-arrow-pill">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="card-content-body">
                    <span className="card-highlight-tag text-xs font-mono text-[#CCFF00] tracking-wider uppercase">
                      {project.highlights || 'FEATURED WORK'}
                    </span>
                    <h3 className="card-project-title">{project.title}</h3>
                    <p className="card-project-desc">{project.shortDesc}</p>

                    {/* Technology Stickers */}
                    <div className="card-tags-row">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="sticker-pill dark">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-24 text-zinc-500 font-mono text-sm uppercase">
                NO CASE STUDIES MATCHING FILTER CRITERIA.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Case Study Details Modal */}
      {selected && (
        <div className="panda-modal-overlay" onClick={() => setSelected(null)}>
          <div className="panda-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="flex items-center gap-3">
                <span className="sticker-pill lime">
                  {selected.categoryLabel || selected.category.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  AUDITED SPECIFICATION
                </span>
              </div>
              <button
                className="modal-close-pill"
                onClick={() => setSelected(null)}
                aria-label="Close modal"
                data-cursor="CLOSE"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              <h3 className="modal-case-title">{selected.title}</h3>
              <p className="modal-case-lead">{selected.longDesc}</p>

              {/* Key Highlights */}
              <div className="modal-spec-block">
                <h4 className="font-mono text-xs text-[#CCFF00] tracking-wider uppercase mb-3">
                  SYSTEM HIGHLIGHTS &amp; CAPABILITIES
                </h4>
                <ul className="modal-features-list">
                  {selected.features.map((f, i) => (
                    <li key={i}>
                      <span className="text-[#CCFF00] font-mono mr-2">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="modal-spec-block">
                <h4 className="font-mono text-xs text-zinc-400 tracking-wider uppercase mb-3">
                  DEPLOYED TECHNOLOGIES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((t, i) => (
                    <span key={i} className="sticker-pill dark">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {(selected.demoUrl || selected.githubUrl) && (
                <div className="modal-actions-row">
                  {selected.demoUrl && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="panda-btn panda-btn-primary"
                      data-cursor="LIVE"
                    >
                      <ExternalLink size={16} />
                      <span>LIVE DEMO</span>
                    </a>
                  )}
                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="panda-btn panda-btn-outline"
                      data-cursor="CODE"
                    >
                      <Github size={16} />
                      <span>SOURCE REPO</span>
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

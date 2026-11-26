import React, { useState, useEffect } from 'react';
import { ExternalLink, X, ArrowUpRight, Loader2 } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import type { ProjectEntry } from '../portfolioData';
import { publicApi } from '../services/api';
import type { ProjectDto } from '../services/api';
import './ProjectsSection.css';

const FILTERS = [
  { key: 'all', label: 'ALL DEPLOYMENTS', index: '[00]' },
  { key: 'fullstack', label: 'FULL STACK', index: '[01]' },
  { key: 'systems', label: 'SYSTEMS & OCR', index: '[02]' },
  { key: 'frontend', label: 'CLIENT FRONTEND', index: '[03]' },
] as const;

function mapDtoToProjectEntry(dto: ProjectDto): ProjectEntry {
  return {
    id: dto.id,
    title: dto.title,
    shortDesc: dto.shortDescription,
    longDesc: dto.description,
    category: (dto.category === 'frontend' || dto.category === 'systems' ? dto.category : 'fullstack') as ProjectEntry['category'],
    categoryLabel: dto.category ? dto.category.toUpperCase() : 'FULL STACK',
    tags: dto.technologies || [],
    features: [
      dto.shortDescription,
      dto.technologies.length > 0 ? `Core Technologies: ${dto.technologies.join(', ')}` : '',
    ].filter(Boolean),
    demoUrl: dto.liveDemoUrl || undefined,
    githubUrl: dto.githubUrl || undefined,
    highlights: dto.featured ? 'FEATURED DEPLOYMENT' : (dto.category || 'SYSTEM').toUpperCase(),
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
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(mapDtoToProjectEntry);
          setProjects(mapped);
        } else {
          setProjects(PORTFOLIO_DATA.projects);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Backend API unavailable. Falling back to default portfolio projects.', err);
        setProjects(PORTFOLIO_DATA.projects);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="swiss-projects-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="mono-tag active mb-2">
              <span className="status-indicator" />
              <span>INDEX // PRODUCTION SYSTEMS</span>
            </div>
            <h2>
              SYSTEMS <span>LEDGER</span>
            </h2>
          </div>
          <p>
            An institutional ledger of engineered architectures, full-stack logistics engines,
            and high-throughput OCR automation pipelines.
          </p>
        </div>

        {/* Filter Ledger Tabs */}
        <div className="swiss-ledger-filter-row">
          <div className="swiss-filter-tabs">
            {FILTERS.map(({ key, label, index }) => (
              <button
                key={key}
                className={`swiss-filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key as typeof filter)}
              >
                <span className="filter-idx">{index}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="mono-tag text-muted">
            ENTRIES: [{String(filtered.length).padStart(2, '0')}]
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="swiss-ledger-loading">
            <Loader2 size={24} className="animate-spin text-emerald" />
            <span className="mono-tag">SYNCHRONIZING REPOSITORY LEDGER...</span>
          </div>
        )}

        {/* Swiss Institutional Ledger Table */}
        {!isLoading && (
          <div className="swiss-ledger-table">
            <div className="swiss-ledger-head">
              <div className="col-idx">INDEX</div>
              <div className="col-title">SYSTEM DESIGNATION</div>
              <div className="col-desc">SPECIFICATION SUMMARY</div>
              <div className="col-stack">TECH STACK</div>
              <div className="col-action">INSPECTION</div>
            </div>

            {filtered.map((project, idx) => {
              const formattedIndex = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={project.id}
                  className="swiss-ledger-row swiss-corner"
                  onClick={() => setSelected(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Inspect specification for ${project.title}`}
                >
                  <div className="col-idx">
                    <span className="ledger-num">[{formattedIndex}]</span>
                  </div>

                  <div className="col-title">
                    <div className="ledger-category-tag">{project.highlights}</div>
                    <h3 className="ledger-title">{project.title}</h3>
                  </div>

                  <div className="col-desc">
                    <p className="ledger-desc-text">{project.shortDesc}</p>
                  </div>

                  <div className="col-stack">
                    <div className="ledger-tags-wrap">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="ledger-tech-token">
                          [{tag}]
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-action">
                    <span className="ledger-action-btn">
                      <span>INSPECT</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="swiss-ledger-empty">
                <span className="mono-tag">NO RECORDS CATALOGED IN THIS CATEGORY</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technical Inspection Modal */}
      {selected && (
        <div className="proj-modal-overlay" onClick={() => setSelected(null)}>
          <div className="swiss-modal swiss-corner" onClick={(e) => e.stopPropagation()}>
            <div className="swiss-modal-header">
              <div>
                <span className="mono-tag active">
                  <span className="status-indicator" /> SYSTEM AUDIT RECORD
                </span>
                <h3 className="swiss-modal-title">{selected.title}</h3>
              </div>
              <button
                className="swiss-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="swiss-modal-body">
              <div className="swiss-modal-field">
                <span className="field-label">DESIGNATION &amp; SCOPE</span>
                <p className="field-value">{selected.longDesc}</p>
              </div>

              <div className="swiss-modal-field">
                <span className="field-label">CORE CAPABILITIES &amp; HIGHLIGHTS</span>
                <ul className="swiss-modal-features">
                  {selected.features.map((f, i) => (
                    <li key={i}>
                      <span className="feature-idx">[{String(i + 1).padStart(2, '0')}]</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="swiss-modal-field">
                <span className="field-label">TECHNOLOGY MATRICES</span>
                <div className="ledger-tags-wrap">
                  {selected.tags.map((tag, i) => (
                    <span key={i} className="ledger-tech-token active">
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>

              {(selected.demoUrl || selected.githubUrl) && (
                <div className="swiss-modal-actions">
                  {selected.demoUrl && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <ExternalLink size={15} />
                      <span>LIVE SYSTEM DEMO</span>
                    </a>
                  )}
                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                    >
                      <Github size={15} />
                      <span>SOURCE REPOSITORY</span>
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

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, AlertCircle } from 'lucide-react';
import type { ProjectDto, ProjectFormData } from '../services/api';
import { ProjectLivePreview } from './ProjectLivePreview';
import './ProjectFormModal.css';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: ProjectDto | null;
  mode: 'create' | 'edit';
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    if (initialData) {
      return {
        title: initialData.title,
        slug: initialData.slug,
        shortDescription: initialData.shortDescription,
        description: initialData.description,
        technologies: [...initialData.technologies],
        thumbnailUrl: initialData.thumbnailUrl || '',
        githubUrl: initialData.githubUrl || '',
        liveDemoUrl: initialData.liveDemoUrl || '',
        category: initialData.category || 'fullstack',
        featured: initialData.featured,
        displayOrder: initialData.displayOrder,
        status: initialData.status,
      };
    }
    return {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      technologies: [],
      thumbnailUrl: '',
      githubUrl: '',
      liveDemoUrl: '',
      category: 'fullstack',
      featured: false,
      displayOrder: 0,
      status: 'draft',
    };
  });

  const [tagInput, setTagInput] = useState('');
  const [slugLocked, setSlugLocked] = useState(mode === 'create');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugLocked ? generateSlug(val) : prev.slug,
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugLocked(false);
    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }));
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (formData.technologies.includes(trimmed)) return;

    setFormData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, trimmed],
    }));
    setTagInput('');
    if (errors.technologies) setErrors((prev) => ({ ...prev, technologies: '' }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && formData.technologies.length > 0) {
      handleRemoveTag(formData.technologies[formData.technologies.length - 1]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required.';
    if (!formData.slug.trim()) newErrors.slug = 'URL slug is required.';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required.';
    if (!formData.description.trim()) newErrors.description = 'Detailed description is required.';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology tag is required.';

    const validateUrl = (url?: string) => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (formData.liveDemoUrl && !validateUrl(formData.liveDemoUrl)) {
      newErrors.liveDemoUrl = 'Must be a valid HTTP or HTTPS URL.';
    }
    if (formData.githubUrl && !validateUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Must be a valid HTTP or HTTPS URL.';
    }
    if (formData.thumbnailUrl && !validateUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Must be a valid image URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.problem?.errors) {
        const serverErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.problem.errors)) {
          serverErrors[key] = (msgs as string[])[0];
        }
        setErrors(serverErrors);
      }
      setGeneralError(err.problem?.detail || err.message || 'Failed to save project. Please check the inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create New Project' : `Edit: ${initialData?.title}`}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Body with form & live preview */}
        <div className="modal-body">
          {/* Form Column */}
          <form id="project-form" onSubmit={handleSubmit}>
            {generalError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                <span>{generalError}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-field">
              <label className="form-label" htmlFor="proj-title">
                <span>Project Title <span className="required">*</span></span>
              </label>
              <input
                id="proj-title"
                type="text"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                placeholder="e.g., Enterprise Transport Hub"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
              {errors.title && <div className="field-error">{errors.title}</div>}
            </div>

            {/* Slug */}
            <div className="form-field">
              <label className="form-label" htmlFor="proj-slug">
                <span>URL Slug <span className="required">*</span></span>
                <span className="field-hint">Used in URLs: /projects/{formData.slug || 'slug'}</span>
              </label>
              <input
                id="proj-slug"
                type="text"
                className={`form-input ${errors.slug ? 'has-error' : ''}`}
                placeholder="e.g., enterprise-transport-hub"
                value={formData.slug}
                onChange={handleSlugChange}
                required
              />
              {errors.slug && <div className="field-error">{errors.slug}</div>}
            </div>

            {/* Short Description */}
            <div className="form-field">
              <label className="form-label" htmlFor="proj-short-desc">
                <span>Short Summary <span className="required">*</span></span>
                <span className="field-hint">{formData.shortDescription.length}/300</span>
              </label>
              <textarea
                id="proj-short-desc"
                rows={2}
                maxLength={300}
                className={`form-textarea ${errors.shortDescription ? 'has-error' : ''}`}
                placeholder="A concise, punchy 1-2 sentence overview for the project card..."
                value={formData.shortDescription}
                onChange={(e) => {
                  setFormData({ ...formData, shortDescription: e.target.value });
                  if (errors.shortDescription) setErrors({ ...errors, shortDescription: '' });
                }}
                required
              />
              {errors.shortDescription && <div className="field-error">{errors.shortDescription}</div>}
            </div>

            {/* Detailed Description */}
            <div className="form-field">
              <label className="form-label" htmlFor="proj-long-desc">
                <span>Detailed Description <span className="required">*</span></span>
              </label>
              <textarea
                id="proj-long-desc"
                rows={4}
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Comprehensive technical architecture, key features, challenges solved..."
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                required
              />
              {errors.description && <div className="field-error">{errors.description}</div>}
            </div>

            {/* Technology Stack Tags */}
            <div className="form-field">
              <label className="form-label">
                <span>Technologies / Tools <span className="required">*</span></span>
                <span className="field-hint">Press Enter or comma to add tag</span>
              </label>
              <div className={`tags-input-container ${errors.technologies ? 'has-error' : ''}`}>
                {formData.technologies.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      className="tag-chip-remove"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-text-input"
                  placeholder={formData.technologies.length === 0 ? "e.g., C#, React, PostgreSQL" : "Add more..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => handleAddTag(tagInput)}
                />
              </div>
              {errors.technologies && <div className="field-error">{errors.technologies}</div>}
            </div>

            {/* Category & Display Order */}
            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label" htmlFor="proj-category">
                  Category
                </label>
                <select
                  id="proj-category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="frontend">Frontend</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="systems">Systems & Backend</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="proj-order">
                  Display Sequence Order
                </label>
                <input
                  id="proj-order"
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            {/* URLs */}
            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label" htmlFor="proj-demo-url">
                  Live Demo URL
                </label>
                <input
                  id="proj-demo-url"
                  type="url"
                  className={`form-input ${errors.liveDemoUrl ? 'has-error' : ''}`}
                  placeholder="https://..."
                  value={formData.liveDemoUrl}
                  onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                />
                {errors.liveDemoUrl && <div className="field-error">{errors.liveDemoUrl}</div>}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="proj-github-url">
                  GitHub Repository URL
                </label>
                <input
                  id="proj-github-url"
                  type="url"
                  className={`form-input ${errors.githubUrl ? 'has-error' : ''}`}
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
                {errors.githubUrl && <div className="field-error">{errors.githubUrl}</div>}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className="form-field">
              <label className="form-label" htmlFor="proj-thumb-url">
                Thumbnail Image URL
              </label>
              <input
                id="proj-thumb-url"
                type="url"
                className={`form-input ${errors.thumbnailUrl ? 'has-error' : ''}`}
                placeholder="https://images.unsplash.com/... or asset link"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
              {errors.thumbnailUrl && <div className="field-error">{errors.thumbnailUrl}</div>}
            </div>

            {/* Toggles: Featured & Publication Status */}
            <div className="form-row-2" style={{ marginTop: '12px' }}>
              <label className="toggle-group">
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Featured Project</div>
                  <div className="field-hint">Adds glow effect and top highlight badge</div>
                </div>
              </label>

              <label className="toggle-group">
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })
                  }
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {formData.status === 'published' ? 'Published' : 'Draft'}
                  </div>
                  <div className="field-hint">
                    {formData.status === 'published'
                      ? 'Visible on public portfolio'
                      : 'Private (hidden from public)'}
                  </div>
                </div>
              </label>
            </div>
          </form>

          {/* Live Preview Column */}
          <div className="modal-preview-col">
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#818cf8" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                Live Portfolio Card Preview
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
              This preview updates instantly as you edit the fields above, mirroring how visitors will see it.
            </p>

            <ProjectLivePreview project={formData} />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            className="btn-modal-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving to MongoDB...
              </>
            ) : mode === 'create' ? (
              <>
                <Plus size={16} /> Create Project
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

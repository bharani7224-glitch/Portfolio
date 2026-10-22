import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  FolderGit2,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import { adminApi } from '../services/api';
import type { ProjectDto, ProjectFormData } from '../services/api';
import { ProjectFormModal } from './ProjectFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProjectLivePreview } from './ProjectLivePreview';
import './AdminProjects.css';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [counts, setCounts] = useState({ totalAll: 0, published: 0, draft: 0 });
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);

  // Preview Modal state
  const [previewProject, setPreviewProject] = useState<ProjectDto | null>(null);

  // Delete Modal state
  const [deletingProject, setDeletingProject] = useState<ProjectDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getProjects({
        status: statusFilter,
        search: searchQuery,
      });
      setProjects(res.data);
      if (res.counts) setCounts(res.counts);
    } catch (err: any) {
      setError(err.problem?.detail || err.message || 'Failed to fetch projects.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  // Handle Create / Edit
  const handleSaveProject = async (data: ProjectFormData) => {
    if (formMode === 'create') {
      const res = await adminApi.createProject(data);
      showToast('success', `Project "${res.data.title}" created successfully.`);
    } else if (editingProject) {
      const res = await adminApi.updateProject(editingProject.id, data);
      showToast('success', `Project "${res.data.title}" updated successfully.`);
    }
    fetchProjects();
  };

  // Handle Quick Toggle Status
  const handleToggleStatus = async (project: ProjectDto) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.updateStatus(project.id, newStatus);
      showToast(
        'success',
        `Project "${project.title}" ${newStatus === 'published' ? 'published' : 'moved to drafts'}.`
      );
      fetchProjects();
    } catch (err: any) {
      showToast('error', err.problem?.detail || 'Failed to update publication status.');
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteProject(deletingProject.id);
      showToast('success', `Project "${deletingProject.title}" deleted.`);
      setDeletingProject(null);
      fetchProjects();
    } catch (err: any) {
      showToast('error', err.problem?.detail || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-projects-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-header-title">
            Projects <span>CMS</span>
          </h1>
          <p className="admin-header-desc">
            Manage your project portfolio, publish updates, and configure what appears on your live
            website in real time.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            className="btn-add-project"
            onClick={() => {
              setEditingProject(null);
              setFormMode('create');
              setIsFormOpen(true);
            }}
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-controls-card">
        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by title, technology, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          <button
            className={`admin-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Work <span className="admin-tab-count">{counts.totalAll}</span>
          </button>
          <button
            className={`admin-tab-btn ${statusFilter === 'published' ? 'active' : ''}`}
            onClick={() => setStatusFilter('published')}
          >
            Published <span className="admin-tab-count">{counts.published}</span>
          </button>
          <button
            className={`admin-tab-btn ${statusFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setStatusFilter('draft')}
          >
            Drafts <span className="admin-tab-count">{counts.draft}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} />
          <div>
            <div style={{ fontWeight: 600 }}>Error Loading Projects</div>
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#6366f1' }} />
          <p>Loading projects from database...</p>
        </div>
      )}

      {/* Projects List */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="admin-projects-grid">
          {projects.map((p) => (
            <div key={p.id} className="admin-project-row">
              {/* Thumbnail */}
              <div className="admin-row-thumb">
                {p.thumbnailUrl ? (
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <FolderGit2 size={24} />
                )}
              </div>

              {/* Title & info */}
              <div className="admin-row-info">
                <div className="admin-row-title-row">
                  <h3 className="admin-row-title">{p.title}</h3>
                  {p.featured && (
                    <span className="admin-row-featured-badge">Featured</span>
                  )}
                </div>
                <p className="admin-row-desc">{p.shortDescription}</p>
              </div>

              {/* Tags */}
              <div className="admin-row-tags">
                {p.technologies.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {t}
                  </span>
                ))}
                {p.technologies.length > 3 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      padding: '2px 4px',
                    }}
                  >
                    +{p.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Status pill */}
              <div>
                <span className={`admin-status-pill ${p.status}`}>
                  <span className="status-dot" />
                  {p.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="admin-row-actions">
                {/* Publish Toggle */}
                <button
                  className="btn-action-icon publish"
                  onClick={() => handleToggleStatus(p)}
                  title={p.status === 'published' ? 'Unpublish (make Draft)' : 'Publish to live website'}
                  aria-label={p.status === 'published' ? 'Unpublish project' : 'Publish project'}
                >
                  {p.status === 'published' ? (
                    <ToggleRight size={20} color="#34d399" />
                  ) : (
                    <ToggleLeft size={20} color="rgba(255,255,255,0.4)" />
                  )}
                </button>

                {/* Live Preview Modal trigger */}
                <button
                  className="btn-action-icon"
                  onClick={() => setPreviewProject(p)}
                  title="Live Preview Card"
                  aria-label="Preview project card"
                >
                  <Eye size={16} />
                </button>

                {/* Edit */}
                <button
                  className="btn-action-icon"
                  onClick={() => {
                    setEditingProject(p);
                    setFormMode('edit');
                    setIsFormOpen(true);
                  }}
                  title="Edit Project"
                  aria-label="Edit project"
                >
                  <Edit2 size={16} />
                </button>

                {/* Delete */}
                <button
                  className="btn-action-icon delete"
                  onClick={() => setDeletingProject(p)}
                  title="Delete Project"
                  aria-label="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(18, 24, 38, 0.4)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
        }}>
          <FolderGit2 size={40} style={{ margin: '0 auto 16px auto', color: 'rgba(255, 255, 255, 0.3)' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>No Projects Found</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', marginBottom: '20px' }}>
            {searchQuery
              ? `No projects matched "${searchQuery}". Try a different search.`
              : statusFilter !== 'all'
              ? `No ${statusFilter} projects found.`
              : 'Your project database is currently empty. Add your first project!'}
          </p>
          <button
            className="btn-add-project"
            style={{ margin: '0 auto' }}
            onClick={() => {
              setEditingProject(null);
              setFormMode('create');
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} /> Add Your First Project
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <ProjectFormModal
          isOpen={isFormOpen}
          mode={formMode}
          initialData={editingProject}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSaveProject}
        />
      )}

      {/* Preview Dialog Modal */}
      {previewProject && (
        <div className="modal-overlay" onClick={() => setPreviewProject(null)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: '1.1rem' }}>
                Preview: {previewProject.title}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setPreviewProject(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <ProjectLivePreview project={previewProject} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          isOpen={!!deletingProject}
          projectTitle={deletingProject.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingProject(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

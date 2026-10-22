import React from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import './ProjectFormModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  projectTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  projectTitle,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
            <AlertTriangle size={20} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}>
              Confirm Project Deletion
            </h3>
          </div>
        </div>

        <div style={{ padding: '24px 28px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: '#fff' }}>"{projectTitle}"</strong>?
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            This action cannot be undone. The record will be permanently purged from the database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} /> Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

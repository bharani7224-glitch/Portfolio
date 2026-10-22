import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../services/api';
import type { ProjectDto } from '../services/api';
import { useAuth } from './AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ totalAll: 0, published: 0, draft: 0 });
  const [recentProjects, setRecentProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getProjects()
      .then((res) => {
        setRecentProjects(res.data.slice(0, 5));
        if (res.counts) setCounts(res.counts);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '20px',
        padding: '32px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '12px',
          }}>
            <ShieldCheck size={14} /> Production CMS Session
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>
            Welcome back, {user?.email}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', maxWidth: '520px' }}>
            Your CMS controls the live projects displayed on your portfolio. Drafts remain private until you publish them.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            <FolderGit2 size={18} /> Manage Projects
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        {/* Total Card */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FolderGit2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 500 }}>
              Total Projects
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
              {isLoading ? '...' : counts.totalAll}
            </div>
          </div>
        </div>

        {/* Published Card */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 500 }}>
              Live Published
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#34d399' }}>
              {isLoading ? '...' : counts.published}
            </div>
          </div>
        </div>

        {/* Drafts Card */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 500 }}>
              Private Drafts
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fbbf24' }}>
              {isLoading ? '...' : counts.draft}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Section */}
      <div style={{
        background: 'rgba(18, 24, 38, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '28px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, color: '#fff' }}>
            Recent Projects
          </h2>
          <Link
            to="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: '#818cf8',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentProjects.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {p.category} • {p.technologies.slice(0, 3).join(', ')}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    background:
                      p.status === 'published'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color: p.status === 'published' ? '#34d399' : '#fbbf24',
                  }}
                >
                  {p.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
            No projects added yet. <Link to="/admin/projects" style={{ color: '#818cf8' }}>Create your first project</Link>.
          </div>
        )}
      </div>
    </div>
  );
};

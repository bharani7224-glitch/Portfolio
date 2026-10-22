import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Code2,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && <div className="admin-backdrop" onClick={closeMobile} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin/projects" className="admin-brand" onClick={closeMobile}>
            <div className="admin-brand-icon">
              <Code2 size={20} />
            </div>
            <div>
              <div className="admin-brand-text">
                Bharani<span>.CMS</span>
              </div>
              <span className="admin-badge-role">Admin Workspace</span>
            </div>
          </Link>
          {mobileMenuOpen && (
            <button className="admin-menu-toggle" onClick={closeMobile} aria-label="Close menu">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/projects"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="admin-nav-item-icon">
              <FolderGit2 size={18} />
            </span>
            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="admin-nav-item-icon">
              <LayoutDashboard size={18} />
            </span>
            <span>Dashboard</span>
          </NavLink>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
            style={{ marginTop: 'auto' }}
          >
            <span className="admin-nav-item-icon">
              <ExternalLink size={18} />
            </span>
            <span>View Portfolio</span>
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          {user && (
            <div className="admin-user-pill">
              <div className="admin-user-avatar">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="admin-user-info">
                <span className="admin-user-email">{user.email}</span>
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Mobile Topbar */}
        <header className="admin-topbar">
          <Link to="/admin/projects" className="admin-brand">
            <div className="admin-brand-icon" style={{ width: '30px', height: '30px' }}>
              <Code2 size={16} />
            </div>
            <div className="admin-brand-text" style={{ fontSize: '0.95rem' }}>
              Bharani<span>.CMS</span>
            </div>
          </Link>
          <button
            className="admin-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Content View */}
        <main className="admin-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

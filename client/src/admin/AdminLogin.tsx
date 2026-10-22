import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect
  const from = (location.state as any)?.from?.pathname || '/admin/projects';
  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(
        err.problem?.detail || err.message || 'Invalid administrator credentials. Please check and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <Shield size={14} /> Admin Access
          </div>
          <h1 className="admin-login-title">
            Portfolio <span>CMS</span>
          </h1>
          <p className="admin-login-subtitle">
            Sign in to manage projects, content, and publications.
          </p>
        </div>

        {errorMessage && (
          <div className="admin-login-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                placeholder="admin@bharani.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input
                id="admin-password"
                type="password"
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-back-link">
            <ArrowLeft size={14} /> Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

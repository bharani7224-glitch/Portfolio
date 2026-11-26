import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import { contactApi, ApiError } from '../services/api';
import './ContactSection.css';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const profile = PORTFOLIO_DATA.profile;
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const githubSocial = profile.socials.find((s) => s.platform === 'GitHub');
  const linkedinSocial = profile.socials.find((s) => s.platform === 'LinkedIn');

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'FIELD_REQUIRED: Full Name';
    if (!form.email.trim()) e.email = 'FIELD_REQUIRED: Email Address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'INVALID_FORMAT: Enter valid email';
    if (!form.subject.trim()) e.subject = 'FIELD_REQUIRED: Subject line';
    if (!form.message.trim()) e.message = 'FIELD_REQUIRED: Message body';
    else if (form.message.trim().length < 10) e.message = 'LENGTH_REQUIREMENT: Minimum 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSubmitSuccess(true);
      setSuccessNote(res.delivery?.note || null);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
        setSuccessNote(null);
      }, 7000);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.problem) {
        if (err.problem.errors) {
          const fieldErrors: FormErrors = {};
          if (err.problem.errors.name) fieldErrors.name = err.problem.errors.name[0];
          if (err.problem.errors.email) fieldErrors.email = err.problem.errors.email[0];
          if (err.problem.errors.subject) fieldErrors.subject = err.problem.errors.subject[0];
          if (err.problem.errors.message) fieldErrors.message = err.problem.errors.message[0];
          setErrors(fieldErrors);
        }
        setServerError(err.problem.detail || 'Dispatch failed on server endpoint.');
      } else {
        setServerError('Server unreachable. Please dispatch email directly to bharani7224@gmail.com.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="swiss-contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="mono-tag active mb-2">
              <span className="status-indicator" />
              <span>TERMINAL // COMMUNICATION</span>
            </div>
            <h2>
              INITIATE <span>COMMUNICATION</span>
            </h2>
          </div>
          <p>
            Secure institutional channel for full-time engineering appointments, enterprise contracts, and technical advisory.
          </p>
        </div>

        {/* Split Grid */}
        <div className="swiss-contact-grid">
          {/* Left Column: Direct Communication Ledger */}
          <div className="swiss-contact-info-col">
            <div className="swiss-channel-card swiss-corner">
              <div className="channel-card-head">
                <span className="mono-tag active">[01 // VERIFIED CHANNELS]</span>
                <span className="mono-tag text-muted">PGP // DIRECT</span>
              </div>

              <div className="channel-list">
                <a href={`mailto:${profile.email}`} className="channel-row">
                  <div className="channel-icon-box">
                    <Mail size={16} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">ELECTRONIC MAIL:</span>
                    <span className="channel-value">{profile.email}</span>
                  </div>
                </a>

                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="channel-row">
                  <div className="channel-icon-box">
                    <Phone size={16} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">DIRECT LINE:</span>
                    <span className="channel-value">{profile.phone}</span>
                  </div>
                </a>

                <div className="channel-row">
                  <div className="channel-icon-box">
                    <MapPin size={16} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-label">STATION &amp; JURISDICTION:</span>
                    <span className="channel-value">{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Public Repositories & Profiles */}
              <div className="channel-socials-grid">
                {githubSocial && (
                  <a
                    href={githubSocial.url}
                    target="_blank"
                    rel="noreferrer"
                    className="swiss-social-btn"
                  >
                    <Github size={15} />
                    <span>GITHUB // CODE</span>
                  </a>
                )}
                {linkedinSocial && (
                  <a
                    href={linkedinSocial.url}
                    target="_blank"
                    rel="noreferrer"
                    className="swiss-social-btn"
                  >
                    <Linkedin size={15} />
                    <span>LINKEDIN // VERIFIED</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Transmission Form */}
          <div className="swiss-contact-form-col">
            <div className="swiss-form-card swiss-corner">
              <div className="form-card-head">
                <span className="mono-tag">[02 // TRANSMISSION PROTOCOL]</span>
                <span className="mono-tag active">ENCRYPTION // STANDARD</span>
              </div>

              {submitSuccess ? (
                <div className="swiss-form-success">
                  <CheckCircle2 size={36} className="text-emerald" />
                  <h3>TRANSMISSION CONFIRMED</h3>
                  <p>Your message has been logged in the direct message queue. Expect an engineered response shortly.</p>
                  {successNote && <span className="mono-tag text-muted">{successNote}</span>}
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="swiss-form">
                  {serverError && (
                    <div className="swiss-form-alert" role="alert">
                      <AlertCircle size={15} />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="swiss-form-row">
                    <div className="swiss-field">
                      <label htmlFor="name" className="field-mono-label">
                        [01] FULL NAME
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Alexander Vance"
                        className={`swiss-input ${errors.name ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.name && <span className="swiss-err-msg">{errors.name}</span>}
                    </div>

                    <div className="swiss-field">
                      <label htmlFor="email" className="field-mono-label">
                        [02] CORPORATE EMAIL
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. vance@institution.ch"
                        className={`swiss-input ${errors.email ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.email && <span className="swiss-err-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="swiss-field">
                    <label htmlFor="subject" className="field-mono-label">
                      [03] SUBJECT SPECIFICATION
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. High-Throughput .NET Architecture Collaboration"
                      className={`swiss-input ${errors.subject ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.subject && <span className="swiss-err-msg">{errors.subject}</span>}
                  </div>

                  <div className="swiss-field">
                    <label htmlFor="message" className="field-mono-label">
                      [04] PROJECT BRIEF &amp; REQUIREMENTS
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Specify project parameters, architectural scope, and timelines..."
                      className={`swiss-input ${errors.message ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.message && <span className="swiss-err-msg">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary swiss-submit-btn"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'TRANSMITTING PACKET...' : 'TRANSMIT SPECIFICATION'}</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

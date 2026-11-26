import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
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

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) {
      errs.name = 'Please enter your name.';
    }
    if (!form.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim()) {
      errs.subject = 'Please enter a subject.';
    }
    if (!form.message.trim()) {
      errs.message = 'Please enter a message.';
    } else if (form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSubmitSuccess(true);
      if (response && response.message) {
        setSuccessNote(response.message);
      }
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Transmission failed. Please try again or reach out via direct email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const githubSocial = profile.socials.find((s) => s.platform === 'GitHub');
  const linkedinSocial = profile.socials.find((s) => s.platform === 'LinkedIn');

  return (
    <section id="contact" className="panda-contact-section section-dark">
      <div className="container">
        {/* Massive Interactive CTA Headline */}
        <div className="contact-massive-cta">
          <div className="flex items-center gap-3 mb-6">
            <span className="sticker-pill lime" data-cursor="CONNECT">
              <span className="pulsing-dot" />
              <span>COMMUNICATION PORTAL</span>
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              LET'S COLLABORATE
            </span>
          </div>

          <h2 className="massive-cta-title">
            LET'S BUILD{' '}
            <span className="inline-hero-pill lime text-[28px] md:text-[44px]">
              TOGETHER
            </span>{' '}
            SOMETHING EXTRAORDINARY.
          </h2>

          <p className="massive-cta-sub">
            Whether you have a breakthrough product idea, need an enterprise .NET backend, or are looking for a dedicated full-stack engineer — my inbox is open.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="panda-contact-grid">
          {/* Left Column: Direct Reach */}
          <div className="contact-channels-col">
            <div className="contact-cards-stack">
              <a
                href={`mailto:${profile.email}`}
                className="channel-tactile-card"
                data-cursor="EMAIL"
              >
                <div className="channel-badge-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="channel-small-label">EMAIL ADDRESS</span>
                  <span className="channel-big-val">{profile.email}</span>
                </div>
                <ArrowUpRight size={18} className="channel-arrow" />
              </a>

              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="channel-tactile-card"
                data-cursor="CALL"
              >
                <div className="channel-badge-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="channel-small-label">PHONE / WHATSAPP</span>
                  <span className="channel-big-val">{profile.phone}</span>
                </div>
                <ArrowUpRight size={18} className="channel-arrow" />
              </a>

              <div className="channel-tactile-card">
                <div className="channel-badge-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="channel-small-label">LOCATION</span>
                  <span className="channel-big-val">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="contact-socials-row">
              {githubSocial && (
                <a
                  href={githubSocial.url}
                  target="_blank"
                  rel="noreferrer"
                  className="panda-social-btn"
                  data-cursor="GITHUB"
                >
                  <Github size={18} />
                  <span>GITHUB</span>
                </a>
              )}
              {linkedinSocial && (
                <a
                  href={linkedinSocial.url}
                  target="_blank"
                  rel="noreferrer"
                  className="panda-social-btn"
                  data-cursor="LINKEDIN"
                >
                  <Linkedin size={18} />
                  <span>LINKEDIN</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Tactile Form */}
          <div className="contact-form-col">
            <div className="contact-form-frame">
              {submitSuccess ? (
                <div className="contact-success-state">
                  <CheckCircle2 size={44} className="text-[#CCFF00]" />
                  <h3 className="text-2xl font-bold text-white">MESSAGE TRANSMITTED!</h3>
                  <p className="text-zinc-400 text-sm">
                    Thank you for reaching out. Bharani has received your dispatch and will reply shortly.
                  </p>
                  {successNote && (
                    <span className="text-xs font-mono text-zinc-500">{successNote}</span>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="panda-form">
                  {serverError && (
                    <div className="form-error-alert" role="alert">
                      <AlertCircle size={16} />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="form-two-cols">
                    <div className="form-field-wrap">
                      <label htmlFor="name" className="field-label">
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        className={`panda-input ${errors.name ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-field-wrap">
                      <label htmlFor="email" className="field-label">
                        YOUR EMAIL
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. alex@company.com"
                        className={`panda-input ${errors.email ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-field-wrap">
                    <label htmlFor="subject" className="field-label">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. Enterprise .NET Architecture Project"
                      className={`panda-input ${errors.subject ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                  </div>

                  <div className="form-field-wrap">
                    <label htmlFor="message" className="field-label">
                      MESSAGE / PROJECT BRIEF
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell me about your goals, timelines, and technical requirements..."
                      className={`panda-input ${errors.message ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.message && <span className="error-text">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="panda-btn panda-btn-primary w-full justify-center"
                    disabled={isSubmitting}
                    data-cursor="SEND"
                  >
                    <span>{isSubmitting ? 'SENDING PACKET...' : 'SEND MESSAGE'}</span>
                    <Send size={16} />
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

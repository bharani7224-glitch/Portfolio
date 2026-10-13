import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import bharaniImg from '../assets/bharani.jpg';
import { ScrollReveal } from '../components/ScrollReveal';
import './AboutContact.css';


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

export const AboutContact: React.FC = () => {
  // Form State
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Skill progress state for animation trigger
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Small delay to trigger smooth transition of skill bars on load
    const timer = setTimeout(() => setAnimateProgress(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const skills = [
    { name: 'C# & ASP.NET Web API', percentage: 90 },
    { name: 'React.js & Tailwind CSS', percentage: 92 },
    { name: 'Node.js & Express.js', percentage: 86 },
    { name: 'PostgreSQL & Oracle DB', percentage: 84 },
    { name: 'MongoDB', percentage: 80 },
  ];

  const timeline = [
    {
      period: 'Present',
      role: 'Software Developer',
      company: 'NavaNala Technologies, Perundurai',
      desc: 'Developing dynamic web applications, implementing clean frontend architectures, and optimising logic routines.',
    },
    {
      period: 'May - July',
      role: 'Software Engineer Intern',
      company: 'BlackStone InFomatics, Coimbatore',
      desc: 'Gained hands-on experience in full stack components, API integration patterns, and layout designs.',
    },
    {
      period: '2023 - 2026',
      role: 'BCA (Bachelor of Computer Applications) - Graduate',
      company: 'Erode Arts And Science College',
      desc: 'Completed academic courses in web design, databases, software development fundamentals, and application management. Graduated with a CGPA of 7.36.',
    },
  ];

  // Contact Validation
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.name.trim()) tempErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim()) tempErrors.subject = 'Subject is required.';
    if (!form.message.trim()) {
      tempErrors.message = 'Message must not be empty.';
    } else if (form.message.length < 10) {
      tempErrors.message = 'Message must be at least 10 characters.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field errors as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Replicate sending delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      // Reset success state after a delay
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="about-contact-page page-enter container">
      {/* Intro section */}
      <section className="about-intro-section">
        <ScrollReveal animation="fade-right" className="profile-reveal-wrapper">
          <div className="profile-wrapper">
            <div className="image-frame-container">
              <div className="image-border-glow"></div>
              <img src={bharaniImg} alt="Bharani Profile" className="profile-img" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-left" delay={150} className="bio-reveal-wrapper">
          <div className="bio-wrapper">
            <p className="bio-text">
              I am a passionate software developer based in Tamil Nadu, India. With a deep focus on crafting interactive visual experiences, I love bridging the gap between pixel-perfect mockups and functional engineering.
            </p>
            <p className="bio-text">
              My development processes center around responsiveness, clean logic architecture, and minimizing load times. I specialize in the modern web ecosystem, creating scalable React clients powered by Node backends.
            </p>

            <div className="info-list">
              <div className="info-item">
                <MapPin size={18} className="info-icon" />
                <span>Tamil Nadu, India</span>
              </div>
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <span>bharani7224@gmail.com</span>
              </div>
              <div className="info-item">
                <Phone size={18} className="info-icon" />
                <span>+91 93606 80467</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Skills and Timeline Section */}
      <section className="skills-timeline-section">
        <div className="skills-column">
          <ScrollReveal animation="fade-up">
            <h3>Core <span>Skills</span></h3>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100} className="skills-list-reveal">
            <div className="skills-list glass-card">
              {skills.map((skill, i) => (
                <div key={i} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-pct">{skill.percentage}%</span>
                  </div>
                  <div className="skill-track">
                    <div 
                      className="skill-bar" 
                      style={{ width: animateProgress ? `${skill.percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <div className="timeline-column">
          <ScrollReveal animation="fade-up">
            <h3>My <span>Journey</span></h3>
          </ScrollReveal>
          <div className="timeline-list">
            {timeline.map((item, i) => (
              <ScrollReveal 
                key={i} 
                animation="fade-up" 
                delay={i * 150}
                className="timeline-item-reveal-wrapper"
              >
                <div className="timeline-item">
                  <div className="timeline-node" />
                  <div className="timeline-card glass-card">
                    <span className="timeline-period">{item.period}</span>
                    <h4 className="timeline-role">{item.role}</h4>
                    <span className="timeline-company">{item.company}</span>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <h2>Get In <span>Touch</span></h2>
            <p>Have an interesting project proposal or job opportunity? Send a message and let's start talking.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} className="contact-form-reveal">
          <div className="contact-form-wrapper glass-card">
            {submitSuccess ? (
              <div className="success-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out, Bharani will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'input-error' : ''}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    {errors.name && <span className="error-text"><AlertCircle size={12} /> {errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'input-error' : ''}
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && <span className="error-text"><AlertCircle size={12} /> {errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className={errors.subject ? 'input-error' : ''}
                    placeholder="Project Collaboration"
                    disabled={isSubmitting}
                  />
                  {errors.subject && <span className="error-text"><AlertCircle size={12} /> {errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={errors.message ? 'input-error' : ''}
                    placeholder="Hey Bharani, let's collaborate on..."
                    disabled={isSubmitting}
                  />
                  {errors.message && <span className="error-text"><AlertCircle size={12} /> {errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Message...' : 'Send Message'} <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

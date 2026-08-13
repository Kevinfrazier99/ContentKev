'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`UGC Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:kevinkevinfrazier@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const inputStyles = {
    background: 'transparent',
    border: '1px solid var(--rule-dark)',
    color: 'var(--salt)',
    padding: '0.875rem 1rem',
    fontFamily: 'var(--font)',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyles = {
    color: 'var(--mist)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    marginBottom: '0.5rem',
    display: 'block',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg">
      <div>
        <label htmlFor="name" style={labelStyles}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = 'var(--shallows)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--rule-dark)'}
        />
      </div>

      <div>
        <label htmlFor="email" style={labelStyles}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = 'var(--shallows)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--rule-dark)'}
        />
      </div>

      <div>
        <label htmlFor="company" style={labelStyles}>Brand / Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          style={inputStyles}
          onFocus={(e) => e.target.style.borderColor = 'var(--shallows)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--rule-dark)'}
        />
      </div>

      <div>
        <label htmlFor="message" style={labelStyles}>Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          style={{
            ...inputStyles,
            resize: 'vertical',
            minHeight: '120px',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--shallows)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--rule-dark)'}
        />
      </div>

      <button type="submit" className="btn-outline mt-2">
        Send Message
      </button>
    </form>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  // Accepts 10-15 digits, optional +, spaces, dashes
  return /^(\+?\d[\d\s-]{8,14}\d)$/.test(phone.trim());
}

function getStoredCandidates() {
  try {
    const data = localStorage.getItem('hh_candidates');
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveCandidate(candidate) {
  const candidates = getStoredCandidates();
  candidates.push(candidate);
  localStorage.setItem('hh_candidates', JSON.stringify(candidates));
}

export default function InterestForm() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Restore form if user navigates away
    const saved = localStorage.getItem('hh_interest_form');
    if (saved) {
      try {
        setFields(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Persist form fields
    localStorage.setItem('hh_interest_form', JSON.stringify(fields));
  }, [fields]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
    setSubmitError('');
    setSuccess('');
  }

  function validateAll() {
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Name is required.';
    if (!fields.email.trim()) errs.email = 'Email is required.';
    else if (!validateEmail(fields.email)) errs.email = 'Invalid email address.';
    if (!fields.phone.trim()) errs.phone = 'Phone is required.';
    else if (!validatePhone(fields.phone)) errs.phone = 'Invalid phone number.';
    if (!fields.position.trim()) errs.position = 'Position is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setSubmitError('');
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      try {
        const candidates = getStoredCandidates();
        const duplicate = candidates.find(
          c => c.email.trim().toLowerCase() === fields.email.trim().toLowerCase()
        );
        if (duplicate) {
          setErrors({ email: 'This email has already been submitted.' });
          setSubmitting(false);
          return;
        }
        saveCandidate({
          ...fields,
          submittedAt: new Date().toISOString()
        });
        setSuccess('Your application has been submitted successfully!');
        setFields({
          name: '',
          email: '',
          phone: '',
          position: '',
          message: ''
        });
        setErrors({});
        localStorage.removeItem('hh_interest_form');
      } catch (err) {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
      setSubmitting(false);
    }, 700);
  }

  return (
    <main>
      <h1>Candidate Interest Form</h1>
      <p>
        Fill out the form below to express your interest in joining HireHub. Our team will review your application and get in touch soon.
      </p>
      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="position">Position Interested In *</label>
          <input
            id="position"
            name="position"
            type="text"
            value={fields.position}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.position && <div className="form-error">{errors.position}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="message">Additional Message (optional)</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={fields.message}
            onChange={handleChange}
            disabled={submitting}
            style={{ resize: 'vertical' }}
          />
        </div>
        {submitError && <div className="form-error">{submitError}</div>}
        {success && <div className="form-success">{success}</div>}
        <button type="submit" disabled={submitting} style={{ minWidth: 140 }}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/">
          <button type="button" style={{ background: 'var(--color-secondary)', color: 'var(--color-primary)', fontWeight: 600 }}>
            Back to Home
          </button>
        </Link>
      </div>
    </main>
  );
}

InterestForm.propTypes = {};
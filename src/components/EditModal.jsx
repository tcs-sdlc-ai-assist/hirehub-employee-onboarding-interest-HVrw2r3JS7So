import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function validate(fields) {
  const errs = {};
  if (!fields.name || !fields.name.trim()) errs.name = 'Name is required.';
  if (!fields.phone || !fields.phone.trim()) errs.phone = 'Phone is required.';
  if (!fields.position || !fields.position.trim()) errs.position = 'Position is required.';
  return errs;
}

export default function EditModal({ open, candidate, onSave, onCancel, loading }) {
  const [fields, setFields] = useState(candidate || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields(candidate || {});
    setErrors({});
  }, [candidate, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(fields);
  }

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.18)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 32px rgba(42,110,234,0.13)',
          padding: '2rem',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          position: 'relative'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>Edit Submission</h2>
        <div className="form-group">
          <label htmlFor="edit-name">Full Name *</label>
          <input
            id="edit-name"
            name="name"
            type="text"
            value={fields.name || ''}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="edit-email">Email *</label>
          <input
            id="edit-email"
            name="email"
            type="email"
            value={fields.email || ''}
            disabled
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-phone">Phone *</label>
          <input
            id="edit-phone"
            name="phone"
            type="tel"
            value={fields.phone || ''}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="edit-position">Position *</label>
          <input
            id="edit-position"
            name="position"
            type="text"
            value={fields.position || ''}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.position && <div className="form-error">{errors.position}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="edit-message">Message</label>
          <textarea
            id="edit-message"
            name="message"
            rows={3}
            value={fields.message || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="button"
            style={{ background: 'var(--color-secondary)', color: 'var(--color-primary)', fontWeight: 600 }}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} style={{ minWidth: 100 }}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  candidate: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
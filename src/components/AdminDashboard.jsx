import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function getStoredCandidates() {
  try {
    const data = localStorage.getItem('hh_candidates');
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveCandidates(candidates) {
  localStorage.setItem('hh_candidates', JSON.stringify(candidates));
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString();
  } catch (e) {
    return dateStr;
  }
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      flex: 1,
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(42,110,234,0.06)',
      padding: '1.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: 0
    }}>
      <div style={{
        fontSize: '2rem',
        color: color || 'var(--color-primary)',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{value}</div>
        <div style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>{label}</div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string
};

function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions.length) {
    return <div style={{ textAlign: 'center', color: 'var(--color-text-light)', margin: '2rem 0' }}>No submissions yet.</div>;
  }
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Position</th>
          <th>Submitted</th>
          <th>Message</th>
          <th style={{ minWidth: 120 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((c, idx) => (
          <tr key={c.email + c.submittedAt}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.position}</td>
            <td>{formatDate(c.submittedAt)}</td>
            <td style={{ maxWidth: 220, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{c.message}</td>
            <td>
              <button
                type="button"
                style={{ marginRight: 8, background: 'var(--color-accent)', color: '#222b45' }}
                onClick={() => onEdit(idx)}
              >
                Edit
              </button>
              <button
                type="button"
                style={{ background: 'var(--color-error)' }}
                onClick={() => onDelete(idx)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
    message: PropTypes.string,
    submittedAt: PropTypes.string
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function EditModal({ open, candidate, onSave, onCancel, loading }) {
  const [fields, setFields] = useState(candidate || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields(candidate || {});
    setErrors({});
  }, [candidate, open]);

  function validate() {
    const errs = {};
    if (!fields.name || !fields.name.trim()) errs.name = 'Name is required.';
    if (!fields.email || !fields.email.trim()) errs.email = 'Email is required.';
    if (!fields.phone || !fields.phone.trim()) errs.phone = 'Phone is required.';
    if (!fields.position || !fields.position.trim()) errs.position = 'Position is required.';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
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
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
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

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteLoadingIdx, setDeleteLoadingIdx] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSubmissions(getStoredCandidates());
      setLoading(false);
    }, 400);
  }, []);

  function handleEdit(idx) {
    setEditIdx(idx);
    setEditError('');
  }

  function handleEditCancel() {
    setEditIdx(null);
    setEditError('');
  }

  function handleEditSave(updated) {
    setEditLoading(true);
    setEditError('');
    setTimeout(() => {
      try {
        setSubmissions(prev => {
          const updatedList = prev.map((c, i) => i === editIdx ? { ...c, ...updated } : c);
          saveCandidates(updatedList);
          return updatedList;
        });
        setEditIdx(null);
      } catch (e) {
        setEditError('Failed to save changes.');
      }
      setEditLoading(false);
    }, 600);
  }

  function handleDelete(idx) {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    setDeleteLoadingIdx(idx);
    setTimeout(() => {
      try {
        setSubmissions(prev => {
          const updatedList = prev.filter((_, i) => i !== idx);
          saveCandidates(updatedList);
          return updatedList;
        });
      } catch (e) {
        // Optionally show error
      }
      setDeleteLoadingIdx(null);
    }, 600);
  }

  function handleLogout() {
    sessionStorage.removeItem('hh_admin_auth');
    window.location.href = '/admin/login';
  }

  // Stats
  const total = submissions.length;
  const uniquePositions = Array.from(new Set(submissions.map(c => c.position))).length;
  const lastSubmission = submissions.length
    ? formatDate(submissions.reduce((latest, c) => c.submittedAt > latest ? c.submittedAt : latest, submissions[0].submittedAt))
    : 'N/A';

  return (
    <main>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <button type="button" onClick={handleLogout} style={{ background: 'var(--color-error)' }}>
          Logout
        </button>
      </div>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap'
      }}>
        <StatCard
          label="Total Submissions"
          value={total}
          icon={<span role="img" aria-label="Forms">📝</span>}
        />
        <StatCard
          label="Unique Positions"
          value={uniquePositions}
          icon={<span role="img" aria-label="Briefcase">💼</span>}
          color="var(--color-success)"
        />
        <StatCard
          label="Last Submission"
          value={lastSubmission}
          icon={<span role="img" aria-label="Clock">⏰</span>}
          color="var(--color-accent)"
        />
      </div>
      <h2 style={{ marginBottom: '1rem' }}>Candidate Submissions</h2>
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-light)', margin: '2rem 0' }}>
          Loading submissions...
        </div>
      ) : (
        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <EditModal
        open={editIdx !== null}
        candidate={editIdx !== null ? submissions[editIdx] : null}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        loading={editLoading}
      />
      {editError && (
        <div className="form-error" style={{ marginTop: '1rem', textAlign: 'center' }}>{editError}</div>
      )}
      <style>
        {`
          @media (max-width: 900px) {
            .stat-cards {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `}
      </style>
    </main>
  );
}

AdminDashboard.propTypes = {};
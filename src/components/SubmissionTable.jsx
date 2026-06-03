import React from 'react';
import PropTypes from 'prop-types';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString();
  } catch (e) {
    return dateStr;
  }
}

export default function SubmissionTable({ submissions, onEdit, onDelete, loading, deleteLoadingIdx }) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-light)', margin: '2rem 0' }}>
        Loading submissions...
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-light)', margin: '2rem 0' }}>
        No submissions yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table" style={{ minWidth: 800 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Submitted On</th>
            <th style={{ minWidth: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((c, idx) => (
            <tr key={c.email + c.submittedAt}>
              <td>{idx + 1}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.position}</td>
              <td>{formatDate(c.submittedAt)}</td>
              <td>
                <button
                  type="button"
                  style={{
                    marginRight: 8,
                    background: 'var(--color-accent)',
                    color: '#222b45'
                  }}
                  onClick={() => onEdit(idx)}
                  disabled={!!deleteLoadingIdx}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ background: 'var(--color-error)' }}
                  onClick={() => onDelete(idx)}
                  disabled={deleteLoadingIdx === idx}
                >
                  {deleteLoadingIdx === idx ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>
        {`
          @media (max-width: 900px) {
            .table {
              font-size: 0.98rem;
            }
          }
          @media (max-width: 600px) {
            .table {
              min-width: 600px;
              font-size: 0.95rem;
            }
          }
        `}
      </style>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      position: PropTypes.string,
      submittedAt: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  deleteLoadingIdx: PropTypes.number
};
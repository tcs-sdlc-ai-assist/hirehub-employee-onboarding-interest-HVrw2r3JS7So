import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    setTimeout(() => {
      const { username, password } = fields;
      if (username === 'admin' && password === 'admin') {
        sessionStorage.setItem('hh_admin_auth', 'true');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid username or password.');
        setSubmitting(false);
      }
    }, 600);
  }

  return (
    <main>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 400, margin: '0 auto' }}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={fields.username}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={fields.password}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={submitting} style={{ minWidth: 120 }}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}

AdminLogin.propTypes = {};
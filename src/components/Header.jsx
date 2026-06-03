import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('hh_admin_auth') === 'true'
  );

  useEffect(() => {
    function handleStorage() {
      setIsLoggedIn(sessionStorage.getItem('hh_admin_auth') === 'true');
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem('hh_admin_auth');
    setIsLoggedIn(false);
    navigate('/admin/login');
  }

  function navLinkClass(path) {
    return location.pathname === path
      ? 'nav-link active'
      : 'nav-link';
  }

  return (
    <header className="Header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.5px', textDecoration: 'none' }}>
          HireHub
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem' }}>
          <Link to="/" className={navLinkClass('/')}>Home</Link>
          <Link to="/apply" className={navLinkClass('/apply')}>Apply</Link>
          <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
        </nav>
      </div>
      <div>
        {isLoggedIn ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/admin/login">
            <button type="button">
              Login
            </button>
          </Link>
        )}
      </div>
      <style>
        {`
          .nav-link {
            color: #fff;
            opacity: 0.85;
            font-weight: 500;
            text-decoration: none;
            padding: 0.25em 0.5em;
            border-radius: 4px;
            transition: background 0.15s, opacity 0.15s;
          }
          .nav-link.active {
            background: rgba(255,255,255,0.18);
            opacity: 1;
          }
          .nav-link:hover,
          .nav-link:focus {
            background: rgba(255,255,255,0.10);
            opacity: 1;
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .Header nav {
              gap: 0.5rem;
            }
            .Header {
              font-size: 0.98rem;
            }
          }
        `}
      </style>
    </header>
  );
}

Header.propTypes = {};

export default Header;
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<Header />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Header component', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders navigation links', () => {
    renderHeader('/');
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Apply/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Admin/i })).toBeInTheDocument();
  });

  it('shows Login button when not authenticated', () => {
    renderHeader('/');
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  it('shows Logout button when authenticated', () => {
    sessionStorage.setItem('hh_admin_auth', 'true');
    renderHeader('/');
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Login/i })).not.toBeInTheDocument();
  });

  it('Logout button clears session and navigates to login', () => {
    sessionStorage.setItem('hh_admin_auth', 'true');
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: actual.useLocation,
        Link: actual.Link,
      };
    });
    // Need to re-import Header after mocking
    // eslint-disable-next-line global-require
    const HeaderWithMock = require('./Header').default;
    render(
      <MemoryRouter>
        <HeaderWithMock />
      </MemoryRouter>
    );
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);
    expect(sessionStorage.getItem('hh_admin_auth')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    vi.resetModules();
  });

  it('Login button navigates to admin login', () => {
    renderHeader('/');
    const loginBtn = screen.getByRole('button', { name: /Login/i });
    expect(loginBtn.closest('a')).toHaveAttribute('href', '/admin/login');
  });

  it('highlights the active route', () => {
    renderHeader('/apply');
    const homeLink = screen.getByRole('link', { name: /Home/i });
    const applyLink = screen.getByRole('link', { name: /Apply/i });
    const adminLink = screen.getByRole('link', { name: /Admin/i });
    expect(homeLink.className).not.toContain('active');
    expect(applyLink.className).toContain('active');
    expect(adminLink.className).not.toContain('active');
  });
});
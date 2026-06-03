import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

describe('App routing and rendering', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders the landing page at root route', () => {
    renderWithRouter(['/']);
    expect(screen.getByText(/Welcome to HireHub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply Now/i })).toBeInTheDocument();
  });

  it('navigates to the interest form', async () => {
    renderWithRouter(['/']);
    const applyBtn = screen.getByRole('button', { name: /Apply Now/i });
    fireEvent.click(applyBtn);
    await waitFor(() => {
      expect(screen.getByText(/Candidate Interest Form/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('renders the interest form directly', () => {
    renderWithRouter(['/apply']);
    expect(screen.getByText(/Candidate Interest Form/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('renders the admin login page at /admin/login', () => {
    renderWithRouter(['/admin/login']);
    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('redirects /admin to login if not authenticated', async () => {
    renderWithRouter(['/admin']);
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });
  });

  it('shows admin dashboard after login', async () => {
    renderWithRouter(['/admin/login']);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Total Submissions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('shows navigation links in header', () => {
    renderWithRouter(['/']);
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Apply/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Admin/i })).toBeInTheDocument();
  });

  it('logout removes admin session and redirects to login', async () => {
    sessionStorage.setItem('hh_admin_auth', 'true');
    renderWithRouter(['/admin']);
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('hh_admin_auth')).toBeNull();
  });
});
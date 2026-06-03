import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

function renderLogin() {
  return render(
    <MemoryRouter>
      <AdminLogin />
    </MemoryRouter>
  );
}

describe('AdminLogin', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders username and password fields and login button', () => {
    renderLogin();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows error for invalid credentials', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(screen.getByRole('button', { name: /Logging in/i })).toBeDisabled();
    expect(await screen.findByText(/Invalid username or password/i)).toBeInTheDocument();
    expect(sessionStorage.getItem('hh_admin_auth')).toBeNull();
  });

  it('sets session and navigates on correct credentials', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });
    // eslint-disable-next-line global-require
    const AdminLoginWithMock = require('./AdminLogin').default;
    render(
      <MemoryRouter>
        <AdminLoginWithMock />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(screen.getByRole('button', { name: /Logging in/i })).toBeDisabled();
    await waitFor(() => {
      expect(sessionStorage.getItem('hh_admin_auth')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
    vi.resetModules();
  });

  it('disables fields and button during submitting', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(screen.getByLabelText(/Username/i)).toBeDisabled();
    expect(screen.getByLabelText(/Password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Logging in/i })).toBeDisabled();
    await waitFor(() => {
      expect(sessionStorage.getItem('hh_admin_auth')).toBe('true');
    });
  });

  it('shows no error initially', () => {
    renderLogin();
    expect(screen.queryByText(/Invalid username or password/i)).not.toBeInTheDocument();
  });
});
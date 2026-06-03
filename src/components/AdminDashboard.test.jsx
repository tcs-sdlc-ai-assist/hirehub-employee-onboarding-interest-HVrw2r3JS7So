import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

const mockSubmissions = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    phone: '+12345678901',
    position: 'Developer',
    message: 'Excited!',
    submittedAt: '2024-06-01T10:00:00.000Z'
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    phone: '+12345678902',
    position: 'Designer',
    message: 'Looking forward',
    submittedAt: '2024-06-02T12:00:00.000Z'
  }
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders loading state initially', () => {
    renderDashboard();
    expect(screen.getByText(/Loading submissions/i)).toBeInTheDocument();
  });

  it('renders stats and table with submissions', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify(mockSubmissions));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Unique Positions')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Last Submission')).toBeInTheDocument();
    expect(screen.getByText(/Candidate Submissions/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Edit/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Delete/i })).toHaveLength(2);
  });

  it('shows "No submissions yet" when empty', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify([]));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/No submissions yet/i)).toBeInTheDocument();
    });
  });

  it('opens and closes edit modal, validates required fields', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify([mockSubmissions[0]]));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(screen.getByText(/Edit Submission/i)).toBeInTheDocument();
    // Clear name and try to save
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    // Cancel closes modal
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Edit Submission/i)).not.toBeInTheDocument();
    });
  });

  it('edits a submission and updates the table', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify([mockSubmissions[0]]));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Alice Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(screen.getByText('Alice Updated')).toBeInTheDocument();
    });
    // Check localStorage updated
    const saved = JSON.parse(localStorage.getItem('hh_candidates'));
    expect(saved[0].name).toBe('Alice Updated');
  });

  it('deletes a submission and updates the table', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify(mockSubmissions));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
    // Confirm dialog: mock window.confirm to always return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
    expect(JSON.parse(localStorage.getItem('hh_candidates'))).toHaveLength(1);
    confirmSpy.mockRestore();
  });

  it('does not delete if confirm is cancelled', async () => {
    localStorage.setItem('hh_candidates', JSON.stringify(mockSubmissions));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false);
    fireEvent.click(screen.getAllByRole('button', { name: /Delete/i })[0]);
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    expect(JSON.parse(localStorage.getItem('hh_candidates'))).toHaveLength(2);
    confirmSpy.mockRestore();
  });

  it('logout clears session and redirects to login', async () => {
    sessionStorage.setItem('hh_admin_auth', 'true');
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    const oldLocation = window.location;
    delete window.location;
    window.location = { href: '', assign: vi.fn() };
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(sessionStorage.getItem('hh_admin_auth')).toBeNull();
    expect(window.location.href).toBe('/admin/login');
    window.location = oldLocation;
  });
});
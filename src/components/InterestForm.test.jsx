import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InterestForm from './InterestForm';

function renderForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position Interested In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Position is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid phone', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: 'abc123' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(await screen.findByText(/Invalid phone number/i)).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+12345678901' } });
    fireEvent.change(screen.getByLabelText(/Position Interested In/i), { target: { value: 'Developer' } });
    fireEvent.change(screen.getByLabelText(/Additional Message/i), { target: { value: 'Looking forward!' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument();
    // Fields should be cleared
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('');
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('');
    expect(screen.getByLabelText(/Position Interested In/i)).toHaveValue('');
    expect(screen.getByLabelText(/Additional Message/i)).toHaveValue('');
    // Should be saved in localStorage
    const candidates = JSON.parse(localStorage.getItem('hh_candidates'));
    expect(candidates).toBeInstanceOf(Array);
    expect(candidates[0].email).toBe('alice@example.com');
  });

  it('shows duplicate email error if email already submitted', async () => {
    // Pre-populate localStorage with a submission
    localStorage.setItem(
      'hh_candidates',
      JSON.stringify([
        {
          name: 'Bob',
          email: 'bob@example.com',
          phone: '+12345678901',
          position: 'Designer',
          message: '',
          submittedAt: new Date().toISOString()
        }
      ])
    );
    renderForm();
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+12345678901' } });
    fireEvent.change(screen.getByLabelText(/Position Interested In/i), { target: { value: 'Designer' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(await screen.findByText(/already been submitted/i)).toBeInTheDocument();
  });

  it('persists form fields in localStorage and restores them', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'charlie@example.com' } });
    // Simulate reload
    expect(JSON.parse(localStorage.getItem('hh_interest_form')).name).toBe('Charlie');
    // Unmount and remount
    screen.unmount();
    renderForm();
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Charlie');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('charlie@example.com');
  });

  it('shows and hides loading state on submit', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+12345678901' } });
    fireEvent.change(screen.getByLabelText(/Position Interested In/i), { target: { value: 'QA' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(screen.getByRole('button', { name: /Submitting/i })).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('Back to Home button is present and navigates', () => {
    renderForm();
    const backBtn = screen.getByRole('button', { name: /Back to Home/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn.closest('a')).toHaveAttribute('href', '/');
  });
});
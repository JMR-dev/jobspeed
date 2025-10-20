import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the job application form', () => {
    render(<App />);

    expect(screen.getByText(/job application form/i)).toBeInTheDocument();
    expect(
      screen.getByText(/fields marked with \* are required/i)
    ).toBeInTheDocument();
  });

  it('renders all form sections', () => {
    render(<App />);

    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    expect(screen.getByText(/work experience \*/i)).toBeInTheDocument();
    expect(screen.getAllByText(/education/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/certifications/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/skills \*/i)).toBeInTheDocument();
    expect(screen.getAllByText(/professional summary/i)[0]).toBeInTheDocument();
  });

  it('has a submit button', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: /submit application/i })
    ).toBeInTheDocument();
  });

  it('shows error when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill some but not all required fields to bypass HTML5 validation
    await user.click(screen.getByLabelText(/full name/i));
    await user.paste('John Doe');
    await user.click(screen.getByLabelText(/email/i));
    await user.paste('john@example.com');
    // Leave other required fields empty

    const submitButton = screen.getByRole('button', {
      name: /submit application/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please fill in all required personal information fields/i)
      ).toBeInTheDocument();
    });
  });

  it('shows error when work experience is missing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill in required personal info using paste for speed
    await user.click(screen.getByLabelText(/full name/i));
    await user.paste('John Doe');
    await user.click(screen.getByLabelText(/email/i));
    await user.paste('john@example.com');
    await user.click(screen.getByLabelText(/phone/i));
    await user.paste('+12345678901');
    await user.click(screen.getByLabelText(/address/i));
    await user.paste('123 Main St');
    await user.click(screen.getByLabelText(/city/i));
    await user.paste('New York');
    await user.click(screen.getByLabelText(/state/i));
    await user.paste('NY');
    await user.click(screen.getByLabelText(/zip code/i));
    await user.paste('12345');
    await user.click(screen.getByLabelText(/country/i));
    await user.paste('USA');

    const submitButton = screen.getByRole('button', {
      name: /submit application/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please add at least one work experience entry/i)
      ).toBeInTheDocument();
    });
  });

  it('shows error when skills are missing', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill in required personal info using paste for speed
    await user.click(screen.getByLabelText(/full name/i));
    await user.paste('John Doe');
    await user.click(screen.getByLabelText(/email/i));
    await user.paste('john@example.com');
    await user.click(screen.getByLabelText(/phone/i));
    await user.paste('+12345678901');
    await user.click(screen.getByLabelText(/address/i));
    await user.paste('123 Main St');
    await user.click(screen.getByLabelText(/city/i));
    await user.paste('New York');
    await user.click(screen.getByLabelText(/state/i));
    await user.paste('NY');
    await user.click(screen.getByLabelText(/zip code/i));
    await user.paste('12345');
    await user.click(screen.getByLabelText(/country/i));
    await user.paste('USA');

    // Add work experience
    await user.click(screen.getByText(/add work experience/i));

    const submitButton = screen.getByRole('button', {
      name: /submit application/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/please add at least one skill/i);
    });
  });

  it('increments application count in localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill in all required fields using paste for speed
    await user.click(screen.getByLabelText(/full name/i));
    await user.paste('John Doe');
    await user.click(screen.getByLabelText(/email/i));
    await user.paste('john@example.com');
    await user.click(screen.getByLabelText(/phone/i));
    await user.paste('+12345678901');
    await user.click(screen.getByLabelText(/address/i));
    await user.paste('123 Main St');
    await user.click(screen.getByLabelText(/city/i));
    await user.paste('New York');
    await user.click(screen.getByLabelText(/state/i));
    await user.paste('NY');
    await user.click(screen.getByLabelText(/zip code/i));
    await user.paste('12345');
    await user.click(screen.getByLabelText(/country/i));
    await user.paste('USA');

    // Add work experience
    await user.click(screen.getByText(/add work experience/i));
    const companyInputs = screen.getAllByLabelText(/company/i);
    await user.click(companyInputs[0]!);
    await user.paste('Acme Corp');

    // Add skill
    const skillInput = screen.getByLabelText(/add a skill/i);
    await user.click(skillInput);
    await user.paste('JavaScript');
    await user.click(screen.getByRole('button', { name: /^add$/i }));

    // Submit
    const submitButton = screen.getByRole('button', {
      name: /submit application/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(localStorageMock.getItem('applicationCount')).toBe('1');
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalInfoForm from './PersonalInfoForm';
import { ResumeData } from '../types';

describe('PersonalInfoForm', () => {
  const mockData: ResumeData['personalInfo'] = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    linkedIn: '',
    github: '',
    website: '',
  };

  const mockOnChange = vi.fn();

  it('renders all required fields', () => {
    render(<PersonalInfoForm data={mockData} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('renders optional fields', () => {
    render(<PersonalInfoForm data={mockData} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/linkedin profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/github profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personal website/i)).toBeInTheDocument();
  });

  it('calls onChange when full name is entered', async () => {
    const user = userEvent.setup();
    render(<PersonalInfoForm data={mockData} onChange={mockOnChange} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.type(fullNameInput, 'John Doe');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays validation helper text', () => {
    render(<PersonalInfoForm data={mockData} onChange={mockOnChange} />);

    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/include country code \(e\.g\., \+1 for us\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/enter 5-digit zip code/i)).toBeInTheDocument();
  });

  it('populates fields with existing data', () => {
    const existingData: ResumeData['personalInfo'] = {
      ...mockData,
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+12345678901',
    };

    render(<PersonalInfoForm data={existingData} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+12345678901')).toBeInTheDocument();
  });
});

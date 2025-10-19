import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkExperienceForm from './WorkExperienceForm';
import { ResumeData } from '../types';

describe('WorkExperienceForm', () => {
  const mockData: ResumeData['workExperience'] = [];
  const mockOnChange = vi.fn();

  it('renders with no work experience entries', () => {
    render(<WorkExperienceForm data={mockData} onChange={mockOnChange} />);

    expect(screen.getByText(/work experience \*/i)).toBeInTheDocument();
    expect(screen.getByText(/add work experience/i)).toBeInTheDocument();
  });

  it('adds a work experience entry when button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkExperienceForm data={mockData} onChange={mockOnChange} />);

    const addButton = screen.getByText(/add work experience/i);
    await user.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
      },
    ]);
  });

  it('renders existing work experience entries', () => {
    const existingData: ResumeData['workExperience'] = [
      {
        company: 'Acme Corp',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        description: 'Developed features',
        current: false,
      },
    ];

    render(<WorkExperienceForm data={existingData} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2020-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Developed features')).toBeInTheDocument();
  });

  it('shows delete button for each entry', () => {
    const existingData: ResumeData['workExperience'] = [
      {
        company: 'Test Company',
        position: 'Developer',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
        description: 'Test description',
        current: false,
      },
    ];

    render(<WorkExperienceForm data={existingData} onChange={mockOnChange} />);

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('disables end date when current is checked', () => {
    const existingData: ResumeData['workExperience'] = [
      {
        company: 'Current Co',
        position: 'Engineer',
        startDate: '2023-01-01',
        endDate: '',
        description: 'Current job',
        current: true,
      },
    ];

    render(<WorkExperienceForm data={existingData} onChange={mockOnChange} />);

    const endDateInput = screen.getByLabelText(/end date/i);
    expect(endDateInput).toBeDisabled();
  });

  it('displays the current job checkbox', () => {
    const existingData: ResumeData['workExperience'] = [
      {
        company: 'Company',
        position: 'Position',
        startDate: '2023-01-01',
        endDate: '',
        description: 'Description',
        current: false,
      },
    ];

    render(<WorkExperienceForm data={existingData} onChange={mockOnChange} />);

    expect(screen.getByText(/i currently work here/i)).toBeInTheDocument();
  });
});

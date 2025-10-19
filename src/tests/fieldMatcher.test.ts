import { describe, it, expect } from 'vitest';
import { FieldMatcher } from '../services/fieldMatcher';
import type { ResumeData, FormField } from '../types';

describe('FieldMatcher', () => {
  const mockResumeData: ResumeData = {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      linkedIn: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.com',
    },
    workExperience: [
      {
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: '2023-12',
        description: 'Built amazing things',
        current: true,
      },
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2019-05',
        gpa: '3.8',
      },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    summary: 'Experienced software developer with 5+ years of experience.',
  };

  const createMockField = (
    label: string,
    name: string,
    id: string
  ): FormField => ({
    element: document.createElement('input'),
    type: 'text',
    name,
    id,
    label,
    value: '',
  });

  it('should match full name field', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField('Full Name', 'fullName', 'full-name');
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    const firstMapping = mappings[0];
    expect(firstMapping).toBeDefined();
    if (firstMapping) {
      expect(firstMapping.value).toBe('John Doe');
    }
  });

  it('should match email field', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField('Email Address', 'email', 'email-input');
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.value).toBe('john.doe@example.com');
  });

  it('should match phone field', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField('Phone Number', 'phone', 'phone-input');
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.value).toBe('555-123-4567');
  });

  it('should match company field with latest work experience', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField(
      'Current Company',
      'company',
      'company-input'
    );
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.value).toBe('Tech Corp');
  });

  it('should match first name field', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField('First Name', 'firstName', 'first-name');
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.value).toBe('John');
  });

  it('should match last name field', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const field = createMockField('Last Name', 'lastName', 'last-name');
    const mappings = matcher.matchFields([field]);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.value).toBe('Doe');
  });

  it('should not match fields with empty values', () => {
    const emptyResumeData: ResumeData = {
      ...mockResumeData,
      personalInfo: {
        ...mockResumeData.personalInfo,
        fullName: '',
        email: '',
      },
    };

    const matcher = new FieldMatcher(emptyResumeData);
    const fields = [
      createMockField('Full Name', 'fullName', 'full-name'),
      createMockField('Email', 'email', 'email'),
    ];
    const mappings = matcher.matchFields(fields);

    expect(mappings).toHaveLength(0);
  });

  it('should match multiple fields correctly', () => {
    const matcher = new FieldMatcher(mockResumeData);
    const fields = [
      createMockField('Full Name', 'fullName', 'full-name'),
      createMockField('Email', 'email', 'email'),
      createMockField('Phone', 'phone', 'phone'),
      createMockField('City', 'city', 'city'),
    ];
    const mappings = matcher.matchFields(fields);

    expect(mappings).toHaveLength(4);
    expect(mappings[0]?.value).toBe('John Doe');
    expect(mappings[1]?.value).toBe('john.doe@example.com');
    expect(mappings[2]?.value).toBe('555-123-4567');
    expect(mappings[3]?.value).toBe('San Francisco');
  });
});

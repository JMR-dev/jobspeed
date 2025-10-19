export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    linkedIn?: string;
    website?: string;
  };
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  summary?: string;
}

export interface Message {
  type: string;
  data?: unknown;
}

export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface FormField {
  element: HTMLElement;
  type: string;
  name: string;
  id: string;
  label: string;
  value: string;
  suggestedValue?: string;
  confidence?: number;
}

export interface FieldMapping {
  field: FormField;
  mappedTo: string;
  value: string;
}

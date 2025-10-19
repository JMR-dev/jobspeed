export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
    linkedIn?: string;
    github?: string;
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
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    graduationDate: string;
    gpa?: string;
  }>;
  certifications?: Array<{
    certificationName: string;
    acquiredDate: string;
    areaOfExpertise?: string;
  }>;
  skills: string[];
  summary?: string;
}

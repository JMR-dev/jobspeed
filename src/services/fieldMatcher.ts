import type { ResumeData, FormField, FieldMapping } from '../types';

export class FieldMatcher {
  private resumeData: ResumeData;

  constructor(resumeData: ResumeData) {
    this.resumeData = resumeData;
  }

  matchFields(fields: FormField[]): FieldMapping[] {
    const mappings: FieldMapping[] = [];

    for (const field of fields) {
      const mapping = this.findBestMatch(field);
      if (mapping) {
        mappings.push(mapping);
      }
    }

    return mappings;
  }

  private findBestMatch(field: FormField): FieldMapping | null {
    const fieldText = this.normalizeText(
      `${field.label} ${field.name} ${field.id}`
    );

    // Personal Info mappings - check specific names first before generic "name"
    if (this.matchesAny(fieldText, ['first name', 'firstname', 'given name'])) {
      const firstName =
        this.resumeData.personalInfo.fullName.split(' ')[0] || '';
      return this.createMapping(field, 'personalInfo.firstName', firstName);
    }

    if (
      this.matchesAny(fieldText, [
        'last name',
        'lastname',
        'surname',
        'family name',
      ])
    ) {
      const parts = this.resumeData.personalInfo.fullName.split(' ');
      const lastName = parts[parts.length - 1] || '';
      return this.createMapping(field, 'personalInfo.lastName', lastName);
    }

    if (this.matchesAny(fieldText, ['full name', 'fullname', 'name'])) {
      return this.createMapping(
        field,
        'personalInfo.fullName',
        this.resumeData.personalInfo.fullName
      );
    }

    if (this.matchesAny(fieldText, ['email', 'e-mail', 'mail'])) {
      return this.createMapping(
        field,
        'personalInfo.email',
        this.resumeData.personalInfo.email
      );
    }

    if (this.matchesAny(fieldText, ['phone', 'telephone', 'mobile', 'cell'])) {
      return this.createMapping(
        field,
        'personalInfo.phone',
        this.resumeData.personalInfo.phone
      );
    }

    if (this.matchesAny(fieldText, ['address', 'street'])) {
      return this.createMapping(
        field,
        'personalInfo.address',
        this.resumeData.personalInfo.address
      );
    }

    if (this.matchesAny(fieldText, ['city', 'town'])) {
      return this.createMapping(
        field,
        'personalInfo.city',
        this.resumeData.personalInfo.city
      );
    }

    if (this.matchesAny(fieldText, ['state', 'province', 'region'])) {
      return this.createMapping(
        field,
        'personalInfo.state',
        this.resumeData.personalInfo.state
      );
    }

    if (
      this.matchesAny(fieldText, [
        'zip',
        'postal',
        'postcode',
        'zip code',
        'postal code',
      ])
    ) {
      return this.createMapping(
        field,
        'personalInfo.zipCode',
        this.resumeData.personalInfo.zipCode
      );
    }

    if (this.matchesAny(fieldText, ['country'])) {
      return this.createMapping(
        field,
        'personalInfo.country',
        this.resumeData.personalInfo.country
      );
    }

    if (this.matchesAny(fieldText, ['linkedin', 'linked in', 'linkedin url'])) {
      return this.createMapping(
        field,
        'personalInfo.linkedIn',
        this.resumeData.personalInfo.linkedIn || ''
      );
    }

    if (this.matchesAny(fieldText, ['website', 'portfolio', 'url'])) {
      return this.createMapping(
        field,
        'personalInfo.website',
        this.resumeData.personalInfo.website || ''
      );
    }

    // Work Experience
    if (
      this.matchesAny(fieldText, [
        'company',
        'employer',
        'organization',
        'current company',
      ])
    ) {
      const latestJob = this.resumeData.workExperience[0];
      return this.createMapping(
        field,
        'workExperience.company',
        latestJob?.company || ''
      );
    }

    if (
      this.matchesAny(fieldText, [
        'position',
        'title',
        'job title',
        'role',
        'current position',
      ])
    ) {
      const latestJob = this.resumeData.workExperience[0];
      return this.createMapping(
        field,
        'workExperience.position',
        latestJob?.position || ''
      );
    }

    // Education
    if (
      this.matchesAny(fieldText, [
        'school',
        'university',
        'college',
        'institution',
      ])
    ) {
      const latestEd = this.resumeData.education[0];
      return this.createMapping(
        field,
        'education.institution',
        latestEd?.institution || ''
      );
    }

    if (this.matchesAny(fieldText, ['degree', 'qualification'])) {
      const latestEd = this.resumeData.education[0];
      return this.createMapping(
        field,
        'education.degree',
        latestEd?.degree || ''
      );
    }

    if (
      this.matchesAny(fieldText, [
        'major',
        'field of study',
        'study',
        'specialization',
      ])
    ) {
      const latestEd = this.resumeData.education[0];
      return this.createMapping(
        field,
        'education.field',
        latestEd?.field || ''
      );
    }

    if (this.matchesAny(fieldText, ['gpa'])) {
      const latestEd = this.resumeData.education[0];
      return this.createMapping(field, 'education.gpa', latestEd?.gpa || '');
    }

    // Skills
    if (this.matchesAny(fieldText, ['skills', 'skill'])) {
      return this.createMapping(
        field,
        'skills',
        this.resumeData.skills.join(', ')
      );
    }

    // Summary/Cover Letter
    if (
      this.matchesAny(fieldText, [
        'summary',
        'about',
        'bio',
        'cover letter',
        'objective',
        'introduction',
      ])
    ) {
      return this.createMapping(
        field,
        'summary',
        this.resumeData.summary || ''
      );
    }

    return null;
  }

  private matchesAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().replace(/[_-]/g, ' ').trim();
  }

  private createMapping(
    field: FormField,
    mappedTo: string,
    value: string
  ): FieldMapping | null {
    // Don't create mapping for empty values
    if (!value || value.trim() === '') {
      return null;
    }

    return {
      field,
      mappedTo,
      value,
    };
  }
}

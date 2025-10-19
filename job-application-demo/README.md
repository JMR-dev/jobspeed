# Job Application Demo

This is a sample job application form web app built with Vite, React, Material UI, and TypeScript. It demonstrates the structure and fields used by the JobSpeed extension.

## Features

- Material UI components for a polished, professional look
- Form validation matching the extension's `ResumeData` interface
- Required and optional fields as defined in the extension
- Incremental JSON file export with timestamps
- Sections for:
  - Personal Information (required)
  - Work Experience (required)
  - Education (optional)
  - Certifications (optional)
  - Skills (required)
  - Professional Summary (optional)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Usage

1. Fill in the form with your information
2. Required fields are marked with an asterisk (*)
3. Click "Submit Application" to download your data as a JSON file
4. The file will be saved as `job-application-{N}-{timestamp}.json`
   - `{N}` is an incrementing number
   - `{timestamp}` is the current date and time

## Field Requirements

The form matches the extension's `ResumeData` interface:

### Required Fields
- All personal information fields (except LinkedIn, GitHub, Website)
- At least one work experience entry
- At least one skill

### Optional Fields
- LinkedIn profile URL
- GitHub profile URL
- Personal website URL
- Education entries
- Certification entries
- Professional summary

## Testing

This project includes comprehensive test coverage with both unit tests and end-to-end tests.

### Unit Tests (Vitest)

Run unit tests for React components:

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test -- --run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

Unit tests cover:
- PersonalInfoForm component
- WorkExperienceForm component
- SkillsForm component
- App component integration

### End-to-End Tests (Playwright)

Run E2E tests that simulate real user interactions:

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# View test report
pnpm test:e2e:report
```

E2E tests cover:
- Complete form submission flow
- Form validation (email, phone, zip code, GPA)
- Adding and removing dynamic entries (work experience, education, etc.)
- Skills management
- File download functionality

## Integration with Main Project

This demo app is:
- Excluded from the main extension build
- Bootstrapped separately with its own `package.json`
- Included in the project's ESLint and Prettier configurations
- Using the same strict TypeScript settings as the main project

# JobSpeed - Job Application Auto-fill Extension

A Firefox browser extension that helps you auto-fill job applications using your resume data.

## Features

- 📄 **Resume Storage**: Upload and store your resume securely in the extension
- 🔍 **Smart Form Detection**: Automatically detect form fields on job application pages
- 👀 **Preview Mode**: See what content will be filled before applying changes
- ⚡ **One-Click Auto-fill**: Apply your resume data to forms with a single click
- 🎯 **Intelligent Matching**: Smart field matching based on labels and field names

## Tech Stack

- **TypeScript** (Strict mode)
- **Vite** - Fast build tool
- **Vitest** - Unit testing
- **ESLint** + **Prettier** - Code quality and formatting
- **Native Browser API** - Firefox WebExtensions API
- **PDF.js** - Client-side PDF parsing
- **Mammoth** - Client-side DOCX parsing
- **Turborepo** - Monorepo management

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Start extension development mode:

```bash
pnpm dev
```

3. Load the extension in Firefox:
   - Open Firefox
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `dist` folder

### Build for Production

```bash
pnpm build
```

The production-ready extension will be in the `dist` folder.

## Development

### Available Scripts

**Extension Scripts:**
- `pnpm dev` - Build and watch for changes
- `pnpm build` - Production build
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

**Turborepo Scripts (run tasks across all packages):**
- `pnpm turbo:build` - Build all packages in parallel with caching
- `pnpm turbo:test` - Run tests across all packages
- `pnpm turbo:lint` - Lint all packages
- `pnpm turbo:format` - Format all packages

**Advanced Turbo Commands:**
- `turbo run build --filter=job-application-demo` - Build only the demo app
- `turbo run test --force` - Skip cache and run all tests
- `turbo run build --dry` - See what would run without executing

### Project Structure

```
src/
├── manifest.json           # Extension manifest
├── background.ts           # Background service worker
├── content.ts              # Content script for page interaction
├── popup.ts                # Popup UI logic
├── popup.html              # Popup HTML
├── popup.css               # Popup styles
├── upload.tsx              # Resume upload UI (React)
├── upload.html             # Upload page HTML
├── types/
│   ├── index.ts            # Type definitions
│   └── browser.d.ts        # Browser API types
├── services/
│   ├── formDetector.ts     # Form field detection logic
│   └── fieldMatcher.ts     # Resume-to-field matching logic
└── utils/
    └── resumeParser.ts     # Client-side resume parsing (PDF, DOCX)

job-application-demo/       # Sample job application form (separate app)
```

### Client-Side Resume Parsing

The extension includes a built-in client-side resume parser that handles file parsing directly in the browser:

- Parses PDF files using PDF.js (Mozilla's PDF library)
- Parses DOCX files using Mammoth
- Extracts structured resume data (personal info, work experience, education, skills)
- All parsing happens locally in your browser
- No external servers or network requests required
- Works completely offline

The parser is located in `src/utils/resumeParser.ts` and is automatically used when you upload a resume through the extension.

### Demo Application

The `job-application-demo` folder contains a standalone sample job application form built with Vite, React, Material UI, and TypeScript. This demo app:

- Showcases the structure and fields used by the JobSpeed extension
- Uses the same `ResumeData` interface as the extension
- Saves submitted applications as incremental JSON files
- Is excluded from the main extension build
- Has its own `package.json` and can be run independently

To run the demo:

```bash
cd job-application-demo
pnpm install
pnpm dev
```

See [job-application-demo/README.md](job-application-demo/README.md) for more details.

## Usage

1. **Upload Your Resume**:
   - Click the JobSpeed extension icon
   - Click "Upload Resume"
   - Select your resume file (PDF or DOCX)
   - The extension will parse the file directly in your browser

2. **Auto-fill a Job Application**:
   - Navigate to a job application page
   - Click the JobSpeed extension icon
   - Click "Scan Current Page"
   - Review the suggested values in the preview panel
   - Click "Apply Auto-fill" to fill the form

## Features in Detail

### Resume Parsing

The extension parses your resume files directly in the browser and extracts key information:
- **Personal information** (name, email, phone, address)
- **Work experience**
- **Education**
- **Skills**
- **Professional summary**

Supported formats:
- **PDF** - Parsed using PDF.js (Mozilla's library)
- **DOCX** - Parsed using Mammoth

The parsed data is stored locally in your browser storage.

### Smart Field Matching

The field matcher uses intelligent algorithms to match resume data with form fields:
- Label-based matching
- Name/ID attribute matching
- Placeholder text matching
- Contextual matching (e.g., "current company", "most recent position")

### Privacy & Security

- All resume parsing happens **client-side** in your browser
- All parsed resume data is stored locally in your browser storage
- No data is sent to external servers or third parties
- Resume files are processed entirely in memory within the extension
- Works completely offline
- You have full control over your resume data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Your name here

# JobSpeed - AI Coding Agent Instructions

## Project Overview

JobSpeed is a Firefox browser extension (Manifest V3) that auto-fills job application forms using parsed resume data. Built with TypeScript (strict mode), Vite, and native Browser WebExtensions API. The project uses a Turborepo monorepo structure with two packages: the main extension and a demo React app for testing.

## Key Features

- 📄 **Resume Storage**: Upload and store resume (PDF/DOCX) securely in extension
- 🔍 **Smart Form Detection**: Automatically detect form fields on job application pages
- 👀 **Preview Mode**: See what content will be filled before applying changes
- ⚡ **One-Click Auto-fill**: Apply resume data to forms with a single click
- 🎯 **Intelligent Matching**: Smart field matching based on labels and field names

## Architecture & Data Flow

### Three-Script Extension Architecture
1. **Background Script** (`src/background.ts`): Service worker managing storage via `browser.storage.local`, message routing between popup and content scripts
2. **Content Script** (`src/content.ts`): Injected into web pages, detects forms, creates preview overlays, and fills fields
3. **Popup/Upload UI** (`src/popup.tsx`, `src/upload.tsx`): React-based UI for resume upload and extension control

**Critical Message Flow**: Popup → Background (storage operations) → Content (page manipulation). All inter-script communication uses `browser.runtime.sendMessage()` with async response handling (return `true` to keep channel open).

### Resume Parsing Pipeline
- **Input**: PDF/DOCX files via `upload.tsx`
- **Parsing**: `resumeParser.ts` → uses `pdfjs-dist` (worker configured at `import.meta.url`) and `mammoth` for extraction
- **Sectionization**: `parsers/sectionizer.ts` splits raw text into logical sections (header, summary, workExperience, education, skills) using keyword mapping
- **Storage**: Structured `ResumeData` interface stored in `browser.storage.local`

### Form Detection & Matching
- **Detection** (`services/formDetector.ts`): Queries visible, enabled text inputs/textareas/selects, extracts labels from `<label for="">`, parent labels, or nearby text
- **Matching** (`services/fieldMatcher.ts`): Fuzzy text matching on normalized field text (label + name + id) against `ResumeData` properties. Priority: specific fields (firstName, lastName) before generic (name)

## Monorepo Structure

### Turborepo Configuration
- **Root package**: Extension source in `src/`
- **Workspaces**: `job-application-demo/` (defined in `pnpm-workspace.yaml`)
- **Shared commands**: `pnpm turbo:build`, `pnpm turbo:test`, `pnpm turbo:lint` run tasks across all packages with caching
- **Filtering**: Use `--filter=job-application-demo` to target specific packages

### Demo App (`job-application-demo/`)
- **Purpose**: Material UI job application form matching extension's `ResumeData` interface for E2E testing
- **Testing**: Vitest for unit tests + Playwright for E2E (configs: `playwright.config.ts`, `vitest.config.ts`)
- **Build**: Standalone Vite app, runs on `localhost:5173` in dev mode

## Development Workflows

### Extension Development
```bash
pnpm dev                    # Watch mode, rebuilds to dist/ on changes
# Load in Firefox: about:debugging → Load Temporary Add-on → dist/manifest.json
# After changes: Click "Reload" in about:debugging (auto-rebuild in dev mode)
```

### Build Process Gotchas
- **Upload UI**: Separate React build via `scripts/build-upload.mjs` (runs after main build)
- **Icons**: Must manually copy via `pnpm copy:icons` (included in `pnpm build`)
- **Vite Plugin**: Uses `vite-plugin-web-extension` with Firefox browser target in `vite.config.ts`

### Testing Strategy
- **Extension Unit Tests**: `pnpm test` (root) - tests services like `fieldMatcher.test.ts`
- **Demo Unit Tests**: `cd job-application-demo && pnpm test` - tests React components
- **E2E Tests**: `cd job-application-demo && pnpm test:e2e` - Playwright tests against demo form
- **CI**: Uses custom Docker image (`ghcr.io/.../jobspeed-playwright-runner:latest`) with Node 22, pnpm 10.18.1, Playwright pre-installed

## Project-Specific Conventions

### TypeScript Patterns
- **Strict mode enabled** (`tsconfig.json`): All files must handle nullability, avoid `any`
- **Browser API types**: Reference `/// <reference types="firefox-webext-browser" />` at top of files using `browser.*` APIs
- **Type imports**: Use `import type` for interfaces/types (e.g., `import type { ResumeData } from './types'`)

### Message Handling Pattern
```typescript
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Async operations: MUST return true to keep channel open
  doAsyncWork().then(result => sendResponse({ success: true, data: result }));
  return true;
});
```

### Field Matching Order
`fieldMatcher.ts` checks specific fields before generic (e.g., `firstName`/`lastName` before `fullName`) to prevent incorrect matches. When adding new fields, place specific matchers before generic ones.

### CSS Isolation for Content Scripts
Preview panel uses `#jobspeed-` prefixed IDs and `.jobspeed-` classes to avoid conflicts with host page styles.

## Key Files & Patterns

- **`src/manifest.json`**: Manifest V3 config, defines permissions (`storage`, `activeTab`, `scripting`), host_permissions, and script loading
- **`turbo.json`**: Task dependency graph, defines `outputs` for caching (e.g., `dist/**`, `coverage/**`)
- **`pnpm-workspace.yaml`**: Defines workspace packages, includes `onlyBuiltDependencies: [esbuild]` for install optimization
- **`scripts/Dockerfile`**: Ubuntu 24.04 image for CI/CD Playwright tests, synced with `pnpm` version (10.18.1)

## Common Pitfalls

1. **PDF.js Worker Path**: Must configure `pdfjsLib.GlobalWorkerOptions.workerSrc` using `import.meta.url` (see `resumeParser.ts`)
2. **Extension Reload**: Changes to manifest.json require full extension reload (unload + re-load), not just "Reload" button
3. **Content Script Timing**: Content script may run before page DOM ready - check `document.readyState` or use `DOMContentLoaded`
4. **Turborepo Cache**: Use `turbo run build --force` to skip cache when troubleshooting build issues
5. **E2E Tests**: Require `pnpm dev` server running or CI webServer config in `playwright.config.ts`

## CI/CD Details

- **Status Checks** (`.github/workflows/status-checks.yml`): Runs extension unit tests, demo unit tests, and demo E2E tests on PRs
- **Playwright Image** (`.github/workflows/build-playwright-image.yml`): Auto-builds Docker image on Dockerfile changes, pushes to ghcr.io
- **Container Auth**: E2E job uses `${{ secrets.GITHUB_TOKEN }}` to pull private ghcr.io images

## Debugging Tips

- **Background logs**: Browser Console (Ctrl+Shift+J or about:debugging)
- **Content script logs**: Page Web Console (F12 on target page)
- **Popup logs**: Right-click extension icon → Inspect → Console
- **Storage inspection**: about:debugging → Storage tab or use `browser.storage.local.get()` in console

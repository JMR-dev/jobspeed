# Development Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development mode**:
   ```bash
   pnpm dev
   ```
   This watches for file changes and rebuilds automatically.

3. **Load in Firefox**:
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `dist/manifest.json`

4. **After making changes**:
   - The extension rebuilds automatically in dev mode
   - Click "Reload" in the Firefox debugging page

## Development Workflow

### Making Changes

1. Edit source files in `src/`
2. Run `pnpm build` or use `pnpm dev` (watch mode)
3. Reload the extension in Firefox
4. Test your changes

### Adding New Features

1. Create new service files in `src/services/`
2. Add type definitions in `src/types/`
3. Write tests in `src/tests/`
4. Run `pnpm test` to verify
5. Run `pnpm lint` to check code quality

### Testing

```bash
# Run tests once
pnpm test --run

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui
```

### Code Quality

```bash
# Check linting
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Debugging

### Console Logs

- **Background Script**: Check Browser Console (Ctrl+Shift+J)
- **Content Script**: Check Web Console on the page (F12)
- **Popup**: Right-click popup → Inspect

### Common Issues

1. **Extension not loading**: Check console for errors in manifest.json
2. **Content script not running**: Check host_permissions in manifest
3. **Storage not working**: Check permissions in manifest

## Browser API Reference

- [Firefox WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [storage.local](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local)
- [tabs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs)
- [scripting](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting)

## Project Files

### Core Files

- `src/background.ts` - Handles storage and message passing
- `src/content.ts` - Injects into web pages, handles form detection
- `src/popup.ts` - Popup UI logic
- `src/manifest.json` - Extension configuration

### Services

- `src/services/formDetector.ts` - Detects form fields
- `src/services/fieldMatcher.ts` - Matches fields to resume data

### Configuration

- `tsconfig.json` - TypeScript configuration (strict mode)
- `vite.config.ts` - Build configuration
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Formatting rules

## Tips

- Use TypeScript's strict mode features
- Write tests for new business logic
- Keep UI and business logic separate
- Use the native browser API (no polyfills needed)
- Follow the existing code style

## Packaging for Distribution

When ready to publish:

1. Update version in `package.json` and `src/manifest.json`
2. Run `pnpm build`
3. Test the `dist/` folder thoroughly
4. Create a zip of the `dist/` folder
5. Submit to [Firefox Add-ons](https://addons.mozilla.org/)

## Resources

- [MDN WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)

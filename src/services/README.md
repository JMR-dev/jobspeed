# DataManager - Read-Only Names Database

## Overview

The `DataManager` service provides access to a pre-populated, read-only SQLite database containing over 1.7 million unique first and last names. This database is used for enhanced name parsing and validation within the JobSpeed extension.

## Architecture

- **Database File**: `names.sqlite` (28MB) - Located in `/src` and copied to `/dist` during build
- **WASM Module**: `sql-wasm.wasm` - SQLite compiled to WebAssembly for browser use
- **Tables**:
  - `FirstNames`: 727,556 unique first names
  - `LastNames`: 983,825 unique last names

## Usage

### In Background Script

The DataManager is initialized automatically when the background script loads:

```typescript
import { DataManager } from './services/dataManager';

const dataManager = new DataManager();
await dataManager.init(); // Loads names.sqlite
```

### Querying Names

To retrieve all names from the database:

```typescript
const { firstNames, lastNames } = await dataManager.getAllNames();
console.log(`Found ${firstNames.length} first names`);
console.log(`Found ${lastNames.length} last names`);
```

### Via Message Passing (from Content Scripts)

Content scripts can request names data through the message passing API:

```typescript
// In content script
const response = await browser.runtime.sendMessage({
  type: 'GET_ALL_NAMES'
});

if (response.success) {
  const { firstNames, lastNames } = response.data;
  // Use the names data...
}
```

## Database Structure

### FirstNames Table
```sql
CREATE TABLE FirstNames (
  name TEXT PRIMARY KEY
);
```

### LastNames Table
```sql
CREATE TABLE LastNames (
  name TEXT PRIMARY KEY
);
```

## Build Process

The static files are copied during the build process:

1. `pnpm build` runs TypeScript compilation
2. Vite builds the extension
3. `copy:static` script copies `names.sqlite` and `sql-wasm.wasm` to `dist/`
4. Files are declared as `web_accessible_resources` in manifest.json

## Important Notes

1. **Read-Only**: The database is read-only from the extension's perspective. It cannot be modified at runtime.
2. **Pre-Populated**: The database must be populated before the extension is built. Use the migration script in `/db/migrate_names.py` to update it.
3. **Size**: The database is ~28MB. This is acceptable for an extension but should be noted in documentation.
4. **WASM Loading**: The sql.js WASM module is loaded asynchronously on first use.

## Updating the Database

To update the names database:

1. Navigate to `/db` directory
2. Update the source pickle files (`first_names.pkl.gz`, `last_names.pkl.gz`)
3. Run the migration script: `./migrate_names.py`
4. Copy the updated `names.sqlite` to `/src/names.sqlite`
5. Rebuild the extension: `pnpm build`

## Error Handling

The DataManager includes fallback behavior:

- If the database file fails to load, an empty in-memory database is created
- All errors are logged to the console
- Methods return empty arrays on failure to prevent crashes

## Performance

- **Initialization**: ~100-200ms (loads 28MB file + WASM)
- **Query Time**: <10ms for getAllNames() (no filtering)
- **Memory**: ~30MB additional memory usage when loaded

## Future Enhancements

Potential improvements:

1. Add filtering/search methods (e.g., `searchNames(query)`)
2. Implement caching to avoid repeated queries
3. Add statistics methods (e.g., `getNameCount()`)
4. Support for partial matches and fuzzy search

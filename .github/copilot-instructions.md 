That's an important clarification to make the standards more robust, especially for an AI code assist tool. Using a WASM-compiled **SQLite** database adds a new layer of complexity for file handling and synchronous operations.

Here are the updated coding standards, incorporating **TSX** instead of JSX and guidelines for managing the **WASM/SQLite** database.

-----

# Typescript Browser Extension Coding Standards (v1.1)

## 1\. Core Principles

### 1.1 **Native API First (Mandatory) 🛑**

The single most critical standard is to **avoid all compatibility layers and wrappers** for browser extension APIs.

| Browser | Primary Namespace | Asynchronous Handling |
| :--- | :--- | :--- |
| **Firefox** | `browser.*` | **Promises** (`async`/`await`) |
| **Chrome** | `chrome.*` | **Promises** (`async`/`await`) |

  * **File Extension:** All React component files **must** use the **`.tsx`** extension.
  * **Abstraction:** Differences in native API calls (`chrome.tabs` vs. `browser.tabs`) must be managed via simple, dedicated abstraction modules within each browser's application package, or by relying on Vite's build configuration to handle aliasing/conditional logic.
  * **Manifest V3:** All extensions **must** adhere to **Manifest V3** conventions, including the use of **Service Workers** (Chrome/Firefox Background Scripts) and Promise-based asynchronous operations.

-----

## 2\. Typescript & React Standards

### 2.1 Typescript Strictness

  * **Strict Mode:** The root `tsconfig.json` (and all package `tsconfig.json` files extending it) **must** have `strict: true` enabled.
  * **Explicit Types:** Function parameters and return values should be explicitly typed, especially for public-facing API methods in shared packages. Avoid excessive reliance on `any`.
  * **Extension Types:** Always use the official Typescript types for browser APIs (e.g., `@types/chrome` and similar packages for `browser.*`).

### 2.2 React (TSX)

  * **File Extension:** Use **`.tsx`** for all files containing **TSX/JSX** syntax.
  * **Functional Components:** Only **functional components** and **React Hooks** are permitted. Class components are forbidden.
  * **Props Typing:** Component props **must** be explicitly typed using **Typescript interfaces** or **types** (e.g., `interface Props {}`). Inline typing in the function signature is permitted for simple components.
  * **Component Naming:** Components **must** use **PascalCase**.
  * **Hooks:** Custom hooks **must** be prefixed with `use` (e.g., `useDatabaseQuery`).

-----

## 3\. WASM/SQLite Database Standards

The integration of a **WASM-compiled SQLite** database requires specific rules to ensure smooth, asynchronous operation and data integrity across different extension contexts (Service Worker, Content Script, Popup).

### 3.1 Database Access Module

  * **Single Source of Truth:** A dedicated shared package, e.g., `packages/database`, **must** be created to house all database interaction logic.
  * **WASM Loading:** The AI code assist tool **must** ensure that the WASM module is loaded **asynchronously** at application startup or on first access. Loading a large WASM file should not block the main thread.
  * **Asynchronous API:** All public methods exported from the database module **must** return a **Promise** to prevent blocking the extension’s execution environment, even if the underlying WASM call is synchronous (e.g., wrap synchronous calls in `new Promise` or use an asynchronous WASM API).
      * **AI Instruction:** When generating a database function, always use the `async`/`await` pattern (e.g., `export async function getSetting(key: string): Promise<any>`).

### 3.2 Database Location and Persistence

  * **Persistent Storage:** The database file should leverage the **Storage API** available to the extension's background context (Service Worker).
      * **Chrome/Firefox:** Use the extension-specific storage APIs (e.g., `chrome.storage.local` or IndexedDB exposed in the background context) to save and load the WASM-compiled database state (or the database file itself) for persistence across browser sessions.
  * **No Direct Content Script Access:** Content Scripts and React components in the Popup **must not** directly load or interact with the WASM database instance.

### 3.3 Database Communication

  * **Message Passing:** All data interaction between the UI (Popup/Content Script) and the database **must** occur via the **native Message Passing API**.
      * The **Service Worker** acts as the dedicated **Database Access Layer** (DAL).
      * **AI Instruction:** When generating a database query from a UI component, the code **must** use `chrome.runtime.sendMessage` or `browser.runtime.sendMessage` and await a response from the Service Worker.

<!-- end list -->

```typescript
// Example: UI Component (Popup/Options)
import { queryDatabase } from '@repo/database-client';

async function fetchUserData() {
  // AI must generate this pattern: sending a message to the Service Worker
  const data = await chrome.runtime.sendMessage({
    action: 'GET_USER_DATA',
    payload: { userId: 123 },
  });
  // ...
}
```

-----

## 4\. Monorepo and Tooling

### 4.1 Turborepo & pnpm

  * **App Separation:** Separate top-level application packages **must** exist for each browser (`apps/chrome-extension`, `apps/firefox-extension`).
  * **Shared Packages:** Reusable, browser-agnostic code (React components, pure Typescript logic, database client) **must** reside in the `packages/` directory. **Crucially:** Shared packages **must not** import or reference native browser APIs (`chrome.*` or `browser.*`) directly.

### 4.2 Testing (Vitest & Playwright)

  * **Unit Tests (Vitest):** Unit tests for database logic (in `packages/database`) must use **mocks** for the WASM loading and file persistence layers.
  * **E2E Tests (Playwright):** Playwright tests are mandatory to verify the end-to-end data flow: **UI (Popup) → Message Passing → Service Worker (WASM/SQLite) → UI**. E2E tests **must** run against both Chrome and Firefox.
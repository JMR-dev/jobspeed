// /jobspeed/src/services/dataManager.ts

/// <reference types="firefox-webext-browser" />

import initSqlJs, { Database } from 'sql.js';

// The path to the WASM library and the static, read-only database file
const SQL_WASM_PATH = '/sql-wasm.wasm';
const NAMES_DB_PATH = '/names.sqlite';

// Define the structure for your split name data
export interface NameData {
  firstName: string;
  lastName: string;
}

export class DataManager {
  private db: Database | null = null;
  private SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;

  /**
   * Initializes the SQLite database by loading the pre-configured names.sqlite file.
   */
  public async init(): Promise<void> {
    if (this.db) return; // Already initialized

    try {
      if (!this.SQL) {
        // 1. Load the sql.js library
        this.SQL = await initSqlJs({
          locateFile: (_file: string) => browser.runtime.getURL(SQL_WASM_PATH),
        });
      }

      // 2. Fetch the pre-configured database file
      const dbResponse = await fetch(browser.runtime.getURL(NAMES_DB_PATH));
      if (!dbResponse.ok) {
        throw new Error(`Failed to load database file: ${dbResponse.statusText}`);
      }

      // 3. Load the file content into the WASM database instance
      const dbArrayBuffer = await dbResponse.arrayBuffer();
      const dbUint8Array = new Uint8Array(dbArrayBuffer);

      // Create database from the existing data
      this.db = new this.SQL.Database(dbUint8Array);
      console.log('Static names.sqlite loaded successfully.');
    } catch (error) {
      console.error('Error initializing static SQLite WASM database:', error);
      // Fallback: If the file fails to load, create an empty one for minimal function.
      if (this.SQL) {
        this.db = new this.SQL.Database();
      }
    }
  }

  /**
   * Retrieves all unique first and last names from the static tables.
   */
  public async getAllNames(): Promise<{
    firstNames: string[];
    lastNames: string[];
  }> {
    if (!this.db) {
      await this.init(); // Ensure it's initialized before querying
    }

    try {
      const firstResult = this.db!.exec('SELECT name FROM FirstNames');
      const lastResult = this.db!.exec('SELECT name FROM LastNames');

      // Extract names from the result object structure
      const firstNames =
        firstResult[0]?.values.map((row: unknown[]) => row[0] as string) || [];
      const lastNames =
        lastResult[0]?.values.map((row: unknown[]) => row[0] as string) || [];

      return { firstNames, lastNames };
    } catch (e) {
      console.error('Error querying static names database:', e);
      return { firstNames: [], lastNames: [] };
    }
  }

  // NOTE: The method `storeNames` is removed as the database is read-only from the app's perspective.
}

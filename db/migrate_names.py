#!/usr/bin/env python
# migrate_names.py

import pandas as pd
from sqlalchemy import create_engine

# --- Configuration ---
FIRST_NAMES_FILE = 'first_names.pkl.gz' # Replace with your actual file name
LAST_NAMES_FILE = 'last_names.pkl.gz'   # Replace with your actual file name
DB_FILE = 'names.sqlite'  # Single database for both tables                

def migrate_names_to_sqlite():
    """
    Loads data from compressed pickle files and inserts them into SQLite tables.
    """
    try:
        # 1. Load Data from .pkl.gz Files using pandas
        # pandas.read_pickle automatically handles .gz decompression
        print(f"Loading first names from {FIRST_NAMES_FILE}...")
        
        # Verify file is actually a pickle (not HTML)
        import gzip
        with gzip.open(FIRST_NAMES_FILE, 'rb') as f:
            header = f.read(100)
            if header.startswith(b'<!DOCTYPE') or header.startswith(b'<html'):
                print(f"Error: {FIRST_NAMES_FILE} appears to be an HTML file, not a pickle file.")
                print("Please download the actual data file, not the GitHub HTML page.")
                return
        
        first_names_data = pd.read_pickle(FIRST_NAMES_FILE, compression='gzip')

        print(f"Loading last names from {LAST_NAMES_FILE}...")
        last_names_data = pd.read_pickle(LAST_NAMES_FILE, compression='gzip')
        
    except FileNotFoundError as e:
        print(f"Error: Required file not found: {e}")
        return
    except Exception as e:
        print(f"Error loading pickle files: {e}")
        print("\nTip: Make sure these are actual pickle files, not HTML pages.")
        print("If downloaded from GitHub, use 'Raw' button or download via releases.")
        return

    # Assuming the loaded data is a simple list or array of names.
    # If it's a dictionary or DataFrame, you may need to adjust this step.
    
    # 2. Convert to DataFrame (Required format for pandas to_sql)
    # Ensure all names are capitalized consistently (e.g., Title Case)
    first_names_df = pd.DataFrame(
        {'name': [str(n).strip().title() for n in first_names_data if n]}
    ).drop_duplicates()
    
    last_names_df = pd.DataFrame(
        {'name': [str(n).strip().title() for n in last_names_data if n]}
    ).drop_duplicates()

    # 3. Create SQLAlchemy Engine for SQLite connection (single database for both tables)
    # The 'sqlite:///' prefix tells SQLAlchemy to connect to a local file
    engine = create_engine(f'sqlite:///{DB_FILE}')
    
    print(f"Connecting to SQLite database: {DB_FILE}...")

    try:
        # 4. Insert into SQLite Tables (both in same database)
        # Use chunksize to avoid SQLite's limit on SQL variables (SQLITE_MAX_VARIABLE_NUMBER)
        CHUNK_SIZE = 500
        
        # Insert First Names in chunks
        print(f"Inserting {len(first_names_df)} first names in chunks of {CHUNK_SIZE}...")
        first_names_df.to_sql(
            'FirstNames', 
            con=engine, 
            if_exists='replace',  # Replace existing table
            index=False, 
            chunksize=CHUNK_SIZE
        )
        print(f"Successfully inserted {len(first_names_df)} unique first names.")

        # Insert Last Names in chunks
        print(f"Inserting {len(last_names_df)} last names in chunks of {CHUNK_SIZE}...")
        last_names_df.to_sql(
            'LastNames', 
            con=engine, 
            if_exists='replace',  # Replace existing table
            index=False, 
            chunksize=CHUNK_SIZE
        )
        print(f"Successfully inserted {len(last_names_df)} unique last names.")
        
    except Exception as e:
        print(f"Error during database insertion: {e}")
        print("Note: If the tables already exist with a PRIMARY KEY constraint, duplicate entries might cause this error. 'append' should handle new records, but check your schema if it fails.")

if __name__ == '__main__':
    migrate_names_to_sqlite()
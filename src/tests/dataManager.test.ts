// Test script for DataManager - to be run in browser console or as a test
// This demonstrates how to use the DataManager to query names

import { DataManager } from '../services/dataManager';

async function testDataManager() {
  console.log('Testing DataManager...');
  
  const dataManager = new DataManager();
  
  try {
    // Initialize the database
    await dataManager.init();
    console.log('✓ DataManager initialized');
    
    // Get all names
    const { firstNames, lastNames } = await dataManager.getAllNames();
    console.log(`✓ Retrieved ${firstNames.length} first names`);
    console.log(`✓ Retrieved ${lastNames.length} last names`);
    
    // Show some samples
    console.log('Sample first names:', firstNames.slice(0, 5));
    console.log('Sample last names:', lastNames.slice(0, 5));
    
    // Test querying for specific names
    const hasJason = firstNames.includes('Jason');
    const hasRoss = lastNames.includes('Ross');
    console.log(`✓ Contains "Jason": ${hasJason}`);
    console.log(`✓ Contains "Ross": ${hasRoss}`);
    
    console.log('✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for use in tests
export { testDataManager };

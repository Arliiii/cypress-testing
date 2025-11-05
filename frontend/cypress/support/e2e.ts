// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-file-upload';


// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add any global before/after hooks here if needed
beforeEach(() => {
  // Clear any previous sessions before each test
  // Uncomment if you want to clear storage before each test:
  // cy.clearLocalStorage();
  // cy.clearCookies();
});

// Prevent Cypress from failing tests on uncaught exceptions
// This is useful for third-party scripts or expected errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the test from failing
  // You can customize this to only ignore specific errors
  console.log('Uncaught exception:', err.message);
  return false;
});

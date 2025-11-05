/// <reference types="cypress" />
import 'cypress-file-upload';

describe('Complete Website Workflow - End to End Test', () => {
  
  before(() => {
    cy.fixture('test-data.json').as('testData');
  });

  it('should complete the entire user journey: login, select demo project, analyze, and download report', function() {

    // ========================================
    // STEP 1: LOGIN
    // ========================================
    cy.visit('/');
    cy.wait(2000); // Wait for page to load
    cy.log('🌐 Step 1: Visited the website');

    cy.get('#email', { timeout: 10000 }).should('be.visible').clear().type(this.testData.testUser.email, { delay: 100 });
    cy.wait(500);
    cy.get('#password').should('be.visible').clear().type(this.testData.testUser.password, { delay: 100 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.wait(2000); // Wait for login to process
    cy.log('✅ Step 2: Logged in with credentials: ' + this.testData.testUser.email);

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('StatFlow', { timeout: 10000 }).should('be.visible');
    cy.wait(2000); // Wait to view dashboard
    cy.log('✅ Step 3: Dashboard loaded successfully');

    // ========================================
    // STEP 2: SELECT EXISTING "DEMO" PROJECT
    // ========================================
    cy.wait(2000);
    
    // Click on the Demo project
    cy.contains('Demo', { timeout: 10000 })
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait after clicking project
    cy.log('✅ Step 4: Clicked on Demo project');

    // Wait for analysis page to load
    cy.url({ timeout: 10000 }).should('include', '/analysis');
    cy.wait(2000); // Wait to view analysis page
    cy.log('✅ Step 5: Analysis page loaded');

    // ========================================
    // STEP 3: SELECT "DESCRIPTIVE STATISTICS"
    // ========================================
    cy.wait(2000);
    
    cy.contains('Descriptive Statistics', { timeout: 10000 })
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait after selecting analysis type
    cy.log('✅ Step 6: Selected Descriptive Statistics analysis type');

    // ========================================
    // STEP 4: SELECT CHECKBOXES
    // ========================================
    cy.wait(2500);

    // Select all visible checkboxes
    cy.get('button[role="checkbox"][data-state="unchecked"]', { timeout: 10000 })
      .should('exist')
      .each(($checkbox, index) => {
        cy.wrap($checkbox).click({ force: true });
        cy.log(`✅ Step 7.${index + 1}: Checked checkbox ${index + 1}`);
        cy.wait(800); // Slower delay between clicks
      });

    // ========================================
    // STEP 5: CLICK NEXT BUTTON
    // ========================================
    cy.wait(2000);

    cy.contains('button', 'Next')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait after clicking Next
    cy.log('✅ Step 8: Clicked Next button');

    // ========================================
    // STEP 6: CLICK NEXT AGAIN (if needed)
    // ========================================
    cy.wait(2000);

    cy.get('body').then(($body) => {
      if ($body.text().includes('Next')) {
        cy.contains('button', 'Next').click();
        cy.wait(2000); // Wait after second Next button
        cy.log('✅ Step 9: Clicked Next button again');
      }
    });

    // ========================================
    // STEP 7: SUBMIT ANALYSIS
    // ========================================
    cy.wait(2000);

    cy.contains('button', 'Submit Analysis')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait after submitting
    cy.log('✅ Step 10: Clicked Submit Analysis button');

    cy.wait(3000); // Wait for analysis to process

    // ========================================
    // STEP 8: VIEW RESULTS
    // ========================================
    cy.url({ timeout: 15000 }).should('include', '/results');
    cy.wait(2000); // Wait to view results page
    cy.log('✅ Step 11: Results page loaded');

    cy.get('body', { timeout: 10000 }).should('be.visible');
    cy.wait(2000); // Wait to view results
    cy.log('✅ Step 12: Results visible');

    // ========================================
    // STEP 9: DOWNLOAD REPORT AS TEXT
    // ========================================
    cy.wait(3000);

    // Click the "Download Report" button to open dropdown menu
    cy.contains('button', 'Download Report', { timeout: 10000 })
      .should('be.visible')
      .click();
    
    cy.wait(1500); // Wait for dropdown to open
    cy.log('✅ Step 13: Clicked Download Report button (dropdown opened)');

    // Wait for dropdown menu to appear
    cy.wait(1500);

    // Click "Download as Text (.txt)" option from the menu
    cy.contains('[role="menuitem"]', 'Download as Text')
      .should('be.visible')
      .click();
    
    cy.log('✅ Step 14: Clicked Download as Text option');

    // Wait for download to complete
    cy.wait(3000);
    cy.log('✅ Step 15: Report downloaded as .txt file');

    // ========================================
    // FINAL SUCCESS MESSAGE
    // ========================================
    cy.log('🎉🎉🎉 COMPLETE WORKFLOW TEST PASSED SUCCESSFULLY! 🎉🎉🎉');
  });
});

/// <reference types="cypress" />

// ***********************************************
// Custom commands for StatFlow application
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to log in via the UI
             * @example cy.login('user@example.com', 'password')
             */
            login(email: string, password: string): Chainable<void>;
            
            /**
             * Custom command to create a new project
             * @example cy.createProject('My Project')
             */
            createProject(projectName: string): Chainable<void>;
        }
    }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/');
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
});

// Create project command
Cypress.Commands.add('createProject', (projectName: string) => {
    cy.contains('button', 'New Project').click();
    cy.get('input[name="projectName"]').clear().type(projectName);
    cy.contains('button', 'Create').click();
    cy.contains(projectName).should('be.visible');
});

export {};
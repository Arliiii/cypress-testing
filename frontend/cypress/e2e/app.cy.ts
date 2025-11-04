describe('Application End-to-End Tests', () => {
    it('should load the homepage', () => {
        cy.visit('/');
        cy.contains('Welcome to the App');
    });

    it('should navigate to the about page', () => {
        cy.visit('/');
        cy.get('a[href="/about"]').click();
        cy.contains('About Us');
    });

    it('should submit the contact form', () => {
        cy.visit('/contact');
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('textarea[name="message"]').type('Hello!');
        cy.get('form').submit();
        cy.contains('Thank you for your message!');
    });
});
/// <reference types="cypress" />

const testUserEmail = 'test.auth@example.com';
const testUserPassword = '123456';

describe('Test AppTopBar behaviors.', () => {
  context('User is not signed in.', () => {
    beforeEach(() => {
      // Visit homepage.
      cy.visit('/');
    });

    it('Renderes correct buttons with right behaviors on desktop.', () => {
      // Simulate desktop viewport.
      cy.viewport('macbook-13');

      // Header contains Sign In button.
      cy.get('header').contains('Sign In');

      // Sign In button can route to '/signin' page.
      cy.get('header').get('button:contains("Sign In")').first().click();
      cy.url().should('include', 'signin');
    });

    it('Renderes correct buttons with right behaviors on mobile.', () => {
      // Simulate mobile viewport.
      cy.viewport('iphone-8');

      // Header does not contain Sign In button by default.
      cy.get('header').should('not.contain', 'Sign In');

      // Button displays when user click on drawer button.
      cy.get('header').get('button').click();
      cy.contains('Sign In');

      // Sign In element in the drawer can route to '/signin' page.
      cy.get('span:contains("Sign In")').first().click();
      cy.url().should('include', 'signin');
    });

    afterEach(() => {
      // Sign out to clear user data.
      cy.visit('/signout');
    });
  });

  context('User is signed in.', () => {
    beforeEach(() => {
      // Simulate user sign in by email.
      cy.visit('/signin');
      cy.get('button[data-provider-id=password]').first().click();
      cy.get('input').type(testUserEmail).type('{enter}');
      cy.get('input[name=password]').type(testUserPassword).type('{enter}');
      cy.url().should('include', 'user');
    });

    it('Renderes correct buttons with right behaviors on desktop.', () => {
      // Simulate desktop viewport.
      cy.viewport('macbook-13');

      // Header contains Dashboard and Sign Out buttons.
      cy.get('header').contains('Dashboard');
      cy.get('header').contains('Sign Out');

      // Title on header is clickable and can route to '/'.
      cy.get('header').get('h6:contains("Vocabulary Flashcard")').first().click();
      cy.url().should('not.include', 'user');

      // Dashboard can route to '/user' page.
      cy.get('header').get('button:contains("Dashboard")').first().click();
      cy.url().should('include', 'user');

      // Sign out button can sign out.
      cy.get('header').get('button:contains("Sign Out")').first().click();
      cy.url().should('not.include', 'user');
    });

    it('Renderes correct buttons with right behaviors on mobile.', () => {
      // Simulate mobile viewport.
      cy.viewport('iphone-8');

      // Header does not contain Dashboard and Sign Out button by default.
      cy.get('header').should('not.contain', 'Dashboard');
      cy.get('header').should('not.contain', 'Sign Out');

      // Title on header is clickable and can route to '/'.
      cy.get('header').get('h6:contains("Vocabulary Flashcard")').first().click();
      cy.url().should('not.include', 'user');

      // Button displays when user click on drawer button.
      cy.get('header').get('button').click();
      cy.contains('Dashboard');
      cy.contains('Sign Out');

      // Dashboard element in the drawer can route to '/user' page.
      cy.get('span:contains("Dashboard")').first().click();
      cy.url().should('include', 'user');

      // Sign out element in the drawer can sign out.
      cy.get('header').get('button').click();
      cy.get('span:contains("Sign Out")').first().click();
      cy.url().should('not.include', 'user');
    });

    afterEach(() => {
      // Sign out to clear user data.
      cy.visit('/signout');
    });
  });
});

export {};

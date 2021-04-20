/* eslint-disable cypress/no-unnecessary-waiting */
const testUserEmail = 'test.auth@example.com';
const testUserPassword = '123456';
const signOutWaitTime = 1000;

describe('Testing sign in behaviors', () => {
  it('Can sign in and prevent sign in', () => {
    // Log out first
    cy.visit('/signout');
    cy.wait(signOutWaitTime);

    // Visit sign in page.
    cy.visit('/signin');
    cy.get('div#firebase-ui').children().should('have.length.at.least', 1);

    // Simulate sign in workflow
    cy.get('button[data-provider-id=password]').first().click();
    cy.get('input').type(testUserEmail).type('{enter}');
    cy.get('input[name=password]').type(testUserPassword).type('{enter}');
    cy.url().should('include', 'user');

    // Visit sign in page when user is signed in.
    cy.visit('/signin');
    cy.get('div#firebase-ui').children().should('have.length.at.most', 0);
    cy.contains('You have already signed in');

    // Finally sign out.
    cy.visit('/signout');
    cy.wait(signOutWaitTime);

    // Visit sign in page to check whether user is signed out.
    cy.visit('/signin');
    cy.get('div#firebase-ui').children().should('have.length.at.least', 1);
  });
});

export {};

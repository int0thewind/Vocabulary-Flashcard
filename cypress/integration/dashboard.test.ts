/* eslint-disable cypress/no-unnecessary-waiting */

const signOutWaitTime = 1000;

function signIn(email: string) {
  cy.visit('/signin');
  cy.get('button[data-provider-id=password]').first().click();
  cy.get('input').type(email).type('{enter}');
  cy.get('input[name=password]').type('123456').type('{enter}');
}

describe('Testing user dashboard', () => {
  beforeEach(() => {
    // Log out first
    cy.visit('/signout');
    cy.wait(signOutWaitTime);
    signIn('test.word@example.com');
  });

  it('Can show word', () => {
    cy.visit('/user');

    cy.contains('w1');
    cy.contains('w2');

    cy.get('p:contains("w2")').first().click();
    cy.contains('w2sample');
    cy.contains('w2ety');
    cy.get('span:contains("Close")').first().click();

    cy.get('p:contains("w1")').first().click();
    cy.get('span:contains("Edit Word")').first().click();
    cy.get('textarea[name=definition]').type('w1newdefinition');
    cy.get('span:contains("Update")').first().click();
    cy.get('span:contains("Close")').first().click();

    cy.get('p:contains("w1")').parent().click();
    cy.contains('w1newdefinition');
  });
});

export {};

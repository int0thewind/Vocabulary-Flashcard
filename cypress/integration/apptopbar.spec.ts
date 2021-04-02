/// <reference types="cypress" />

describe('Test AppTopBar behaviors.', () => {
  context('Desktop environment.', () => {
    beforeEach(() => {
      cy.viewport('macbook-13');
    });

    it('Renderes correct information when user is not signed in.', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Sign In');
    })
  });

  // context('Mobile environment', () => {
  //   beforeEach(() => {
  //     cy.viewport('iphone-8');
  //   })
  // })
})

export {}

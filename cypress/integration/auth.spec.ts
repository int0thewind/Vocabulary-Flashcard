/// <reference types="cypress" />

import firebase from 'firebase/app';
import 'firebase/auth';

describe('Test AppTopBar behaviors.', () => {

  context('User is not signed in.', () => {

    it('Renderes correct information on desktop.', () => {
      cy.visit('/');

      cy.contains('Sign In');
    });

    it('Renderes correct information on mobile.', () => {
      cy.visit('/');
      cy.viewport('iphone-8');
      const header = cy.get('header');

      header.contains('Vocabulary Flashcard');
      header.should('not.contain', 'Sign In')

      const menuButton = cy.get('button');
      menuButton.click();
      cy.contains('Sign In');
    });

  });

  // context('Trying to sign in.', () => {

  // });

  // context('User is signed in.', () => {

  // });

  // context('Trying to sign out.', () => {

  // });
})

/**
 * Storage Module.
 *
 * This module defines functions that handles localStorage of window.
 *
 * @author Gary Liu.
 */

import { Word } from '../type/Word';
import { LearnSession } from '../type/Learn';

export function createLearnStorage(wordsToLearn: Word[]) {
  window.localStorage.removeItem('LearnSession');
  window.localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn));
}

export function storeLearnSession(learnSession: LearnSession) {
  window.localStorage.setItem('LearnSession', JSON.stringify(learnSession));
}

export function clearLearnStorage() {
  window.localStorage.removeItem('wordsToLearn');
  window.localStorage.removeItem('LearnSession');
}

export function readLearnStorage() {
  const learnSessionStr = window.localStorage.getItem('LearnSession');
  const wordsToLearnStr = window.localStorage.getItem('wordsToLearn');
  return {
    learnSession: learnSessionStr ? JSON.parse(learnSessionStr) as LearnSession : null,
    wordsToLearn: wordsToLearnStr ? JSON.parse(wordsToLearnStr) as Word[] : null,
  };
}

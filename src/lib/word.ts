import firebase from 'firebase/app';
import 'firebase/firestore';
import { Word, WordDifficulty } from '../type/Word';

export const learningFactor = {
  hard: 1,
  medium: 2,
  easy: 4,
};

export function getWordWithNewDue(word: Word, rating: WordDifficulty): Word {
  const newGapDay = word.prevGapDays * learningFactor[rating];
  return {
    ...word,
    prevGapDays: newGapDay,
    nextDue: firebase.firestore.Timestamp.fromMillis(
      Date.now() + newGapDay * 24 * 60 * 60 * 1000,
    ),
  };
}

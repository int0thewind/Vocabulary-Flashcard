import firebase from 'firebase/app';
import 'firebase/firestore';
import { Word, WordDifficulty } from '../type/Word';

export function getWordWithNewDue(word: Word, rating: WordDifficulty): Word {
  const secondsForOneDay = 24 * 60 * 60;
  const learningGapDay = {
    hard: 1, // one day
    medium: 4, // 4 days
    easy: 7, // 7 days
  };
  return {
    ...word,
    prevGapDays: learningGapDay[rating],
    nextDue: firebase.firestore.Timestamp.fromMillis(
      (word.nextDue.seconds + word.prevGapDays * secondsForOneDay) * 1000,
    ),
  };
}

export const temp = 3;

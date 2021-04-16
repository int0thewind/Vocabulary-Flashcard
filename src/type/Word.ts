import firebase from 'firebase/app';

export default interface Word {
  /** The word literal. */
  literal: string;

  /** Where the word is from? */
  source: string;

  /** Phonetic symbol. */
  phoneticSymbol?: string;

  /** Word definition in one sentence. */
  definition: string;

  /** Sample sentence in one string. */
  sampleSentence?: string;

  /** Explanation of the word's origin. */
  etymology?: string;

  /** Related words to memorize together. */
  related?: string[];

  /** When the word is added. */
  addedAt: firebase.firestore.Timestamp;

  /** When the word should be studied. */
  nextDue: firebase.firestore.Timestamp;

  /** Last due date gaping days. */
  prevGapDays: number;
}

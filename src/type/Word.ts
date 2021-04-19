import firebase from 'firebase/app';

/** Minified word entry for API query. */
export interface WordFetch {
  /** The word literal. */
  literal: string;

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
}

/** Minified word entry for Firestore document update. */
export interface WordUpdate {
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
}

/** Word entry type in each Firebase document. */
export interface Word {
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

/** Word entry type for learning. */
export interface MemoWord {
  word: Word,
  againTimes: number,
  rating: 'hard' | 'medium' | 'easy' | null
}

import firebase from 'firebase/app';

/** Where did the word come from? */
type WordSource = 'MW' | 'Oxford' | 'manual';

/**
 * A word may have multiple audio recording
 * indicating different accent/gender.
 */
type WordAudio = {
  accent: string,
  gender: string,
  audio: URL,
};

export default interface Word {
  /** The word literal. */
  literal: string;

  /** Where the word is from? */
  source: WordSource;

  /** Phonetic symbol. */
  phoneticSymbol?: string;

  // /** Online audio recording file. */
  // audio?: WordAudio;

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
}

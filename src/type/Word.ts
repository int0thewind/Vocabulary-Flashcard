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

/**
 * A word may have multiple definitions.
 * A definition may have multiple sample sentences.
 */
type WordExplanation = {
  wordFunction: string,
  definition: string,
  example: string[],
};

export default interface Word {
  /** The word literal. */
  literal: string;

  /** Replicate number of this word entry */
  homonym: number;

  /** Where the word from? */
  source: WordSource;

  /** Phonetic symbol. */
  phoneticSymbol: string;

  /** Online audio recording file. */
  audio: WordAudio;

  /** Collection of word definition along with its sample sentence. */
  explanation: WordExplanation[];

  /** Explanation of the word's origin. */
  etymology: string;

  /** When the word is added. */
  addedAt: Date;

  /** When the word should be studied. */
  nextDue: Date;
}

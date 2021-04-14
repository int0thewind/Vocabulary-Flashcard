type WordSource = 'MW' | 'Oxford' | 'manual';

/**
 * A word may have multiple audio recording
 * indicaing different accent/gender.
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
type WordExplaination = {
  definition: string,
  example: string[],
};

export default interface Word {
  /** The word literal. */
  literal: string;

  /** Where the word is added? */
  source: WordSource;

  /** Phonetic symbol. */
  phoneticSymbol: string;

  /** Online audio recording file. */
  audio: WordAudio[];

  /** Collection of word definition along with its sample sentence. */
  explaination: WordExplaination[];

  /** Explaination of the word's origin. */
  etymology: string;

  /** When the word is added. */
  addedAt: Date;

  /** When the word should be studied. */
  nextDue: Date;
}

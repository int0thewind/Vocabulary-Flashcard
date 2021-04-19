import { MemoWord, Word } from './Word';

export interface LearnSession {
  allWordsToLearn: Word[]
  wordsLearned: MemoWord[]
  wordsLearning: MemoWord[]
}

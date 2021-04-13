type AudioRecording = {
  [key: string]: URL,
};

type WordExplaination = {
  definition: string,
  example: string[],
};

export default interface Vocabulary {
  word: string,
  phoneticSymbol: string,
  audio: AudioRecording,
  explaination: WordExplaination

  addedAt: Date,
  tag: string[],
}

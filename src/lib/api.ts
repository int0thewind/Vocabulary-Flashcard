import Word from 'src/type/Word';

const { assert } = console;

const getMWCEndpoint = (word: string) => {
  assert(process.env.MW_DIC);
  return `https://dictionaryapi.com/api/v3/references/collegiate/json/
  ${encodeURIComponent(word)}?key=${process.env.MW_DIC}`;
};

export async function MerriamWebsterCollegiateQuery(word: string) {
  assert(word);
  const response = await fetch(getMWCEndpoint(word)).then((r) => r.json());
  if (!('meta' in response[0])) {
    return Promise.reject();
  }
}

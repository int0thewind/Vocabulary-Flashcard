import { WordFetch } from 'src/type/Word';
import { flattenDeep } from 'lodash';

const getMWEndpoint = (word: string) => `https://dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${process.env.NEXT_PUBLIC_MW_DIC}`;

export async function MWQuery(word: string): Promise<WordFetch | string[]> {
  const endpoint = getMWEndpoint(word);
  const response: unknown[] = await fetch(endpoint)
    .then((r) => r.json());
  if (typeof response[0] === 'string') return response as string[];
  // @ts-ignore
  const literal = response[0].meta?.id?.split(':')[0];
  // @ts-ignore
  const phoneticSymbol = response[0].hwi?.prs[0]?.mw;
  // @ts-ignore
  const definition = flattenDeep(response.map((obj) => obj.shortdef))
    .map((str, idx) => `${idx + 1}. ${str}`)
    .join('\n');
  // @ts-ignore
  const etymology = response[0].et?.filter((entry) => entry[0] === 'text')[0][1];
  // TODO Later: find sample sentences and related synonyms.
  return {
    literal,
    phoneticSymbol,
    definition,
    sampleSentence: '',
    etymology,
    related: [],
  };
}

export async function OxfordQuery(word: string) {
  // TODO: finish Oxford query: same format as MW
}

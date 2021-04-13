import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from 'src/utils/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const word = query.word as string;

  if (word.length === 0) {
    res.status(404).end('Word should be passed to the api');
  }

  const wordsCollection = db.collection('words');

  switch (method) {
    case 'GET': {
      wordsCollection.doc(word).get()
        .then((result) => {
          res.status(200).json(result.data());
        });
      break;
    }

    case 'PUT': {
      // Get data from your database
      // Fetch the definitions
      const MerriamWebsterThesaurusKey = process.env.MW_THE;
      const fetchJobs = [
        // fetch Merriam Webster Collegiate Thesaurus Dictionary
        axios.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}`, {
          params: { key: MerriamWebsterThesaurusKey },
        }),
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`),
        axios.get(`https://api.urbandictionary.com/v0/define?term=${word}`),
      ];
      axios.all(fetchJobs)
        .then(axios.spread(
          (...responses) => {
            const MerriamWebsterCollegiateThesaurusResp = responses[0].data;
            const GoogleResp = responses[1].data;
            const UrbanDictResp = responses[2].data;
            return {
              definitionsFromSources: {
                'Merriam Webster Collegiate Thesaurus': {
                  source: 'Merriam Webster Collegiate Thesaurus',
                  sourceAPI: 'https://www.dictionaryapi.com/api/v3/references/thesaurus',
                  definition: JSON.stringify(MerriamWebsterCollegiateThesaurusResp),
                },
                'Google Dictionary': {
                  source: 'Google Dictionary',
                  sourceAPI: 'https://api.dictionaryapi.dev/api/v2/entries/en_US/',
                  definition: JSON.stringify(GoogleResp),
                },
                'Urban Dictionary': {
                  source: 'Urban Dictionary',
                  sourceAPI: 'https://api.urbandictionary.com/v0/define',
                  definition: JSON.stringify(UrbanDictResp),
                },
              },
            };
          },
        ))
        .then((definitions) => wordsCollection.doc(word).set(definitions))
        .then((writeResult) => {
          res.status(200).json({ result: `AddWord result: ${JSON.stringify(writeResult)}` });
        });
      break;
    }

    case 'DELETE': {
      wordsCollection.doc(word).delete().then((result) => {
        res.json(result);
      });
      break;
    }

    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}

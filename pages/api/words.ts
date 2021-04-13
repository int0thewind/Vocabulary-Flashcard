import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from 'src/utils/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const word = query.word as string;

  if (word.length === 0) {
    res.status(404).end('Word should be passed to the api');
  }

  const wordsCollection = db.collection('words');

  switch (method) {
    case 'GET': {
      const result = await wordsCollection.doc(word).get();
      res.status(200).json(result.data());
      break;
    }

    case 'PUT': {
      // Get data from your database
      // Fetch the definitions
      const MerriamWebsterThesaurusKey = process.env.MW_THE;
      const fetchJobs = [
        // fetch Merriam Webster Collegiate Thesaurus Dictionary
        axios.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}`, {
          params: {
            key: MerriamWebsterThesaurusKey,
          },
        }),
        // fetch google dictionary
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`),
        // fetch urban dictionary
        axios.get(`https://api.urbandictionary.com/v0/define?term=${word}`),
      ];
      const definitions = await axios.all(fetchJobs)
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
        .catch(() => {});

      // Push the new word into Firestore using the Firebase Admin SDK.
      const writeResult = await wordsCollection.doc(word).set(definitions);
      // Send back a message that we've successfully written the word
      res.status(200).json({ result: `AddWord result: ${JSON.stringify(writeResult)}` });
      break;
    }

    case 'DELETE': {
      const result = await wordsCollection.doc(word).delete();
      res.json(result);
      break;
    }

    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../utils/db/index';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const word = req.query.word as string;

  if (word.length === 0) {
    res.status(404).end('Word should be passed to the api');
  }

  switch (method) {
    case 'GET': {
      // Push the new word into Firestore using the Firebase Admin SDK.
      const wordsCollection = db.collection('words');
      const result = await wordsCollection.doc(word).get();
      // Send back a message that we've successfully written the word
      res.status(200).json(result);
      break;
    }

    case 'PUT': {
      // Get data from your database
      // Fetch the definitions
      const MerriamWebsterThesaurusKey = process.env.MW_THE;
      const fetchJobs = [
        // fetch Merriam Webster Collegiate Thesaurus Dictionary
        axios.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${MerriamWebsterThesaurusKey}`),
        // fetch urban dictionary
        axios.get(`https://api.urbandictionary.com/v0/define?term=${word}`),
      ];
      const definitions = await axios.all(fetchJobs)
        .then(axios.spread(
          (...responses) => {
            const MerriamWebsterCollegiateThesaurusResp = responses[0].data;
            const UrbanDictResp = responses[1].data;
            return {
              definitionsFromSources: [
                {
                  source: 'Merriam Webster Collegiate Thesaurus',
                  sourceAPI: 'https://www.dictionaryapi.com/api/v3/references/thesaurus',
                  definition: JSON.stringify(MerriamWebsterCollegiateThesaurusResp),
                },
                {
                  source: 'Urban Dictionary',
                  sourceAPI: 'https://api.urbandictionary.com/v0/define',
                  definition: JSON.stringify(UrbanDictResp),
                },
              ],
            };
          },
        ))
        .catch((error) => {
          console.log(error);
          return {};
        });

      // Push the new word into Firestore using the Firebase Admin SDK.
      const wordsCollection = db.collection('words');
      const writeResult = await wordsCollection.doc(word).set(definitions);
      // Send back a message that we've successfully written the word
      res.status(200).json({ result: `AddWord result: ${JSON.stringify(writeResult)}` });
      break;
    }

    case 'DELETE': {
      const wordsCollection = db.collection('words');
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

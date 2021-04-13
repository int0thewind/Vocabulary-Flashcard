import type { NextApiRequest, NextApiResponse } from 'next';
import db from 'src/utils/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  const uid = query.uid as string; // required
  const vocabulary = query.vocabulary as string; // required
  const word = query.word as string; // optional

  if ((!uid || !vocabulary) || (method !== 'GET' && !word)) {
    res.status(400).end('Invalid Param');
  }

  const usersCollection = db.collection('users');
  const userDoc = usersCollection.doc(uid);
  const vocabularyDoc = userDoc.collection('vocabularies').doc(vocabulary);

  switch (method) {
    case 'GET': {
      vocabularyDoc.collection('words').get()
        .then((result) => {
          const response: FirebaseFirestore.DocumentData[] = [];
          result.forEach(((docData) => response.push(
            docData.data(),
          )));
          res.status(200).json(response);
        });
      break;
    }

    case 'PUT': {
      vocabularyDoc.collection('words').doc(word).set(
        {
          wordLiteral: word,
          rating: 1,
          learningInfo: { learning: true },
          addedAt: Date.now(),
        },
      ).then((result) => {
        res.status(200).json(result);
      });
      break;
    }

    case 'DELETE': {
      vocabularyDoc.collection('words').doc(word).delete()
        .then((result) => {
          res.status(200).json(result);
        });
      break;
    }

    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}

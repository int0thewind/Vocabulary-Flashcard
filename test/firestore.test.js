const firebase = require('@firebase/rules-unit-testing');
const fs = require('fs');
const http = require('http');

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = 'firestore-emulator-example';

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = 'firestore-coverage.html';
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true });

      res.on('end', resolve);
      res.on('error', reject);
    });
  });
});

describe('Testing users collection and its vocabulary sub-collections', () => {
  it('require users to log in before creating a profile', async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ nickname: 'bad girl' }));
  });

  it('should enforce the scheme in user profiles', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const profile = db.collection('users').doc('alice');

    // this should fail as it does not submit all needed fields
    await firebase.assertFails(profile.set({ nickname: 'bad girl' }));

    // this should succeed
    await firebase.assertSucceeds(
      profile.set({
        nickname: 'bad girl',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it('should only let users create and modify their own profile', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    await firebase.assertSucceeds(
      db.collection('users').doc('alice').set({
        nickname: 'bad girl',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
    // alice should not be able to create the info of others
    await firebase.assertFails(
      db.collection('users').doc('bob').set({
        uid: 'alice',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it('should only let users read their own profile', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const profile = db.collection('users').doc('bob');
    await firebase.assertFails(profile.get());
  });

  it('should let user create a vocabulary', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const vocabularies = db.collection('users').doc('alice').collection('vocabularies');
    await firebase.assertSucceeds(
      vocabularies.add({
        name: "alice's book",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });

  it('should not let one access a vocabulary from another user', async () => {
    let vocabularies;
    const alice = getAuthedFirestore({ uid: 'alice' });
    const bob = getAuthedFirestore({ uid: 'bob' });

    vocabularies = alice.collection('users').doc('alice').collection('vocabularies');
    await firebase.assertSucceeds(
      vocabularies.add({
        name: "alice's book",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );

    vocabularies = bob.collection('users').doc('alice').collection('vocabularies');
    await firebase.assertFails(
      vocabularies.add({
        name: "alice's book",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }),
    );
  });
});

describe('Testing words collection', () => {
  it('require users to log in before creating a word', async () => {
    const db = getAuthedFirestore(null);
    const word = db.collection('words').doc('hello');
    await firebase.assertFails(word.set({}));
  });
});

/**
 * Firebase Connection Module.
 *
 * This module initializes the Firebase app, exports Firebase app instance,
 * starts Firebase emulators if not in production mode,
 * and defines Firebase related React hooks and Firestore routines.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Word from '../type/Word';

const firebaseConfig = {
  apiKey: 'AIzaSyA1idIe2_-3X4oL7Z6GV-QOyxVIlZib8MM',
  authDomain: 'vocabulary-flashcard-938b9.firebaseapp.com',
  projectId: 'vocabulary-flashcard-938b9',
  storageBucket: 'vocabulary-flashcard-938b9.appspot.com',
  messagingSenderId: '441447059126',
  appId: '1:441447059126:web:93d294f2cda818c31c2017',
  measurementId: 'G-SVWSMP865K',
};

// Initialize app only if there is no app.
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const appAuth = firebase.auth();
export const appFirestore = firebase.firestore();
export const appUsersCollection = appFirestore.collection('users');

if (process.env.NODE_ENV !== 'production') {
  appAuth.useEmulator('http://localhost:9099');
  appFirestore.useEmulator('localhost', 8080);
}

function getUserWordCollection() {
  const uid = appAuth.currentUser?.uid;
  if (!uid) throw Error('No user has signed in');
  return appUsersCollection.doc(uid).collection('words');
}

type UseFirebaseUserType = [firebase.User | null, boolean, firebase.auth.Error | null];

/**
 * A React hook that listens to the current user,
 * guarantees to return the right user instance.
 *
 * @returns a tuple with three values: user, the guaranteed correct Firebase user,
 * loading, the status of whether a user change is on the way, and error, if any error occurred.
 */
export function useFirebaseUser(): UseFirebaseUserType {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<firebase.auth.Error | null>(null);
  const [user, setUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    const unsubscribeListeners = appAuth.onAuthStateChanged(
      (newUser) => {
        setLoading(true);
        setUser(newUser);
        setError(null);
        setLoading(false);
      }, (e) => {
        setLoading(true);
        setError(e);
        setUser(null);
        setLoading(false);
      },
    );
    return () => unsubscribeListeners();
  }, []);

  return [user, loading, error];
}

/**
 * Check whether a word is existed in the user's word collection.
 *
 * @param word the word to check
 * @returns a boolean promise indicating the word is already existed or not.
 */
export async function checkWordExist(word: string) {
  return getUserWordCollection()
    .where('literal', '==', word)
    .get()
    .then((querySnapshot) => querySnapshot.size !== 0);
}

/**
 * Add a word to the current user.
 *
 * @param wordData an object contains all the information of a word.
 */
export async function addWordToUser(wordData: Word) {
  return getUserWordCollection().doc().set(wordData);
}

export async function getWordFromUser(word: string) {
  return getUserWordCollection()
    .where('literal', '==', word)
    .limit(1)
    .get();
}

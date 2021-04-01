/**
 * Firebase Connection Module.
 *
 * This module fetches the right Google Firebase app config base on the working environment,
 * initialize the Firebase app, and exports essential Firebase app instance.
 * This module also exports React hooks and functions related to firebase.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// TODO: for local dev and testing, consider using local emulators.

const firebaseConfig = process.env.NODE_ENV === 'production' ? {
  apiKey: 'AIzaSyA1idIe2_-3X4oL7Z6GV-QOyxVIlZib8MM',
  authDomain: 'vocabulary-flashcard-938b9.firebaseapp.com',
  projectId: 'vocabulary-flashcard-938b9',
  storageBucket: 'vocabulary-flashcard-938b9.appspot.com',
  messagingSenderId: '441447059126',
  appId: '1:441447059126:web:93d294f2cda818c31c2017',
  measurementId: 'G-SVWSMP865K',
} : {
  apiKey: 'AIzaSyB4WJBuJiPtGGX1sVLhdlamQBkPiHlHWcw',
  authDomain: 'vocabulary-flashcard-dev.firebaseapp.com',
  projectId: 'vocabulary-flashcard-dev',
  storageBucket: 'vocabulary-flashcard-dev.appspot.com',
  messagingSenderId: '518448634162',
  appId: '1:518448634162:web:9f726fb6ab9dbde8da5f2b',
  measurementId: 'G-CNH29N75YE',
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const appAuth = firebase.auth();
export const appFirestore = firebase.firestore();

// Use emulator if app is not in production mode.
// Emulator config: see ./firebase.json emulators property.
// if (process.env.NODE_ENV !== 'production') {
//   appAuth.useEmulator('http://localhost:9099');
//   appFirestore.useEmulator('localhost', 8080);
// }

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
    const unsubscribeListeners = appAuth.onAuthStateChanged((newUser) => {
      setLoading(true);
      setUser(newUser);
      setLoading(false);
    }, (e) => {
      setLoading(true);
      setError(e);
      setLoading(false);
    });
    return () => { unsubscribeListeners(); };
  }, []);

  return [user, loading, error];
}

/**
 * Firebase Connection Module.
 *
 * This module initializes the Firebase app and exports Firebase app instance.
 * Firebase emulators would be started if not in production mode.
 * React hooks and functions related to firebase are also defined.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

if (process.env.NODE_ENV !== 'production') {
  appAuth.useEmulator('http://localhost:9099');
  appFirestore.useEmulator('localhost', 8080);
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

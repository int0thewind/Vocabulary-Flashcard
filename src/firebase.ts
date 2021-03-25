/**
 * Firebase Connection Module.
 *
 * This module fetches the right Google Firebase app config base on the working environment,
 * initialize the Firebase app, and exports essential Firebase app instance.
 * Since NextJS is always server side rendering, directly fetching Firebase app information
 * from the `firebase` NodeJS package is not deterministic. While consuming Firebase app instance
 * you should always refer to the instances exported from this module.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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
export const appStorage = firebase.storage();

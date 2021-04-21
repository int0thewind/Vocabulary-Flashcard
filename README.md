# Vocabulary Flashcard

CS 242 SP21 Final Project, co-developed by Hanzhi Yin and Gary Liu.

## Technical Data

* Language: TypeScript
* Dev environment: NodeJS, yarn
* Framework: NextJS, Firebase
* Test suite: Cypress, Mocha
* Linter: ESLint
* CI: Gitlab CI
* CD: Self-hosted Docker Server

## Project Setup

Install:
* NodeJS and yarn.
* [Firebase CLI](https://firebase.google.com/docs/cli).
* Java Runtime Environment, required by Firebase Emulator

Run `yarn` to install dependencies. 

Setup environment variables by acquiring API keys from Merriam-Webster Collegiate Dictionary, Merriam-ebster Collegiate Thesaurus, and Oxford Dictionary. Paste API keys in `env.local.sample` and rename it to `env.local`. `env.local` is the place to store secrets in [NextJS](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables).

## Start the Development Server

Run `yarn dev` to start development. Firebase Emulators should also be initiated, as the app is not in production.

## Firebase Emulators

[Firebase Emulators](https://firebase.google.com/docs/emulator-suite) must be started if not in production. Local emulators data is in `./firebase-emulators-data`. It should be loaded when emulator runs.

```
firebase emulators:start --import=firebase-emulators-data
```

To modify local emulator data, append this flag: `--export-on-exit=firebase-emulators-data`.

## Testing

End-to-end testing is more preferred than unit testing. Unit testing is hard when React components are entangled with React hooks.

Run `firebase emulators:exec --import=firebase-emulators-data 'yarn run test:e2e'` to start end-to-end testing. Development server should also be initiated at background by running `yarn run dev &`.

Run and `firebase emulators:exec --only firestore` to start unit testing.

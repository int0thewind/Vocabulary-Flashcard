# Vocabulary Flashcard

CS 242 SP21 Final Project, co-developed by Hanzhi Yin and Gary Liu.

## Technical Data

* Language: TypeScript
* Dev environment: NodeJS, yarn
* Framework: NextJS, Firebase
* Test suite: Cypress
* Linter: ESLint
* CI: TBD
* CD: Vercel

## Project Setup

Install NodeJS and yarn.

Install [Firebase CLI](https://firebase.google.com/docs/cli).

Install Java Runtime Environment. JRE is required by Firebase Emulators.

Run `yarn` to install dependencies. 

Setup environment variables by acquiring API keys from Merriam Webster Collegiate Dictionary, Merriam Webster Collegiate Thesaurus, and Oxford Dictionary. Paste API keys in `env.local.sample` and rename it to `env.local`. `env.local` in NextJS is the place to store secrets. [Reference](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables).

## Project Development

Run `yarn dev` to start development. Firebase Emulators should also be initiated## Firebase Emulators. 

## Firebase Emulators

This app would run with [Firebase Emulators](https://firebase.google.com/docs/emulator-suite) if not in production mode. Local emulators data are stored in `./firebase-emulators-data` entry. Ensure that you load the pre-defined auth and database data when starting Firebase Emulators, and export any modifications accordingly.

```bash
firebase emulators:start --export-on-exit=firebase-emulators-data --import=firebase-emulators-data
```

## Testing

Unit testing is hard when React components entangled with React hooks. End-to-end testing is always more preferred than unit testing, unless the code to test is library code.

Start development server before testing. 

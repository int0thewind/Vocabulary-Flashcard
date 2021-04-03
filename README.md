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

Apple Silicon processor tested compatible.

## Project Setup

Install NodeJS and yarn.

Install [Firebase CLI](https://firebase.google.com/docs/cli).
On Apple Silicon computers, do `brew install firebase-cli` instead. Firebase CLI on Homebrew isn't the latest but supports Apple Silicon.

Install Java Runtime Environment. Firebase Emulators requires it.

Run `yarn` to install dependencies. 

Setup environment variables by acquiring API keys from Merriam Webster Collegiate Dictionary, Merriam Webster Collegiate Thesaurus, and Oxford Dictionary. Paste API keys in `env.local.sample` and rename it to `env.local`. `env.local` in NextJS is the place to store secrets. [Reference](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables).

## Start the Development Server

Run `yarn dev` to start development. Firebase Emulators should also be initiated, as the app is not in production.

## Firebase Emulators

[Firebase Emulators](https://firebase.google.com/docs/emulator-suite) must be started if not in production. Local emulators data is in `./firebase-emulators-data`. It should be loaded and exported when emulator runs.

`firebase emulators:start --export-on-exit=firebase-emulators-data --import=firebase-emulators-data`

## End-to-end Testing

End-to-end testing is more preferred than unit testing. Unit testing is hard when React components are entangled with React hooks.

Before running `yarn e2e` to start testing, start the development server and Firebase Emulators.

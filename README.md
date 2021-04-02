# Vocabulary Flashcard

CS 242 SP21 Final Project, co-developed by Hanzhi Yin and Gary Liu.

## Technical Data

Language: TypeScript
Dev environment: NodeJS, yarn
Framework: NextJS, Firebase
Test suite: Cypress
Linter: ESLint
CI: TBD
CD: Vercel

## Project Setup

Install NodeJS and yarn.

Setup environment variables by acquiring API keys from Merriam Webster Collegiate Dictionary, Merriam Webster Collegiate Thesaurus, and Oxford Dictionary. Paste API keys in `env.local.sample` and rename it to `env.local`. `env.local` in NextJS is the place to store secrets. [Link](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables).

Run `yarn` to install dependencies. 

Install Firebase CLI. [Link](https://firebase.google.com/docs/cli).

## Development

Firebase would be in emulator mode if not in production. Both commands should be executed to run the app locally:

```bash
firebase emulators:start
```

```bash
yarn dev
```

# Final Project Proposal Final Draft

# Vocabulary Flashcard

Gary Liu (hangel2@illinois.edu) | Moderator: Janak Shah

Hanzhi Yin (hanzhiy2@illinois.edu) | Moderator: Hang Song

# Rationale

We'll make a web app to help learning English vocabularies. 

Having a capacious vocabulary has positive impact on personal success, yet so far, not many word memorizing apps have incorporated the best ways to memorize, which are studying by adding time/Ebbinghaus forgetting curve/synonyms/prefix/suffix. We decide to create a web app to allow user to add/export vocabulary, automatically fetch definitions from authoritative dictionaries by their APIs, and learn/manage their vocabularies by a variety of different methods. 

# Technical Specification

- Platform: Web and PWA
- Programming language: TypeScript
- Stylistic conventions: Airbnb TypeScript Style Guide
- SDK: NextJS, Firebase
- IDE: WebStorm

# Features

- Full web-app supporting PWA
- Fully responsive UI with dark mode
- Support user accounts
    - Registration and authentication by email and Google account
    - Store and retrieve user information based on user accounts
- Support look up a single word and show definition
- Batch operation over multiple words
    - Bulk import words from json, excel ...
    - Bulk export words
- Fetch/Update definitions from authoritative dictionaries
- Manually select useful definitions or input definitions
- Query and group words by adding time/Ebbinghaus Curve/Synonyms/Similar Words

# Brief Timeline

- Week 1
    - Finish general UI on entrance page: Step 1 of 3
    - Complete tweaking all Firebase features
        - Finish user authentication (sign in/out)
        - Finish database structural construction
        - Finish hosting (Maybe on Vercel platform instead)
    - Development and production environment compartmentalization
    - CI for development branch and CD for production branch
- Week 2
    - Finish general UI on the rest of UI components: Step 2 of 3
    - Finish functionalities on word adding page/dialog
    - Finish functionalities on word exporting page/dialog
    - Finish querying word definition from APIs
    - Finish dictionary API selection
- Week 3
    - Finish related UI: Step 3 of 3
    - Finish functionalities on word querying
        - By adding time
        - By Ebbinghaus Forgetting Curve critical juncture
        - By synonyms
        - By prefix/suffix (if possible API has been found)
    - Finish functionalities on auto definition updating
- Week 4
    - Finish PWA creation
        - Adding essential assets
        - Constructing `manifest.json`
        - Add essential JavaScript service workers for offline mode

![Final%20Project%20Proposal%20Final%20Draft%2052a1c73750734eb19ef4464ba935f565/Screen_Shot_2021-03-29_at_11.54.50_PM.png](Final%20Project%20Proposal%20Final%20Draft%2052a1c73750734eb19ef4464ba935f565/Screen_Shot_2021-03-29_at_11.54.50_PM.png)

![Final%20Project%20Proposal%20Final%20Draft%2052a1c73750734eb19ef4464ba935f565/Screen_Shot_2021-03-29_at_11.54.45_PM.png](Final%20Project%20Proposal%20Final%20Draft%2052a1c73750734eb19ef4464ba935f565/Screen_Shot_2021-03-29_at_11.54.45_PM.png)

# Rubrics

[https://docs.google.com/spreadsheets/d/1A0-Hzh5njQp21Pe08sWX-mUHb8p6EfBhk9qWjP4gU-U/edit#gid=872955657](https://docs.google.com/spreadsheets/d/1A0-Hzh5njQp21Pe08sWX-mUHb8p6EfBhk9qWjP4gU-U/edit#gid=872955657)
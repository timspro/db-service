# db-service

Allows querying and writing to a Firestore database via the browser console.

This project assumes that your Firestore-enabled service account can be automatically found by the SDK, probably due to setting `GOOGLE_APPLICATION_CREDENTIALS` in your `.bash_profile`.

See https://cloud.google.com/docs/authentication/getting-started.

## Install

`npm install @tim-code/db-service`

## Getting Started

`npm run start`

Then go to `localhost:4000` and open your browser console.

If you had a collection called "testing", then you could type `db.query("testing")` to query the database.

## Environment Variables

The build command for this project will tell Webpack to place the frontend bundle in a different directory if `DIST` is defined. If not, then it defaults to `./dist`.

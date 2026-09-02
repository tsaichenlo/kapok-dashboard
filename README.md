# KapokDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running with mock backend

This app expects a REST API at `http://localhost:3000`, now backed by SQLite.

1. `cd backend && npm install && npm run seed` — installs deps and creates/seeds `patients.db` (first time only)
2. `npm run mock-api` (from repo root) — starts the Express + SQLite API on port 3000
3. In a separate terminal: `ng serve`
4. Open `http://localhost:4200`

Schema lives in `backend/schema.sql`. Data is queried and updated with plain SQL via `better-sqlite3` — no ORM.

`db.json` is kept only as the seed source that `backend/seed.js` reads on `npm run seed`; it is no
longer served directly. `src/app/data/mock-patients.ts` is legacy and unused.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Full Stack Development Journey

This repository tracks my daily progress across a full stack development journey, divided into foundational JavaScript/TypeScript, an Angular frontend, and a Node.js/Express backend.

## Week 1: JavaScript & TypeScript Fundamentals (`week 1` folder)
* **Day 1**: FizzBuzz + temperature converter as small pure functions, with input validation and a few manual test cases.
* **Day 2**: Solve 10 array-method problems; chain map/filter/reduce (no loops) without mutating the inputs.
* **Day 3**: Fetch a public API with async/await; handle errors + a loading flag; run two requests together with `Promise.all`.
* **Day 4**: Convert a JS module to strict TS: type every param/return and remove all `any`.
* **Day 5**: Node CLI that reads a JSON file, transforms it, writes the result; run it via an npm script.

## Week 2: Angular Frontend (`frontend` folder)
* **Day 6**: Create two components and render a small dashboard card driven by a signal value.
* **Day 7**: Build a todo list UI with `@for` (track), filter buttons and an empty state (no backend).
* **Day 8**: Share state parent↔child through an injectable service so two components stay in sync.
* **Day 9**: List→detail via a route param, one lazy-loaded route, and a 404 route.
* **Day 10**: Reactive signup form with a custom password-match validator and per-field error messages.
* **Day 11**: Fetch & display typed data from a public API via the async pipe, with loading & error states.
* **Day 12**: Search box: debounce input, switchMap to the API, cancel stale requests, handle errors.
* **Day 13**: Custom "timeAgo" pipe + a highlight-on-hover directive.
* **Day 14**: Auth guard on a protected route + an interceptor that attaches a token and handles 401.
* **Day 15**: Restyle the todo app with Material (toolbar, cards, form fields) and clear any a11y warnings.

## Express Backend (`backend` folder)
* **Day 16**: CLI note tool using `fs/promises` (add/list/delete notes in a JSON file) with proper error handling.
* **Day 17**: Hello API: 3 routes + a request-logger middleware + a 404 handler.
* **Day 18**: Restructure the folder structure and worked on: In-memory CRUD API for "tasks" with correct status codes (201/204/404) and query filtering.
* **Day 19**: Added the request validation + a central error handler returning consistent JSON errors
* **Day 20**: Register + login endpoints (bcrypt + JWT) and an auth middleware guarding a protected route
* **Day 21**: CRUD + filtered queries in Compass; add an index and re-run the query
* **Day 22**: Define User & Task models with a ref; CRUD + populate the related user
* **Day 23**: Persist the tasks CRUD API to MongoDB Atlas; handle connection + not-found errors
* **Day 24**: Jest + Supertest tests for the tasks & auth endpoints covering happy + error paths
* **Day 25**: Open a feature branch + PR; deploy the API to Render with Atlas and verify live endpoints
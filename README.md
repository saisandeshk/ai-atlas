# AI Atlas

This is the compact working layer between `Learn/Roadmap-Final` and the resource library. It turns the large roadmap into an ordered, finite curriculum without replacing the detailed source roadmap.

The companion contains the complete seven-stage core route and all eight fully authored advanced tracks.

## What the interface provides

- **Guided route:** ordered sections, explicit topic boundaries, resource roles, a concise exit checkpoint, and three progress states: Learned, Practised, Passed.
- **Whole map:** the complete seven-stage core dependency spine.
- **Tracks:** eight fully authored advanced specialization directions from Roadmap-Final.
- **Local progress:** browser-local persistence with no account or server dependency, plus Back up and Restore to a JSON file.
- **Continue and saved place:** a Continue button reopens the last unit touched, and the address bar and local storage keep the open section across reloads.
- **Search:** press `/` to search every unit, project, section, topic and resource across all stages and tracks.
- **Themes:** light and dark, following the system setting by default. Every colour comes from the tokens at the top of [`app/globals.css`](app/globals.css).
- **Study units (Stage 07 pilot):** for each section, cards of 2 to 6 hours that say what to open, how far to go, what to reproduce, how to self-test and when to stop; a mini-project per section; and a capstone rubric. See [`docs/PILOT.md`](docs/PILOT.md).

## Source of truth

[`content/curriculum.json`](content/curriculum.json) is canonical. Files under [`content/stages`](content/stages) and [`content/tracks`](content/tracks) are generated reading copies; do not edit them directly.

Each section must contain:

1. a short reason for learning it;
2. a finite topic list with Required, Optional, Depth, or Later scope;
3. exactly one Primary resource and any number of non-duplicative companions;
4. an exact use note for every resource;
5. one concise exit checkpoint; and
6. a visible list of material deliberately left for later.

See [`content/AUTHORING.md`](content/AUTHORING.md) for the rules that keep later stages consistent.

Study units live beside the curriculum in [`content/units`](content/units): one file per section, plus a mini-project file per section and a `_route.json` capstone rubric. The build merges them into the site and the reading copies, and `content:check` validates them. The pytest lab that checks the Stage 07 mini-projects lives in [`labs/llm-foundations`](labs/llm-foundations).

## Work locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Content workflow

```bash
npm run content:check
npm run content:generate
npm run lint
npm run build
```

`content:check` validates IDs, topic scopes, resource roles, HTTPS links, section checkpoints, and the one-primary-route rule. Every resource assignment must use one canonical HTTPS destination; local resource paths are rejected. `content:generate` validates first and then rebuilds the Markdown reading copy.

## Release and deployment

Use Node.js 22.13 or newer. A release candidate should pass the complete local gate before deployment:

```bash
npm ci
npm run build
npm audit --omit=dev
```

`npm run build` regenerates the reading copies, runs lint and TypeScript checks, validates the full curriculum, and creates the Cloudflare-compatible artifact under `dist`. Test that artifact locally with:

```bash
npm start -- --port 8787
```

The application needs no database, object storage, account, or runtime secret. Progress remains in browser local storage. Content-hashed assets receive immutable caching through [`public/_headers`](public/_headers), while application responses receive the security headers defined in [`next.config.ts`](next.config.ts).

## Current boundary

All seven core stages are authored: 40 sections, 775 scoped topics, and 207 resource assignments. All eight advanced tracks are authored: 77 track stages, 2,100 scoped topics, and 543 resource assignments.

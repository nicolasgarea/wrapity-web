# Wrapity

Rate albums. Write reviews. See what your friends are listening to.

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## How It Works

Reviewing an album is three steps.

```
Search "CHROMAKOPIA"
         |
         v
+-----------------------------------------+
|  Tyler, the Creator - CHROMAKOPIA  2024 |
|  4.4 / 5  *  312 reviews                |
|                                         |
|  [Log or review]                        |
|  Reviews   Tracklist   Details          |
+-----------------------------------------+
         |
         v
+-----------------------------------------+
|  5 / 5                                  |
|  "Best thing he's put out since         |
|   Igor, not even close."                |
|                                  [Save] |
+-----------------------------------------+
         |
         v
  Saved to your profile diary.
  Visible in your followers' activity feed.
  Shown in the home page review stream.
```

Every listen lands on your profile, organised by month:

```
/users/username
├── Favorites    ← up to 4 pinned albums
├── Reviews      ← every rating and review you've written
└── Diary        ← chronological listen log, grouped by month
```

---

## Features

- **Album pages** — cover art, tracklist, average rating, rating histogram, community reviews
- **Artist pages** — full discography with per-album community ratings
- **Review editor** — 1–5 stars with optional text; create or update at any time
- **Likes** — like any review from the community
- **User profiles** — favorites shelf, reviews tab, monthly diary
- **Follow system** — follow users; their reviews appear in your home feed
- **Activity feed** — reviews, likes, and follows from people you follow
- **Search** — albums, artists, and users; results appear as you type
- **Public browsing** — album, artist, and profile pages work without an account

---

## Stack

| Technology | |
|---|---|
| [Angular 21](https://angular.dev) | Standalone components, Signals API, lazy-loaded routes |
| [RxJS](https://rxjs.dev) | Async data streams |
| [PrimeNG 21](https://primeng.org) | UI components |
| [Lucide Angular](https://lucide.dev) | Icons |
| [OpenAPI Generator](https://openapi-generator.tech) | TypeScript client auto-generated from the backend schema |
| SCSS | Variables and mixins |

Backend: [wrapity-api](https://github.com/nicolasgarea/wrapity-api) — FastAPI + MySQL.

---

## Quick Start

Requires Node.js 20+ and the [backend](https://github.com/nicolasgarea/wrapity-api) running at `localhost:8000`.

```bash
npm install
npm start
# http://localhost:4200
```

To point the app at a different API, edit `src/environments/environment.development.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url',
};
```

After any backend schema change, regenerate the TypeScript client:

```bash
# Requires the backend running at localhost:8000
make generate-models
```

---

## Project Structure

```
src/app/
├── core/
│   ├── guards/          ← auth, public, optional-auth route guards
│   ├── interceptors/    ← injects Bearer token on every outgoing request
│   ├── models/          ← OpenAPI-generated TypeScript models (do not edit)
│   └── services/        ← album, artist, auth, activity, review, user, like, favorite
│
├── features/
│   ├── activity/        ← activity feed
│   ├── albums/          ← album detail, review editor
│   ├── artists/         ← artist detail with discography
│   ├── auth/            ← login, register
│   ├── home/            ← trending albums, recent reviews, following feed
│   ├── profile/         ← profile view, edit profile, edit favorites
│   ├── search/          ← search page; doubles as the review entry point
│   └── user-connections/← followers and following lists
│
├── layout/              ← root shell: navbar + router outlet
│
└── shared/
    ├── album-grid/      ← reusable album grid with optional rating overlay
    ├── carousel/        ← horizontal scroll carousel
    ├── like-button/
    ├── logo/
    ├── mobile-header/
    └── navbar/          ← desktop sidebar navigation
```

---

## Roadmap

- [ ] Album lists — custom collections
- [x] Artist pages
- [x] Review creation flow and editor
- [x] Activity feed
- [x] Likes on reviews
- [x] Search — albums, artists, users
- [x] Edit profile and favorites
- [x] User profiles with diary
- [x] Follow system
- [x] Auth — register and login
- [x] Album detail with community reviews

---

## License

MIT

# Vercel Daily

Vercel Daily is a production-style news publication built with Next.js for the Vercel Solution Partner Certification practical exercise. The app presents featured stories, search and category filtering, breaking news, article pages, trending recommendations, and subscriber-only article access.

The goal of this implementation is to demonstrate a clean App Router architecture, server-first data loading, Vercel-oriented caching, and a simple subscription flow backed by the exercise API.

## Links

- Source code: [github.com/grilomatheus/vercel-daily](https://github.com/grilomatheus/vercel-daily)
- Live app: [vercel-daily-wine.vercel.app](https://vercel-daily-wine.vercel.app/)

## Features

- Featured article landing page with a breaking news banner.
- Article search with keyword and category filters persisted in the URL.
- Dynamic article detail pages at `/articles/[slug]`.
- Subscriber-only full article content with teaser fallback for guests.
- Subscribe and unsubscribe actions using Server Actions.
- HTTP-only subscription cookie for access state.
- Trending article sidebar with current-article exclusion.
- Route transition feedback for client navigation.
- Loading skeletons for streamed sections.
- Metadata and Open Graph fields for the main routes and article pages.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9

## Application Routes

| Route              | Purpose                                                                              |
| ------------------ | ------------------------------------------------------------------------------------ |
| `/`                | Home page with breaking news, hero content, subscription CTA, and featured articles. |
| `/search`          | Search and filter interface for browsing recent articles.                            |
| `/articles/[slug]` | Article detail page with gated full content and trending recommendations.            |

## Architecture Notes

### Server-first rendering

Most data fetching happens in Server Components. The home, search, and article routes load API data on the server, which keeps sensitive API headers out of the browser and makes the pages easier to cache.

### Data access layer

`lib/api.ts` centralizes all API integration:

- URL construction and query parameter mapping.
- Protected API request headers.
- Response envelope handling.
- API-to-UI data normalization.
- Typed article, category, breaking news, and subscription models.

The UI works with normalized application types instead of raw API payloads.

### Caching strategy

The project uses Next.js caching primitives where the data can safely be reused:

- Article lists are cached for minutes and tagged with `articles`.
- Individual articles are cached for hours and tagged with `article:[slug]`.
- Categories are cached for days and tagged with `categories`.
- Breaking news, trending articles, and subscription operations use `no-store` because they are dynamic.

Subscription Server Actions revalidate the app shell and primary listing routes after state changes.

### Subscription flow

Subscription state is stored in an HTTP-only cookie named `vercel_daily_subscription_token`.

The flow is:

1. A guest clicks Subscribe.
2. The server creates or reuses a subscription token.
3. The token is activated through the API.
4. The token is saved in an HTTP-only cookie.
5. Relevant routes are revalidated and the user is redirected back.

Article pages show teaser content to guests and full structured article content to active subscribers.

### Request proxy

`proxy.ts` runs for article routes and adds an internal `x-vercel-daily-access` request header based on whether the subscription cookie exists. The article route uses this as a quick access hint before checking the current subscription state.

## Environment Variables

Create a `.env.local` file with the following values:

| Variable           | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `API_BASE_URL`     | Base URL for the certification exercise API.                               |
| `API_BYPASS_TOKEN` | Token sent as `x-vercel-protection-bypass` when calling the protected API. |

`API_PASSWORD` is also accepted as a fallback for `API_BYPASS_TOKEN`, but `API_BYPASS_TOKEN` is the preferred name for local and Vercel environments.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint.

## Deployment

This app is designed to deploy on Vercel.

Before deploying:

1. Add `API_BASE_URL` and `API_BYPASS_TOKEN` to the Vercel project environment variables.
2. Deploy the repository to Vercel.
3. Confirm that the generated `*.vercel.app` URL can load the home page, search page, article pages, and subscription flow.

## Implementation Highlights

- App Router route structure with colocated loading states.
- Server Actions for subscription mutations.
- HTTP-only cookie handling through `next/headers`.
- Centralized API client with typed response mapping.
- Selective caching using `use cache`, `cacheTag`, and `cacheLife`.
- Dynamic metadata generation for article pages.
- Progressive navigation feedback for client-side route changes.
- Structured rendering for paragraphs, headings, blockquotes, lists, and article images.

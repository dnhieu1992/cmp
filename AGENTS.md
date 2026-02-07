# React/Next.js Best Practices (For Codex)

This repository uses React (Next.js App Router) for the web app under `apps/web`.
When generating or refactoring code, follow these rules (inspired by Vercel's React Best Practices ordering: fix waterfalls, then bundle size, then everything else).

## 1) Optimize In The Right Order

1. Eliminate async waterfalls (parallelize independent work, avoid sequential `await` chains).
2. Reduce client bundle size (keep components server-first, avoid unnecessary `use client`).
3. Then optimize re-renders, rendering, and micro-performance.

Categories to consider (in order):

- Eliminating async waterfalls
- Bundle size optimization
- Server-side performance
- Client-side data fetching
- Re-render optimization
- Rendering performance
- Advanced patterns
- JavaScript performance

## 2) Server-First Rendering

- Prefer Server Components by default. Add `"use client"` only when required (hooks, browser-only APIs, client state).
- For dashboard pages, fetch data on the server when possible, then pass to client components as props.
- Do not read request cookies on the client. Use `next/headers` on the server and forward auth to the API.

## 3) Data Fetching Rules

- Avoid client-side fetching for initial page data if it causes waterfalls.
- Use `Promise.all()` for independent requests.
- Prefer server-side data fetching for authenticated requests.
- Client-side calls must include credentials when using session cookies.

## 4) Component Design

- Keep components small and single-purpose.
- Push logic down: complex UI pieces should be extracted into reusable components.
- Keep shared UI primitives in `apps/web/src/components/ui`.
- Keep feature-specific UI under `apps/web/src/features/<feature>`.

## 5) Rendering & Re-render Hygiene

- Avoid creating new objects/functions in render when it causes rerenders downstream.
- Use `useMemo`/`useCallback` only when they prevent real work, not by default.
- Avoid expensive work on every render; compute once or move to server.

## 6) Client Bundle Hygiene

- Avoid importing heavy libraries into client components unless required.
- Prefer splitting large client-only widgets into lazy-loaded components when appropriate.

## 7) Accessibility & UX

- Controls must have labels (visual or `aria-label`).
- Buttons and form controls must have clear disabled/loading states.
- Dialogs should support closing via outside click and Escape where possible.

## 8) Error Handling

- Use shared helpers for consistent error messages (e.g. `apps/web/src/utils/getErrorMessage.ts`).
- Server APIs should validate inputs (DTO + `class-validator`) and return meaningful 4xx errors.

## 9) Code Style & Project Conventions

- Use existing wrappers in `apps/web/src/components/ui` (MUI-based) unless there is a strong reason not to.
- Prefer TypeScript types in `apps/web/src/types`.
- Prefer API calls in `apps/web/src/services`, split server vs client when needed.

# Plan Checklist

## Scope & Architecture

- [ x ] Choose project domain (blog + landing + catalog + admin) and main flows (publish, preview, search, auth)
- [ x ] Decide Next.js rendering strategy: SSG / ISR / SSR for each route
- [ x ] Design high-level components: Next.js (FE), BE (NestJS/Express), DB, CDN, object storage

## Repo & Dev Workflow

- [ X ] Initialize repo & standardize dev workflow
- [ X ] Create monorepo (pnpm) or two separate repos (web / api)
- [ x ] Set up TypeScript strict, ESLint/Prettier, lint-staged, commit convention
- [ x ] Set up env management (local/dev/prod), secrets policy

## Data Modeling

- [ x ] Define ERD + DB schema: users, roles, posts, categories/tags, media, publish states
- [ x ] Choose migration strategy (TypeORM/Prisma) + seed data

## Backend (Separate Service)

- [ ] Set up framework (NestJS/Express) + layer structure (controller/service/repo)
- [ ] Implement AuthN/AuthZ: login, refresh token/cookies, roles (admin/editor)
- [ ] Build content APIs: CRUD posts/pages, publish/schedule, list/search/filter
- [ ] Build media APIs: upload (S3 presigned or proxy), metadata
- [ ] Build public APIs: optimized read-only endpoints (by slug, pagination)
- [ ] Add validation + error handling + rate limiting + logging
- [ ] Define security headers/CORS/CSRF strategy; sanitize content output

## Webhook / Revalidate (Next.js ISR)

- [ ] Emit events on publish/update/delete → call Next.js revalidate endpoint
- [ ] Design revalidate mapping: post path, category pages, homepage, sitemap
- [ ] Protect endpoint: shared secret + allowlist/IP (if needed)

## Frontend Next.js (Public Site)

- [ ] Define App Router structure + server/client component boundaries
- [ ] Create pages: home, blog list, post detail, category/tag, search, author
- [ ] Implement data fetching from BE (SSR/SSG/ISR per plan) + caching tags
- [ ] Add UI states: loading/error/not-found, pagination

## Admin Dashboard (Frontend)

- [ ] Create protected admin routes: login, post list, editor, publish/schedule, media manager
- [ ] Add rich text editor + preview
- [ ] Implement RBAC UI + basic audit (optional)

## SEO

- [ ] Add dynamic metadata, canonical, OG image, JSON-LD
- [ ] Generate Sitemap.xml + robots.txt
- [ ] Add i18n (optional) + hreflang

## Performance

- [ ] Implement image optimization, code splitting, bundle analysis
- [ ] Define cache strategy (browser/CDN) + API caching (if applicable)
- [ ] Set Lighthouse budget + track Core Web Vitals

## Accessibility

- [ ] Ensure semantic HTML/ARIA, keyboard navigation, focus management
- [ ] Add automated a11y checks (axe) in CI

## Testing

- [ ] Write unit tests (BE services, FE utils)
- [ ] Write integration tests (API endpoints)
- [ ] Write E2E tests (Playwright): publish → revalidate → public page updates
- [ ] Add security checks (dependency audit)

## CI/CD

- [ ] Set up GitHub Actions: PR checks (lint/typecheck/tests)
- [ ] Create build artifacts + deploy pipelines for web and api (dev/prod)
- [ ] Add Lighthouse CI + a11y CI (optional)

## AWS Deploy

- [ ] Choose DB: RDS (Postgres) or DynamoDB (optional)
- [ ] Set up storage: S3 (media) + CloudFront
- [ ] Choose BE runtime: ECS/Fargate or Lambda (optional)
- [ ] Set up Next.js hosting: Lambda/SSR + CloudFront
- [ ] Configure domain + TLS (ACM), env/secrets (Secrets Manager/SSM), logging (CloudWatch)

## Observability & Ops

- [ ] Add structured logs, request tracing (basic)
- [ ] Set basic alerts (5xx rate, latency)
- [ ] Define backup/retention plan for DB

## Documentation (Portfolio-Ready)

- [ ] Write README (English): architecture, render strategy, caching/revalidate, deploy
- [ ] Write short ADRs: SSR/SSG/ISR decisions, security decisions
- [ ] Add demo links + screenshots + reports (Lighthouse/CI)

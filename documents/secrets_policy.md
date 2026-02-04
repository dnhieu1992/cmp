# Secrets Policy

- Never commit real secrets, tokens, or production credentials to git.
- Store secrets in environment variables or a secrets manager (prod).
- Use `.env.local` for local development and `.env.production` in production.
- Share secrets out-of-band (1Password/Vault/SSM), never in chat or issues.
- Rotate secrets immediately if they are exposed.
- In CI/CD, use encrypted secrets (GitHub Actions Secrets, SSM, etc.).

## Allowed In Repo

- `.env.example`, `.env.development.example`, `.env.production.example` (placeholders only).
- Public values prefixed with `NEXT_PUBLIC_`.

## Not Allowed In Repo

- `.env`, `.env.local`, `.env.production`, `.env.*` with real values.

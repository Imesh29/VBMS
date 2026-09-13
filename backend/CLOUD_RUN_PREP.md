# VBMS Backend - Google Cloud Run Preparation

This backend is prepared for the planned production architecture:

- Frontend: Vercel
- Backend: Google Cloud Run
- Database: Google Cloud SQL for PostgreSQL
- Container images: Google Artifact Registry
- CI/CD: GitHub Actions (added after a successful manual deployment)

## Local run

```bash
npm ci
npm start
```

Health check:

```text
GET http://localhost:5000/health
```

## Local Docker test

Build:

```bash
docker build -t vbms-backend .
```

When PostgreSQL is running on the host machine, use `host.docker.internal` as `DB_HOST`
in a local `.env.docker` file, then run:

```bash
docker run --rm -p 5000:8080 --env-file .env.docker vbms-backend
```

Health check:

```text
GET http://localhost:5000/health
```

## Cloud Run production variables

Configure these in Cloud Run / Secret Manager rather than committing a `.env` file:

- `NODE_ENV=production`
- `FRONTEND_URL=https://<your-vercel-domain>`
- `INSTANCE_CONNECTION_NAME=<project>:<region>:<cloud-sql-instance>`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `EMAIL_ENABLED`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

Cloud Run provides `PORT`; the application also defaults to 8080.

## Important

Do not commit `.env`, database passwords, JWT secrets, or SMTP passwords to GitHub.

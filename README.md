# AutoMinutes

AutoMinutes is a full-stack meeting assistant for managing transcripts, meeting data, action items, and AI-generated summaries. The repository contains a Spring Boot backend and a React + Vite frontend.

## Repository Layout

- `backend/` - Spring Boot API, database access, AI integration, file processing, and MinIO storage.
- `frontend/` - React + TypeScript web app built with Vite.
- `backend/docker-compose.yml` - Local PostgreSQL and MinIO services used by the backend.

## Prerequisites

- Node.js 18+ and npm
- Java 21
- Docker, if you want to run PostgreSQL and MinIO locally with the provided compose file

## Backend Setup

The backend expects PostgreSQL on port `5433` and MinIO on port `9000` by default.

1. Start the local services from the backend directory:

```bash
cd backend
docker compose up -d
```

2. Configure any required environment variables if needed. The main optional values are:

- `DEEPSEEK_API_KEY`
- `DB_PASSWORD`
- `JWT_SECRET_BASE64`
- `JWT_EXPIRATION_SECONDS`

3. Run the backend:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```bash
mvnw.cmd spring-boot:run
```

The backend application is defined in `backend/src/main/java/org/server/backend/BackendApplication.java`.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## What The App Includes

- Meeting list and meeting details views
- Transcript and action item workflows
- User and admin-facing screens
- AI-powered processing for meeting content
- File storage support through MinIO

## Notes

- The backend uses Spring Boot, PostgreSQL, MinIO, and Spring AI integrations.
- The frontend is a Vite app with React, TypeScript, and Tailwind-based styling.
- The `frontend/README.md` file contains frontend-specific boilerplate notes, but this root README is the main project overview.
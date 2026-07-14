# Invoice Generator — Backend

REST API for an invoice automation tool. Built with **Fastify**, **Prisma**, **PostgreSQL**, and **TypeScript**. Supports authentication via Magic Link and Google OAuth, OCR-based timesheet extraction with Gemini AI, and full invoice lifecycle management.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js (ESM)                       |
| Framework    | Fastify 5                           |
| Language     | TypeScript 5                        |
| ORM          | Prisma 6                            |
| Database     | PostgreSQL 16                       |
| Auth         | JWT (`@fastify/jwt`), Google OAuth  |
| Validation   | Zod + `fastify-type-provider-zod`   |
| AI / OCR     | Google Gemini (`@google/genai`)     |
| Container    | Docker + Docker Compose             |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for the database)
- A Google Cloud project with OAuth 2.0 credentials (for Google login)
- A Google Gemini API key (for OCR)

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:victorhugo156/invoice-generator-backend.git
cd invoice-generator-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root based on the variables below:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/invoice_db"

NODE_ENV=development
PORT=3333

JWT_SECRET=your_jwt_secret_here
EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

### 6. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:3333`.

---

## Available Scripts

| Script                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `npm run dev`           | Start dev server with hot reload (`tsx watch`)   |
| `npm run build`         | Compile to `dist/` with `tsup`                   |
| `npm start`             | Run the compiled production build                |
| `npm run lint`          | Run ESLint on all TypeScript files               |
| `npm run prisma:generate` | Regenerate Prisma client                       |
| `npm run prisma:migrate` | Apply pending migrations (dev)                  |
| `npm run prisma:deploy` | Apply migrations (production)                    |

---

## API Routes

### Auth

| Method | Route             | Description                        | Auth required |
|--------|-------------------|------------------------------------|---------------|
| POST   | `/auth/register`  | Register a new user                | No            |
| POST   | `/auth/login`     | Login and receive a JWT token      | No            |
| GET    | `/auth/me`        | Return the authenticated user data | Yes           |

### Profile

| Method | Route      | Description                              | Auth required |
|--------|------------|------------------------------------------|---------------|
| GET    | `/profile` | Get user profile and company details     | Yes           |
| PUT    | `/profile` | Create or update profile/company details | Yes           |

### OCR

| Method | Route          | Description                                       | Auth required |
|--------|----------------|---------------------------------------------------|---------------|
| POST   | `/ocr/extract` | Upload a timesheet image and extract worked hours | Yes           |

### Invoices

| Method | Route                   | Description                          | Auth required |
|--------|-------------------------|--------------------------------------|---------------|
| GET    | `/invoices/next-number` | Preview the next invoice number      | Yes           |
| POST   | `/invoices/preview`     | Calculate totals before saving       | Yes           |
| POST   | `/invoices`             | Save a draft or finalised invoice    | Yes           |
| GET    | `/invoices`             | List all invoices for the user       | Yes           |
| GET    | `/invoices/:id`         | Get a single invoice by ID           | Yes           |
| PATCH  | `/invoices/:id`         | Update a draft invoice               | Yes           |

> All protected routes require an `Authorization: Bearer <token>` header.

---

## Database Schema

The Prisma schema is located at `prisma/schema.prisma`.

- **User** — stores user accounts. Supports `GOOGLE` and `MAGIC_LINK` auth providers.
- **MagicLink** — stores one-time login tokens linked to a user.

---

## Project Structure

```
src/
├── app.ts              # Fastify app instance and plugin registration
├── server.ts           # Server entry point
├── config/
│   └── env.ts          # Environment variable validation with Zod
├── http/
│   ├── error-handler.ts
│   └── routes/
│       ├── auth.ts
│       └── profile.ts
└── lib/
    └── prisma.ts       # Prisma client singleton
prisma/
├── schema.prisma
└── migrations/
```

---

## License

MIT

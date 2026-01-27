# Lynkr Server - Node.js + Express + TypeScript

Lynkr Freelancing Platform backend server built with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (existing Lynkr database)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd server-node
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and update with your actual values:

```bash
cp .env.example .env
```

**Important**: Update the `DATABASE_URL` in `.env` to match your existing PostgreSQL database connection string from the Java server.

Example:
```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/lynkr_db"
```

### 3. Generate Prisma Schema from Existing Database

Since you have an existing database, run this command to introspect and generate the Prisma schema:

```bash
npm run prisma:pull
```

This will analyze your existing database and create all the models in `prisma/schema.prisma`.

### 4. Generate Prisma Client

After pulling the schema, generate the Prisma Client:

```bash
npm run prisma:generate
```

### 5. Run the Server

Development mode with hot reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Prisma schema (database models)
├── src/
│   ├── config/
│   │   └── config.ts          # Environment configuration
│   ├── data-server-clients/
│   │   └── prisma-client.ts   # Prisma client singleton
│   ├── enum/
│   │   └── UserRole.ts        # Enumerations
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT authentication
│   │   ├── error-handler.ts       # Global error handler
│   │   └── validation.middleware.ts
│   ├── modules/               # Feature modules (16 modules)
│   │   ├── admin/             # Admin management
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── admin.repository.ts
│   │   │   ├── admin.route.ts
│   │   │   └── types/
│   │   ├── auth/              # Authentication & authorization
│   │   ├── chat/              # Real-time chat (Socket.io)
│   │   ├── escrow/            # Escrow management
│   │   ├── file/              # File upload & management
│   │   ├── meeting/           # Video meetings (Agora)
│   │   ├── notification/      # Notifications
│   │   ├── operation/         # Operations management
│   │   ├── payment/           # Payment processing (Stripe)
│   │   ├── profile/           # User profiles & portfolios
│   │   ├── proposal/          # Proposals
│   │   ├── review/            # Reviews & ratings
│   │   ├── service/           # Service catalog
│   │   ├── settings/          # System settings
│   │   ├── subscription/      # Subscription plans
│   │   └── user/              # User management
│   ├── services/              # Shared services
│   │   ├── email.service.ts   # Email service (Nodemailer)
│   │   └── queue.service.ts   # Queue service (Bull)
│   ├── utils/
│   │   ├── app-error.ts       # Custom error class
│   │   ├── catch-async.ts     # Async error wrapper
│   │   ├── hashing-handler.ts # Password hashing (bcrypt)
│   │   └── ...
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── uploads/                   # Uploaded files
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:pull` - Introspect database and update schema
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication (Coming Soon)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users (Coming Soon)
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Architecture

This server follows a clean, modular architecture:

- **Repository Pattern**: Data access layer with Prisma
- **Service Layer**: Business logic
- **Controller Layer**: Request handling
- **Singleton Pattern**: For repositories and database client
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling with custom AppError class

## Migration from Java Server

This Node.js server replaced the original Spring Boot WebFlux server while maintaining:
- Same database schema (PostgreSQL with Prisma ORM)
- Same API endpoints and contracts
- Same business logic and features
- Improved developer experience with TypeScript
- Better performance with async/await patterns
- Simplified deployment with Node.js ecosystem

## Current Status

✅ **Fully Implemented Features:**
1. Core infrastructure setup
2. Authentication module (JWT, Google OAuth, Session management)
3. User module (CRUD operations, profile management)
4. Profile module (Education, Work History, Portfolio, Languages)
5. Operation module (Operations, Proposals, Status management)
6. Payment module (Stripe integration, Transactions, Escrow)
7. Subscription module (Plans, User subscriptions)
8. Communication module (Messages, Notifications, Real-time chat)
9. Meeting module (Agora video conferencing)
10. Review & Rating system
11. File upload and management
12. WebSocket support (Socket.io)
13. Email service (Nodemailer)
14. Background jobs (Bull + Redis)

## Support

For issues or questions, please refer to the main README and documentation.

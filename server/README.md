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
server-node/
├── prisma/
│   └── schema.prisma          # Prisma schema (auto-generated from DB)
├── src/
│   ├── config/
│   │   └── config.ts          # Environment configuration
│   ├── data-server-clients/
│   │   └── prisma-client.ts   # Prisma client singleton
│   ├── enum/
│   │   └── UserRole.ts        # Enums
│   ├── middlewares/
│   │   └── error-handler.ts   # Global error handler
│   ├── modules/               # Feature modules
│   │   └── user/              # User module example
│   │       ├── types/
│   │       │   └── IUser.ts
│   │       ├── user.repository.ts
│   │       ├── user.service.ts
│   │       ├── user.controller.ts
│   │       └── user.route.ts
│   ├── utils/
│   │   ├── app-error.ts       # Custom error class
│   │   ├── catch-async.ts     # Async error wrapper
│   │   └── hashing-handler.ts # Password hashing
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
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
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Users (Coming Soon)
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

## Architecture

This server follows a clean, modular architecture:

- **Repository Pattern**: Data access layer with Prisma
- **Service Layer**: Business logic
- **Controller Layer**: Request handling
- **Singleton Pattern**: For repositories and database client
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling with custom AppError class

## Migration from Java Server

This Node.js server is designed to replace the existing Spring Boot WebFlux server while maintaining:
- Same database schema
- Same API endpoints
- Same business logic
- Improved developer experience with TypeScript

## Next Steps

1. ✅ Core infrastructure setup
2. 🔄 Implement User module
3. ⏳ Implement Authentication module
4. ⏳ Implement all other modules (Profile, Operation, Payment, etc.)
5. ⏳ Add WebSocket support for real-time features
6. ⏳ Complete testing and verification

## Support

For issues or questions, please refer to the implementation plan document.

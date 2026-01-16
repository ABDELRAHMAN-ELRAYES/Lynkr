# Lynkr

## Overview

A comprehensive service marketplace platform connecting clients with skilled service providers. Lynkr facilitates seamless project management, secure payments, and professional collaboration through an intuitive web-based platform.

## Features

### Core Platform Features

- **User Authentication & Account Management**: Secure registration, login, Google OAuth integration, and profile management.
- **Service Discovery & Search**: Advanced search with filters, categories, and provider matching.
- **Provider Onboarding**: Detailed multi-step provider application and verification process.
- **Project Management**: Real-time collaboration workspaces, milestone tracking, and progress monitoring.
- **Communication System**: Built-in real-time chat (Socket.io) and video conferencing (Agora) with screen sharing.
- **Payment Processing**: Secure escrow system with Stripe integration (Split payments, release on completion).
- **Teaching & Scheduling**: Calendar availability management and video session booking.
- **Admin Dashboard**: Complete platform management, user moderation, and report handling.

### Advanced Features

- Real-time notifications and activity feed.
- Comprehensive portfolio management and verification.
- Report and dispute resolution system.
- Subscription plans for providers.
- Mobile-responsive design (React + Tailwind).

## 🛠️ Technology Stack

### Frontend

- **React 19** with **TypeScript** - Modern UI development.
- **Vite** - Lightning-fast build tool and development server.
- **Tailwind CSS 4** - Utility-first CSS framework.
- **React Hook Form** - Form state management with Zod validation.
- **Zustand** - Lightweight application state management.
- **React Router 7** - Client-side routing.
- **Socket.io Client** - Real-time bidirectional communication.
- **Agora RTC React** - Real-time video/audio communication.
- **Stripe React Elements** - Secure payment components.
- **Radix UI** - Accessible component primitives.
- **Framer Motion** - Smooth animations and transitions.

### Backend

- **Node.js 18+** - JavaScript runtime.
- **Express 4** - Fast, minimalist web framework.
- **TypeScript** - Type-safe development.
- **Prisma 5** - Next-generation ORM with type safety.
- **PostgreSQL 14+** - Primary relational database.
- **Redis** - Caching and session storage (future implementation).
- **Socket.io** - Real-time event server.

### DevOps & Tools

- **Docker** - Containerization.
- **GitHub Actions** - CI/CD pipelines (planned).
- **Husky** - Git hooks.
- **Nodemon** - Development server with hot reload.

### Third-party Services

- **Stripe** - Payment processing and escrow.
- **Agora** - Real-time video conferencing.
- **SendGrid / Nodemailer** - Email service integration.
- **Google OAuth 2.0** - Social authentication.
- **Multer** - File upload handling (Local/S3).

## 📋 Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** or **pnpm**
- **Git**

## 🚀 Quick Start

### Manual Setup

#### Backend Setup

1.  **Navigate to server directory**
    ```bash
    cd server
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Configure environment variables**
    ```bash
    cp .env.example .env
    # Edit .env with your database credentials (DATABASE_URL, etc.)
    ```
4.  **Database Migration**
    ```bash
    npx prisma migrate dev
    ```
5.  **Start the development server**
    ```bash
    npm run dev
    ```

#### Frontend Setup

1.  **Navigate to web directory**
    ```bash
    cd web
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Configure environment variables**
    ```bash
    cp .env.example .env
    # Edit .env with your API configuration
    ```
4.  **Start development server**
    ```bash
    npm run dev
    ```

## 📁 Project Structure

```
lynkr/
├── web/                     # React 19 frontend application
│   ├── src/
│   │   ├── app/             # App configuration
│   │   ├── features/        # Feature-based modules (auth, project, etc.)
│   │   ├── shared/          # Shared components, hooks, services
│   │   ├── assets/          # Static assets
│   │   └── main.tsx         # Entry point
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── modules/         # Feature modules (Controller-Service-Repository pattern)
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── provider/
│   │   │   ├── project/
│   │   │   ├── ... (16+ modules)
│   │   ├── config/          # App config
│   │   ├── middlewares/     # Auth & Error handling
│   │   ├── utils/           # Helpers
│   │   └── app.ts           # Express setup
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
├── documents/               # Project documentation & specs
```

## ⚙️ Configuration

### Key Environment Variables

Create a `.env` file in `server/` with the following:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lynkr?schema=public"

# Auth
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:8080/api/v1/auth/google/callback"

# Stripe
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Agora
AGORA_APP_ID="..."
AGORA_APP_CERTIFICATE="..."
```

## 📚 API Documentation

The API follows RESTful principles. Key resources:

-   `/api/v1/auth` - Authentication
-   `/api/v1/users` - User management
-   `/api/v1/projects` - Project workspace
-   `/api/v1/provider-profiles` - Public profiles

## License

This project is licensed under the MIT License.

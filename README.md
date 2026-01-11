# Lynkr

## Sep - 2025

A comprehensive service marketplace platform connecting clients with skilled service providers. Lynkr facilitates seamless project management, secure payments, and professional collaboration through an intuitive web-based platform.

## Features

### Core Platform Features

- **User Authentication & Account Management**: Secure registration, login, OAuth integration, and profile management
- **Service Discovery & Search**: Advanced search with filters, categories, and provider matching
- **Order Management**: Comprehensive order creation, tracking, and proposal system
- **Project Management**: Real-time collaboration tools, milestone tracking, and progress monitoring
- **Communication System**: Built-in chat, video conferencing, and meeting scheduling
- **Payment Processing**: Secure escrow system with Stripe integration and milestone-based payments
- **Rating & Review System**: Comprehensive feedback system with quality control
- **Admin Dashboard**: Complete platform management and content moderation tools

### Advanced Features

- Real-time notifications and updates
- Portfolio management and verification
- SEO optimization and marketing tools
- Advanced analytics and reporting
- Mobile-responsive design

## 🛠️ Technology Stack

### Frontend

- **React 19** with **TypeScript** - Modern UI development with latest concurrent features
- **Vite 7** - Lightning-fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hook Form** - Form state management with validation
- **Zustand** - Lightweight application state management
- **React Router 7** - Client-side routing
- **Socket.io Client** - Real-time communication
- **STOMP.js** - WebSocket messaging protocol
- **Agora RTC** - Real-time video/audio communication
- **Stripe React** - Payment processing integration
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions

### Backend

- **Node.js 18+** with **Express 4** - Fast, minimalist web framework
- **TypeScript 5** - Type-safe JavaScript development
- **Prisma 5** - Next-generation ORM with type safety
- **PostgreSQL 14+** - Primary database
- **Redis (ioredis)** - Caching and session storage
- **Bull** - Queue management for background jobs
- **Socket.io** - Real-time bidirectional communication

### DevOps & Tools

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy and static file serving
- **tsx** - TypeScript execution for development
- **Nodemon** - Development server with hot reload

### Third-party Services

- **Stripe** - Payment processing and escrow
- **Agora** - Real-time video conferencing
- **Nodemailer** - Email service integration
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Social authentication
- **Multer** - File upload handling

## 📋 Prerequisites

- **Node.js** 18+ with npm, yarn, or pnpm
- **PostgreSQL** 14+
- **Redis** 6+
- **Docker** and Docker Compose (recommended)
- **Git**

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/lynkr.git
   cd lynkr
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**

   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Admin Dashboard: http://localhost:5173/admin

### Manual Setup

#### Backend Setup

1. **Navigate to server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Generate Prisma client**

   ```bash
   npm run prisma:generate
   # For existing database: npm run prisma:pull
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to web directory**

   ```bash
   cd web
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

## 📁 Project Structure

```
lynkr/
├── web/                     # React 19 frontend application
│   ├── src/
│   │   ├── app/             # App configuration and routing
│   │   ├── features/        # Feature modules (feature-based architecture)
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── home/        # Home/landing pages
│   │   │   ├── operations/  # Operation management
│   │   │   ├── payment/     # Payment pages
│   │   │   ├── profile/     # User profile pages
│   │   │   ├── project/     # Project management
│   │   │   └── services/    # Service pages
│   │   ├── shared/          # Shared modules
│   │   │   ├── components/  # Reusable UI components (34 components)
│   │   │   ├── constants/   # Application constants
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Third-party library configs
│   │   │   ├── services/    # API service layer (12 services)
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── utils/       # Utility functions
│   │   ├── assets/          # Assets (fonts, etc.)
│   │   ├── styles/          # Global styles
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   │   ├── images/          # Image assets
│   │   └── logo/            # Logo files
│   ├── package.json
│   └── vite.config.ts
├── server/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── modules/         # Feature modules (16 modules)
│   │   │   ├── admin/       # Admin management
│   │   │   ├── auth/        # Authentication & authorization
│   │   │   ├── chat/        # Real-time messaging
│   │   │   ├── escrow/      # Escrow management
│   │   │   ├── file/        # File upload & management
│   │   │   ├── meeting/     # Video conferencing (Agora)
│   │   │   ├── notification/# Notification system
│   │   │   ├── operation/   # Operations management
│   │   │   ├── payment/     # Payment processing (Stripe)
│   │   │   ├── profile/     # User profiles & portfolios
│   │   │   ├── proposal/    # Proposal management
│   │   │   ├── review/      # Reviews & ratings
│   │   │   ├── service/     # Service catalog
│   │   │   ├── settings/    # System settings
│   │   │   ├── subscription/# Subscription plans
│   │   │   └── user/        # User management
│   │   ├── config/          # Configuration files
│   │   ├── data-server-clients/ # Database clients (Prisma)
│   │   ├── enum/            # Enumerations
│   │   ├── middlewares/     # Express middlewares
│   │   ├── services/        # Shared services (email, queue)
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Prisma database schema
│   ├── uploads/             # File uploads directory
│   ├── package.json
│   └── tsconfig.json
├── documents/               # Project documentation
├── docker-compose.yml       # Docker services configuration
├── .env.example             # Environment variables template
└── README.md
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_Name=postgresql://localhost:5432/lynkr_db
DATABASE_USERNAME=lynkr_user
DATABASE_PASSWORD=your_password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret
JWT_DURATION_IN_DAYS=86400

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=lynkr-uploads

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 🗄️ Database

### Database Migrations

Lynkr uses Liquibase for database schema management. Migrations are located in `backend/src/main/resources/db/changelog/`.

**Run migrations:**

```bash
./mvnw liquibase:update
```

**Generate new migration:**

```bash
./mvnw liquibase:diff
```

**Rollback migration:**

```bash
./mvnw liquibase:rollback -Dliquibase.rollbackCount=1
```

## Testing

### Backend Testing

```bash
cd backend
./mvnw test
```

### Frontend Testing

```bash
cd frontend
pnpm run test
# or
yarn test
```

### End-to-End Testing

```bash
npm run test:e2e
```

## 📚 API Documentation

API documentation is available at:

- **Postman**

## Deployment

### Production Deployment

1. **Build the application**

   ```bash
   # Build frontend
   cd frontend && npm run build

   # Build backend
   cd backend && ./mvnw clean package
   ```

2. **Deploy with Docker**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5173;
       }

       location /api {
           proxy_pass http://localhost:8080;
       }
   }
   ```

### CI/CD Pipeline

The project includes GitHub Actions workflows for:

- Automated testing
- Security scanning
- Docker image building
- Deployment to staging/production

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ./mvnw test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript and Java coding standards
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all CI checks pass

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-org/lynkr/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/lynkr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/lynkr/discussions)
- **Email**: support@lynkr.com

## Acknowledgments

- [Spring WebFlux](https://spring.io/reactive) for reactive backend architecture
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Stripe](https://stripe.com/) for payment processing
- All open-source contributors and maintainers

---

**Built with ❤️ by the Lynkr Team**

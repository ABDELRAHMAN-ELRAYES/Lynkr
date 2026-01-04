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

- **React 18** with **TypeScript** - Modern UI development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Zustand/Redux Toolkit** - Application state management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication

### Backend

- **Spring Boot 3** with **Spring WebFlux** - Reactive web framework
- **Java 17+** - Programming language
- **PostgreSQL 14+** - Primary database
- **Redis** - Caching and session storage
- **Elasticsearch** - Search and indexing
- **Liquibase** - Database migration management

### DevOps & Tools

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy and static file serving
- **Let's Encrypt** - SSL certificates

### Third-party Services

- **Stripe** - Payment processing
- **AWS S3** - File storage
- **Socket.io** - Real-time communication
- **Google OAuth** - Social authentication

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **Java** 17+
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

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Configure database**

   ```bash
   # Create PostgreSQL database
   createdb lynkr_db

   # Update application.yml with your database credentials
   ```

3. **Run database migrations**

   ```bash
   ./mvnw liquibase:update
   ```

4. **Start the backend server**
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

## 📁 Project Structure

```
lynkr/
├── web/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   │   └── com/lynkr/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access layer
│   │       ├── entity/      # Entity models
│   │       ├── filters/     # Filters
│   │       ├── security/    # Security Configrations
│   │       └── dto/         # Data transfer objects
│   ├── src/main/resources/
│   │   ├── db/changelog/    # Liquibase migrations
│   │   └── application.yml  # Application configuration
│   └── pom.xml
├── docker-compose.yml       # Docker services configuration
├── .env.example            # Environment variables template
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

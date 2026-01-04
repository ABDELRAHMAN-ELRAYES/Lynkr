# Lynkr Frontend

A modern React-based frontend for the Lynkr service marketplace platform. Built with TypeScript, Vite, and Tailwind CSS to deliver a seamless user experience for connecting clients with skilled service providers.

## Tech Stack

- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form library with easy validation
- **Zustand/Redux Toolkit** - Lightweight state management
- **React Router** - Client-side routing and navigation
- **Socket.io Client** - Real-time communication
- **React Query** - Server state management and caching
- **Framer Motion** - Smooth animations and transitions

## 📋 Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm** (pnpm recommended)
- **Git**

## Quick Start

### 1. Clone and Navigate

```bash
git clone https://github.com/your-org/lynkr.git
cd lynkr/web
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_ENVIRONMENT=development
```

### 4. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📁 Project Structure

```
web/
├── public/                 # Static assets
│   ├── icons/             # App icons and favicons
│   └── images/            # Static images
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Basic UI components (buttons, inputs, etc.)
│   │   ├── forms/        # Form-specific components
│   │   ├── layout/       # Layout components (header, sidebar, etc.)
│   │   └── shared/       # Shared business logic components
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── services/     # Service-related pages
│   │   ├── orders/       # Order management pages
│   │   └── profile/      # User profile pages
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication hook
│   │   ├── useSocket.ts  # Socket.io integration
│   │   └── useApi.ts     # API integration hooks
│   ├── store/            # State management
│   │   ├── authStore.ts  # User authentication state
│   │   ├── orderStore.ts # Order management state
│   │   └── uiStore.ts    # UI state (modals, notifications)
│   ├── services/         # API service layer
│   │   ├── api.ts        # Axios configuration
│   │   ├── auth.ts       # Authentication services
│   │   ├── orders.ts     # Order management services
│   │   └── users.ts      # User management services
│   ├── types/            # TypeScript type definitions
│   │   ├── api.ts        # API response types
│   │   ├── user.ts       # User-related types
│   │   └── order.ts      # Order-related types
│   ├── utils/            # Utility functions
│   │   ├── format.ts     # Data formatting utilities
│   │   ├── validation.ts # Form validation schemas
│   │   └── constants.ts  # Application constants
│   ├── styles/           # Global styles
│   │   └── globals.css   # Global CSS and Tailwind imports
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type definitions
├── .env.example          # Environment variables template
├── .env.local            # Local environment variables (git-ignored)
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🛠️ Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm type-check

# Analyze bundle size
pnpm analyze
```

## Styling Guidelines

### Tailwind CSS

We use Tailwind CSS for styling with a utility-first approach:

```tsx
// Good: Utility classes for styling
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>;

// Custom components for reusable styles
const Button = ({ variant = "primary", children, ...props }) => {
  const baseClasses = "font-bold py-2 px-4 rounded transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

### Design System

- **Colors**: Follow the Tailwind color palette with custom brand colors defined in `tailwind.config.js`
- **Typography**: Use Tailwind typography utilities with consistent heading hierarchy
- **Spacing**: Use Tailwind spacing scale (4px increments)
- **Breakpoints**: Mobile-first responsive design with Tailwind breakpoints

## State Management

### Zustand Store Pattern

```tsx
// store/authStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        login: async (credentials) => {
          const user = await authService.login(credentials);
          set({ user, isAuthenticated: true });
        },
        logout: () => {
          set({ user: null, isAuthenticated: false });
        },
      }),
      { name: "auth-storage" }
    )
  )
);
```

### Usage in Components

```tsx
const LoginPage = () => {
  const { login, isAuthenticated } = useAuthStore();

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm onSubmit={handleLogin} />;
};
```

## 🔌 API Integration

### API Service Layer

```tsx
// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Custom Hooks for API

```tsx
// hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orders";

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => orderService.getOrders(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
```

## Testing

### Testing Setup

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **MSW** - Mock Service Worker for API mocking

### Writing Tests

```tsx
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx
```

## 🚀 Build and Deployment

### Build Process

```bash
# Production build
pnpm build

# Preview build locally
pnpm preview

# Analyze bundle size
pnpm analyze
```

### Environment-Specific Builds

```bash
# Development build
pnpm build:dev

# Staging build
pnpm build:staging

# Production build
pnpm build:prod
```

### Deployment

The frontend is built as static files and can be deployed to:

- **Netlify** - Connect to GitHub repo for auto-deployment
- **Vercel** - Zero-config deployment platform
- **AWS S3 + CloudFront** - Scalable static hosting
- **Docker** - Containerized deployment with Nginx

## Performance Optimization

### Code Splitting

```tsx
// Lazy load pages for better initial load times
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));

const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Image Optimization

```tsx
// Use modern image formats and lazy loading
const ProfileImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="w-32 h-32 rounded-full object-cover"
  />
);
```

### Bundle Analysis

```bash
# Analyze bundle size and dependencies
pnpm analyze

# Check for unused dependencies
npx depcheck

# Check for security vulnerabilities
pnpm audit
```

## Security Best Practices

- **XSS Prevention**: Sanitize user inputs and use React's built-in escaping
- **CSRF Protection**: Use proper authentication headers
- **Secure Storage**: Never store sensitive data in localStorage
- **Input Validation**: Validate all forms with proper schemas
- **HTTPS Only**: Ensure all API calls use HTTPS in production

## Code Style Guidelines

### TypeScript

```tsx
// Use proper typing for props
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

// Use proper typing for API responses
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
```

### Component Patterns

```tsx
// Use functional components with hooks
const UserProfile: FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  return <UserCard user={user} />;
};
```

## Debugging

### Development Tools

- **React DevTools** - Component debugging
- **Redux DevTools** - State management debugging
- **Vite DevTools** - Build process debugging

### Error Boundary

```tsx
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 🤝 Contributing

### Setup for Contributors

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes and test thoroughly
6. Run linting: `pnpm lint`
7. Run tests: `pnpm test`
8. Commit changes: `git commit -m 'feat: add amazing feature'`
9. Push to your fork: `git push origin feature/amazing-feature`
10. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode guidelines
- Use ESLint and Prettier for code formatting
- Write tests for new components and features
- Follow conventional commit message format
- Ensure all CI checks pass

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/lynkr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/lynkr/discussions)
- **Frontend Team**: frontend-team@lynkr.com

---

**Happy coding! **

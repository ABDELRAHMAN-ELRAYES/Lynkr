// * Auth Hook

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CLIENT"
  | "PROVIDER"
  | "PENDING_PROVIDER"
  | "REJECTED_PROVIDER";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password?:string;
  isActive: boolean;
  role: UserRole;
};

// * Login Form
export type LoginFormData = {
  email: string;
  password: string;
};

// * Signup Form
export type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
};

export type SignupFormErrors = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
}>;

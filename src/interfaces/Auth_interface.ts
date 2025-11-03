// Interface for user login data transfer object
export interface UserLoginDto {
  email: string; // User's email address
  password: string; // User's password
  role: string; // User's role
}

// Interface for a simplified user object, typically used after authentication
export interface User {
  userId: string; // Unique identifier for the user
  email: string; // User's email address
  role: string; // User's role
}

// Interface for the response received after a successful login attempt
export interface LoginResponse {
  token: string; // Authentication token (e.g., JWT)
  user: User; // User object containing basic user information
}
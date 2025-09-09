export interface UserLoginDto {
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
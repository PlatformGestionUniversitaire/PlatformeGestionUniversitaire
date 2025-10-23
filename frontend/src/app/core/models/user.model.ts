export type UserRole = 'student' | 'teacher' | 'admin' | 'director';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  // Le rôle sera automatiquement 'student' ou assigné par l'admin
}

export interface AuthResponse {
  user: User;
  // Backend returns access_token (JWT) and token_type
  access_token: string;
  token_type?: string;
}

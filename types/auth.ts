/**
 * Authentication & User types for Lab 8.
 */

export type UserRole = 'student' | 'organizer' | 'admin';

export type User = {
  id: string;
  email: string;
  studentId: string;
  name: string;
  faculty: string;
  role: UserRole;
  avatarUrl?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = AuthTokens & {
  user: User;
};

export type SessionState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; accessToken: string; refreshToken: string; user: User };

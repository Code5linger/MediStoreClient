// 'use client';

// import { createAuthClient } from 'better-auth/react';

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000',
// });

// export const { signIn, signUp, signOut, useSession } = authClient;

// lib/auth-client.ts

// 'use client';

// import { createAuthClient } from 'better-auth/react';

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000',
// });

// // ✅ Export the original hooks
// export const { signIn, signUp, signOut, useSession } = authClient;

// // Optional: TypeScript typing for session user
// export interface SessionUser {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image?: string | null;
//   role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
// }

// export interface Session {
//   user: SessionUser;
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

'use client';

import { createAuthClient } from 'better-auth/react';
import type { Session } from 'better-auth/types';

// Define your custom user type
export interface CustomUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

// Extend Better Auth session type
export interface CustomSession extends Omit<Session, 'user'> {
  user: CustomUser;
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000',
});

// Export the hooks with proper typing
export const { signIn, signUp, signOut } = authClient;

// Create a typed version of useSession
export const useSession = () => {
  return authClient.useSession() as {
    data: CustomSession | null;
    isPending: boolean;
    error: Error | null;
  };
};

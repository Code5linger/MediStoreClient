'use client';

import { createAuthClient } from 'better-auth/react';
import type { Session } from 'better-auth/types';

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

export interface CustomSession extends Omit<Session, 'user'> {
  user: CustomUser;
}

// 🔥 CHANGE THIS - use empty string to use same domain via rewrites
export const authClient = createAuthClient({
  baseURL: '', // Empty = use current domain (rewrites will handle it)
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut } = authClient;

export const useSession = () => {
  return authClient.useSession() as {
    data: CustomSession | null;
    isPending: boolean;
    error: Error | null;
  };
};

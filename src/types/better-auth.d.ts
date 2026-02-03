// types/better-auth.d.ts
import 'better-auth/types';

declare module 'better-auth/types' {
  interface User {
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
    phone?: string;
  }
}

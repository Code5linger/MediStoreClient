// 'use client';

// import { useSession } from '@/lib/auth-client';

// export default function AuthSessionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // This hydrates the session EARLY
//   useSession();

//   return <>{children}</>;
// }

// 'use client';

// import { AuthProvider } from 'better-auth/react';
// import { authClient } from '@/lib/auth-client';

// export default function AuthSessionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return authClient.Provider({ children });
// }

// 'use client';

// export default function AuthSessionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <>{children}</>; // Just a simple passthrough
// }

'use client';

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

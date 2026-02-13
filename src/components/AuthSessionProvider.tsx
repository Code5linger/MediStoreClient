'use client';

import { useSession } from '@/lib/auth-client';

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This hydrates the session EARLY
  useSession();

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';

const publicPaths = ['/', '/login', '/register', '/shop'];

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for session check to complete
    if (isPending) return;

    // If no session and trying to access protected route
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (!session && !isPublicPath) {
      router.push('/login');
    }
  }, [session, isPending, pathname, router]);

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

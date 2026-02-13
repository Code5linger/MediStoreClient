// 'use client';

// import { authClient } from '@/lib/auth-client';
// import { date } from 'better-auth';
// import Link from 'next/link';

// export default function Navbar() {
//   // const { data: session, isPending } = useSession();
//   // const { data: session, isPending } = useSession();
//   const { data: session, isPending } = authClient.useSession();

//   // const { data: session, isPending, error } = useSession();
//   console.log('SESSION:', session, date, isPending);

//   // Don't block rendering while loading
//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-2xl font-bold text-blue-600">
//               MediStore
//             </Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             {isPending ? (
//               <div className="text-sm text-gray-500">Loading...</div>
//             ) : session?.user ? (
//               <>
//                 <span className="text-sm">Hi, {session.user.name}!</span>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Dashboard
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// 'use client';

// import { authClient } from '@/lib/auth-client';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// export default function Navbar() {
//   const { data: session, isPending, error } = authClient.useSession();
//   const [mounted, setMounted] = useState(false);

//   // ✅ Ensure hook only runs on client
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-2xl font-bold text-blue-600">
//               MediStore
//             </Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             {isPending ? (
//               <div className="text-sm text-gray-500">Loading...</div>
//             ) : session?.user ? (
//               <>
//                 <span className="text-sm">Hi, {session.user.name}!</span>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Dashboard
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// !---V1-------------------------------------------------------
// 'use client';

// import { authClient } from '@/lib/auth-client';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// export default function Navbar() {
//   const { data: session, isPending } = authClient.useSession();
//   const [mounted, setMounted] = useState(false);

//   // ✅ Use setTimeout to avoid synchronous state update
//   useEffect(() => {
//     const id = setTimeout(() => setMounted(true), 0);
//     return () => clearTimeout(id);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-2xl font-bold text-blue-600">
//               MediStore
//             </Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             {isPending ? (
//               <div className="text-sm text-gray-500">Loading...</div>
//             ) : session?.user ? (
//               <>
//                 <span className="text-sm">Hi, {session.user.name}!</span>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Dashboard
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-blue-600"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// !---V2-------------------------------------------------------
'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: serverSession, isPending, refetch } = authClient.useSession();
  const [session, setSession] = useState(serverSession);

  useEffect(() => {
    setSession(serverSession);
  }, [serverSession]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              MediStore
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session?.user ? (
              <>
                <span className="text-sm">Hi, {session.user.name}!</span>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

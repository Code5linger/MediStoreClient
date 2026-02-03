'use client';

import Link from 'next/link';
// import { useSession, signOut } from '@/lib/auth-client';
import { ShoppingCart, User, LogOut, Pill } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getRoleDashboard = () => {
    if (!session?.user) return null;
    const role = session.user.role;

    if (role === 'ADMIN') return '/admin';
    if (role === 'SELLER') return '/seller/dashboard';
    if (role === 'CUSTOMER') return '/profile';
    return null;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">MediStore</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Shop
            </Link>

            {session?.user && (
              <>
                {session.user.role === 'CUSTOMER' && (
                  <>
                    <Link
                      href="/cart"
                      className="text-gray-700 hover:text-blue-600 transition relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      My Orders
                    </Link>
                  </>
                )}

                {session.user.role === 'SELLER' && (
                  <Link
                    href="/seller/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    Dashboard
                  </Link>
                )}

                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="text-gray-500">Loading...</div>
            ) : session?.user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={getRoleDashboard() || '/profile'}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{session.user.name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

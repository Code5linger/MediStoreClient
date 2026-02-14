import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import AuthSessionProvider from '@/components/AuthSessionProvider';
import Navbar from '@/components/Navbar';
// import AuthSessionProvider from '@/components/AuthSessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediStore - Your Trusted Online Medicine Shop',
  description: 'Purchase over-the-counter medicines online with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 CLIENT session hydration boundary */}
        <AuthSessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthSessionProvider>

        <footer className="bg-gray-900 text-white" />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

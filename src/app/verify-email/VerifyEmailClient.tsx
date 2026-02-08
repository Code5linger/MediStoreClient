'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pill, CheckCircle, XCircle } from 'lucide-react';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/verify-email?token=${token}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage('Failed to verify email. The link may have expired.');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    },
    [router],
  );

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        await verifyEmail(token);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, verifyEmail]);

  // 🔥 Derived state — no effect needed
  if (!token) {
    return (
      <ErrorState
        message="Invalid verification link"
        onBack={() => router.push('/login')}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Pill className="w-12 h-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg">
          {status === 'verifying' && <LoadingState />}

          {status === 'success' && <SuccessState message={message} />}

          {status === 'error' && (
            <ErrorState
              message={message}
              onBack={() => router.push('/login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- UI states ---------- */

function LoadingState() {
  return (
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
      <p className="text-gray-600">Verifying your email…</p>
    </div>
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <div className="text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-gray-600">Redirecting to login…</p>
    </div>
  );
}

function ErrorState({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-lg font-semibold">{message}</p>
      <button
        onClick={onBack}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}

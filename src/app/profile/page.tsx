// 'use client';

// import { useEffect } from 'react';
// import { useSession } from '@/lib/auth-client';
// import { useRouter } from 'next/navigation';
// import { User, Mail, Shield } from 'lucide-react';

// export default function ProfilePage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (!session?.user) {
//       router.push('/login');
//     }
//   }, [session, router]);

//   if (!session?.user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 text-black">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8">My Profile</h1>

//         <div className="bg-white rounded-lg shadow-md p-8">
//           <div className="flex items-center space-x-4 mb-8">
//             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//               <User className="w-10 h-10 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{session.user.name}</h2>
//               <p className="text-gray-600">{session.user.email}</p>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <User className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-900">{session.user.name}</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <Mail className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-900">{session.user.email}</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Role
//               </label>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <Shield className="w-5 h-5 text-gray-400" />
//                 <span className="text-gray-900">{session.user.role}</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Verification Status
//               </label>
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     session.user.emailVerified
//                       ? 'bg-green-500'
//                       : 'bg-yellow-500'
//                   }`}
//                 />
//                 <span className="text-gray-900">
//                   {session.user.emailVerified ? 'Verified' : 'Not Verified'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <p className="text-sm text-gray-600">
//               Member since {new Date().toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Pencil, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, refetch } = useSession();
  const router = useRouter();

  const [editing, setEditing] = useState<'name' | 'email' | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
    }
  }, [session, router]);

  // Sync form fields when editing starts
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name,
        email: session.user.email,
      });
    }
  }, [session?.user, editing]);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleUpdate = async (field: 'name' | 'email') => {
    setLoading(true);
    setError(null);

    try {
      const payload =
        field === 'name' ? { name: formData.name } : { email: formData.email };

      const { error: updateError } = await authClient.user.update(payload);

      if (updateError) {
        setError(updateError.message || 'Update failed');
        setLoading(false);
        return;
      }

      // Refetch session so the UI reflects the new values
      await refetch();
      setEditing(null);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setError(null);
    setFormData({ name: session.user.name, email: session.user.email });
  };

  // Reusable: read-only field row
  const ReadOnlyField = ({
    label,
    value,
    icon: Icon,
    editable,
    fieldKey,
  }: {
    label: string;
    value: string;
    icon: React.ElementType;
    editable?: boolean;
    fieldKey?: 'name' | 'email';
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {editable && fieldKey && editing !== fieldKey && (
          <button
            onClick={() => setEditing(fieldKey)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-900">{value}</span>
      </div>
    </div>
  );

  // Reusable: editable field row
  const EditableField = ({
    fieldKey,
    label,
  }: {
    fieldKey: 'name' | 'email';
    label: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type={fieldKey === 'email' ? 'email' : 'text'}
          value={formData[fieldKey]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, [fieldKey]: e.target.value }))
          }
          className="flex-1 p-3 bg-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          autoFocus
          disabled={loading}
        />
        <button
          onClick={() => handleUpdate(fieldKey)}
          disabled={loading || !formData[fieldKey].trim()}
          className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-green-600" />
          ) : (
            <Check className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={cancelEdit}
          disabled={loading}
          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Avatar header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Name */}
            {editing === 'name' ? (
              <EditableField fieldKey="name" label="Full Name" />
            ) : (
              <ReadOnlyField
                label="Full Name"
                value={session.user.name}
                icon={User}
                editable
                fieldKey="name"
              />
            )}

            {/* Email */}
            {editing === 'email' ? (
              <EditableField fieldKey="email" label="Email Address" />
            ) : (
              <ReadOnlyField
                label="Email Address"
                value={session.user.email}
                icon={Mail}
                editable
                fieldKey="email"
              />
            )}

            {/* Role — read only */}
            <ReadOnlyField
              label="Role"
              value={session.user.role}
              icon={Shield}
            />

            {/* Email verification badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Verification Status
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${
                    session.user.emailVerified
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <span className="text-gray-900">
                  {session.user.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

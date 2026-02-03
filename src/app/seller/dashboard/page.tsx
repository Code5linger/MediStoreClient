// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from '@/lib/auth-client';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import type { Medicine, Category } from '@/types';
// import { Plus, Edit, Trash2, Pill } from 'lucide-react';
// import toast from 'react-hot-toast';

// export default function SellerDashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: 0,
//     stock: 0,
//     image: '',
//     categoryId: 0,
//   });

//   useEffect(() => {
//     if (!session?.user || session.user.role !== 'SELLER') {
//       router.push('/');
//       return;
//     }
//     fetchData();
//   }, [session]);

//   const fetchData = async () => {
//     try {
//       const [medicinesRes, categoriesRes] = await Promise.all([
//         api.get('/medicine'),
//         api.get('/categories'),
//       ]);

//       const userMedicines = medicinesRes.data.filter(
//         (m: Medicine) => m.sellerId === session?.user.id,
//       );
//       setMedicines(userMedicines);
//       setCategories(categoriesRes.data.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post('/medicine', formData);
//       toast.success('Medicine added successfully!');
//       setShowForm(false);
//       setFormData({
//         name: '',
//         description: '',
//         price: 0,
//         stock: 0,
//         image: '',
//         categoryId: 0,
//       });
//       fetchData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to add medicine');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Seller Dashboard</h1>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>Add Medicine</span>
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-2xl font-bold mb-6">Add New Medicine</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Medicine Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.categoryId}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         categoryId: Number(e.target.value),
//                       })
//                     }
//                   >
//                     <option value={0}>Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         price: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock *
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.stock}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stock: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.image}
//                     onChange={(e) =>
//                       setFormData({ ...formData, image: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//                 >
//                   Add Medicine
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <h2 className="text-2xl font-bold p-6 border-b border-gray-200">
//             My Medicines
//           </h2>
//           {medicines.length === 0 ? (
//             <div className="text-center py-12">
//               <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No medicines added yet</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stock
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {medicines.map((medicine) => (
//                     <tr key={medicine.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {medicine.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           ${medicine.price.toFixed(2)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {medicine.stock}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {categories.find((c) => c.id === medicine.categoryId)
//                             ?.name || 'N/A'}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from '@/lib/auth-client';
// import { useRouter, useSearchParams } from 'next/navigation';
// import api from '@/lib/api';
// import type { Medicine, Category } from '@/types';
// import { Plus, Pill } from 'lucide-react';
// import toast from 'react-hot-toast';

// export default function SellerDashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: 0,
//     stock: 0,
//     image: '',
//     categoryId: 0,
//   });

//   useEffect(() => {
//     if (!session?.user || session.user.role !== 'SELLER') {
//       router.push('/');
//       return;
//     }
//     fetchData();

//     // Check if addNew query parameter is present
//     if (searchParams.get('addNew') === 'true') {
//       setShowForm(true);
//       // Remove query parameter from URL
//       router.replace('/seller/dashboard');
//     }
//   }, [session, searchParams]);
//   // }, [session, searchParams]);

//   const fetchData = async () => {
//     try {
//       const [medicinesRes, categoriesRes] = await Promise.all([
//         api.get('/medicine'),
//         api.get('/categories'),
//       ]);

//       const userMedicines = medicinesRes.data.filter(
//         (m: Medicine) => m.sellerId === session?.user.id,
//       );
//       setMedicines(userMedicines);
//       setCategories(categoriesRes.data.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post('/medicine', formData);
//       toast.success('Medicine added successfully!');
//       setShowForm(false);
//       setFormData({
//         name: '',
//         description: '',
//         price: 0,
//         stock: 0,
//         image: '',
//         categoryId: 0,
//       });
//       fetchData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to add medicine');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 text-black">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Seller Dashboard</h1>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>{showForm ? 'Cancel' : 'Add Medicine'}</span>
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-2xl font-bold mb-6">Add New Medicine</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Medicine Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.categoryId}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         categoryId: Number(e.target.value),
//                       })
//                     }
//                   >
//                     <option value={0}>Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         price: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock *
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.stock}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         stock: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.image}
//                     onChange={(e) =>
//                       setFormData({ ...formData, image: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//                 >
//                   Add Medicine
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <h2 className="text-2xl font-bold p-6 border-b border-gray-200">
//             My Medicines
//           </h2>
//           {medicines.length === 0 ? (
//             <div className="text-center py-12">
//               <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No medicines added yet</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Stock
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {medicines.map((medicine) => (
//                     <tr key={medicine.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {medicine.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           ${medicine.price.toFixed(2)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {medicine.stock}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {categories.find((c) => c.id === medicine.categoryId)
//                             ?.name || 'N/A'}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import type { Medicine, Category } from '@/types';
import { Plus, Pill, Pencil, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // ── add form state ──
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: 0,
  });

  // ── inline-edit state ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: 0,
  });

  // ── confirm-delete state ──
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user || session.user.role !== 'SELLER') {
      router.push('/');
      return;
    }
    fetchData();

    if (searchParams.get('addNew') === 'true') {
      setShowForm(true);
      router.replace('/seller/dashboard');
    }
  }, [session, searchParams]);

  const fetchData = async () => {
    try {
      const [medicinesRes, categoriesRes] = await Promise.all([
        api.get('/medicine'),
        api.get('/categories'),
      ]);

      const userMedicines = medicinesRes.data.filter(
        (m: Medicine) => m.sellerId === session?.user.id,
      );
      setMedicines(userMedicines);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── CREATE ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medicine', formData);
      toast.success('Medicine added successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        categoryId: 0,
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add medicine');
    }
  };

  // ── START EDIT (populate editData from the row) ──
  const startEdit = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setDeletingId(null); // close any open confirm
    setEditData({
      name: medicine.name,
      description: medicine.description || '',
      price: medicine.price,
      stock: medicine.stock,
      image: medicine.image || '',
      categoryId: medicine.categoryId,
    });
  };

  // ── SAVE EDIT ──
  const saveEdit = async (id: string) => {
    try {
      await api.put(`/medicine/${id}`, editData);
      toast.success('Medicine updated successfully!');
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update medicine');
    }
  };

  // ── DELETE ──
  const deleteMedicine = async (id: string) => {
    try {
      await api.delete(`/medicine/${id}`);
      toast.success('Medicine deleted successfully!');
      setDeletingId(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete medicine');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{showForm ? 'Cancel' : 'Add Medicine'}</span>
          </button>
        </div>

        {/* ── ADD FORM (unchanged) ── */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Add New Medicine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: Number(e.target.value),
                      })
                    }
                  >
                    <option value={0}>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Medicine
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-2xl font-bold p-6 border-b border-gray-200">
            My Medicines
          </h2>

          {medicines.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medicines added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((medicine) => {
                    const isEditing = editingId === medicine.id;
                    const isDeleting = deletingId === medicine.id;

                    // ── EDITING ROW ──
                    if (isEditing) {
                      return (
                        <tr key={medicine.id} className="bg-blue-50">
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.price}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  price: Number(e.target.value),
                                })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.stock}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  stock: Number(e.target.value),
                                })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.categoryId}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  categoryId: Number(e.target.value),
                                })
                              }
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => saveEdit(medicine.id)}
                                className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // ── NORMAL / DELETE-CONFIRM ROW ──
                    return (
                      <tr
                        key={medicine.id}
                        className={isDeleting ? 'bg-red-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {medicine.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${medicine.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {medicine.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {categories.find(
                              (c) => c.id === medicine.categoryId,
                            )?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isDeleting ? (
                            /* confirm strip */
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-red-600 font-medium">
                                Sure?
                              </span>
                              <button
                                onClick={() => deleteMedicine(medicine.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            /* default action buttons */
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEdit(medicine)}
                                className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(medicine.id)}
                                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import type { Medicine, Category } from '@/types';
import { Plus, Pill } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: 0,
  });

  useEffect(() => {
    if (!session?.user || session.user.role !== 'SELLER') {
      router.push('/');
      return;
    }
    fetchData();

    // Check if addNew query parameter is present
    if (searchParams.get('addNew') === 'true') {
      setShowForm(true);
      // Remove query parameter from URL
      router.replace('/seller/dashboard');
    }
  }, [session, searchParams]);
  // }, [session, searchParams]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((medicine) => (
                    <tr key={medicine.id}>
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
                          {categories.find((c) => c.id === medicine.categoryId)
                            ?.name || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

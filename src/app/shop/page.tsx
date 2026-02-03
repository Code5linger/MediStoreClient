// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import api from '@/lib/api';
// import type { Medicine, Category } from '@/types';
// import { Pill, Search } from 'lucide-react';
// import { useCartStore } from '@/store/cart';
// import toast from 'react-hot-toast';

// export default function ShopPage() {
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

//   const addToCart = useCartStore((state) => state.addToCart);

//   useEffect(() => {
//     fetchData();
//   }, [searchTerm]);

//   const fetchData = async () => {
//     try {
//       const [medicinesRes, categoriesRes] = await Promise.all([
//         api.get(`/medicine${searchTerm ? `?search=${searchTerm}` : ''}`),
//         api.get('/categories'),
//       ]);

//       setMedicines(medicinesRes.data || []);
//       setCategories(categoriesRes.data.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load medicines');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = (medicine: Medicine) => {
//     if (medicine.stock > 0) {
//       addToCart(medicine, 1);
//       toast.success(`${medicine.name} added to cart!`);
//     } else {
//       toast.error('Out of stock!');
//     }
//   };

//   const filteredMedicines = selectedCategory
//     ? medicines.filter((m) => m.categoryId === selectedCategory)
//     : medicines;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-bold mb-8 text-black">Shop Medicines</h1>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-black">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 text-black" />
//               <input
//                 type="text"
//                 placeholder="Search medicines..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div>
//               <select
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={selectedCategory || ''}
//                 onChange={(e) =>
//                   setSelectedCategory(
//                     e.target.value ? Number(e.target.value) : null,
//                   )
//                 }
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Medicines Grid */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <p className="mt-4 text-gray-600">Loading medicines...</p>
//           </div>
//         ) : filteredMedicines.length === 0 ? (
//           <div className="text-center py-12">
//             <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 text-lg">No medicines found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredMedicines.map((medicine) => (
//               <div
//                 key={medicine.id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
//               >
//                 <div className="h-48 bg-gray-200 flex items-center justify-center">
//                   {medicine.image ? (
//                     <img
//                       src={medicine.image}
//                       alt={medicine.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <Pill className="w-16 h-16 text-gray-400" />
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-semibold text-lg mb-2">
//                     {medicine.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {medicine.description || 'No description available'}
//                   </p>
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-xl font-bold text-blue-600">
//                       ${medicine.price.toFixed(2)}
//                     </span>
//                     <span
//                       className={`text-sm ${medicine.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
//                     >
//                       {medicine.stock > 0
//                         ? `${medicine.stock} in stock`
//                         : 'Out of stock'}
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Link
//                       href={`/shop/${medicine.id}`}
//                       className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
//                     >
//                       View
//                     </Link>
//                     <button
//                       onClick={() => handleAddToCart(medicine)}
//                       disabled={medicine.stock === 0}
//                       className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/shop/page.tsx

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Medicine } from '@/types';
import MedicineFilters, {
  type FilterState,
} from '@/components/MedicineFilters';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  // const addItem = useCartStore((state) => state.addItem);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchMedicines({});
  }, []);

  const fetchMedicines = async (filters: Partial<FilterState>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.categoryId)
        params.append('categoryId', filters.categoryId.toString());
      if (filters.minPrice)
        params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice)
        params.append('maxPrice', filters.maxPrice.toString());
      if (filters.sellerId) params.append('sellerId', filters.sellerId);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await api.get(`/medicine?${params.toString()}`);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  // const handleAddToCart = (medicine: Medicine) => {
  //   addItem(medicine);
  //   toast.success(`${medicine.name} added to cart!`);
  // };

  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine, 1); // Add quantity parameter
    toast.success(`${medicine.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shop Medicines</h1>

        <MedicineFilters onFilterChange={fetchMedicines} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No medicines found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={medicine.image || '/placeholder-medicine.jpg'}
                  alt={medicine.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {medicine.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {medicine.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${medicine.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/shop/${medicine.id}`}
                        className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(medicine)}
                        disabled={medicine.stock === 0}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Stock: {medicine.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

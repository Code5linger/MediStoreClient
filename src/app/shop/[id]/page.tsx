'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { Medicine } from '@/types';
import { Pill, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

export default function MedicineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchMedicine();
  }, [params.id]);

  const fetchMedicine = async () => {
    try {
      const res = await api.get(`/medicine`);
      const allMedicines = res.data;
      const found = allMedicines.find(
        (m: Medicine) => m.id === Number(params.id),
      );
      setMedicine(found || null);
    } catch (error) {
      console.error('Error fetching medicine:', error);
      toast.error('Failed to load medicine details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (medicine && medicine.stock >= quantity) {
      addToCart(medicine, quantity);
      toast.success(`${medicine.name} added to cart!`);
      router.push('/cart');
    } else {
      toast.error('Not enough stock!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Medicine not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-96">
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Pill className="w-32 h-32 text-gray-400" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{medicine.name}</h1>
              <p className="text-gray-600 mb-6">
                {medicine.description || 'No description available'}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${medicine.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <span
                  className={`text-lg ${medicine.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {medicine.stock > 0
                    ? `${medicine.stock} units available`
                    : 'Out of stock'}
                </span>
              </div>

              {medicine.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(medicine.stock, quantity + 1))
                        }
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

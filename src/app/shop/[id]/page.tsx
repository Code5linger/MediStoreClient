'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { Medicine } from '@/types';

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
}

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  const fetchMedicineDetails = useCallback(async () => {
    try {
      const response = await api.get(`/medicine/${params.id}`);
      setMedicine(response.data);
    } catch (error) {
      console.error('Error fetching medicine:', error);
      toast.error('Failed to load medicine details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/reviews?medicineId=${params.id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchMedicineDetails();
      fetchReviews();
    }
  }, [params.id, fetchMedicineDetails, fetchReviews]);

  const handleAddToCart = () => {
    if (medicine && medicine.stock > 0) {
      addToCart(medicine, 1);
      toast.success(`${medicine.name} added to cart!`);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Medicine not found</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="relative w-full h-96">
              <Image
                src={medicine.image || '/placeholder-medicine.jpg'}
                alt={medicine.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {medicine.category?.name || 'General'}
              </span>
              <h1 className="text-4xl font-bold mb-4">{medicine.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                {renderStars(averageRating, 'lg')}
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <p className="text-gray-600 mb-6">{medicine.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${medicine.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    medicine.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {medicine.stock > 0
                    ? `${medicine.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={medicine.stock === 0}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

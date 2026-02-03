'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, Edit, Trash2, Package } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  medicine: {
    id: number;
    name: string;
    image: string | null;
  };
}

export default function ReviewsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchReviews();
  }, [session, router]);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/me');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleUpdate = async (reviewId: number) => {
    try {
      await api.patch(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success('Review updated successfully!');
      setEditingReview(null);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update review');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted successfully!');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete review');
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition' : ''}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (!session?.user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">My Reviews</h1>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              You haven't written any reviews yet
            </p>
            <button
              onClick={() => router.push('/orders')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Orders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.medicine.image || '/placeholder-medicine.jpg'}
                    alt={review.medicine.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {review.medicine.name}
                    </h3>

                    {editingReview === review.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Rating
                          </label>
                          {renderStars(editRating, true, setEditRating)}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Comment
                          </label>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Write your review..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(review.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingReview(null)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {renderStars(review.rating)}
                        {review.comment && (
                          <p className="text-gray-600 mt-2">{review.comment}</p>
                        )}
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEdit(review)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

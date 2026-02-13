// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from '@/lib/auth-client';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import type { Order } from '@/types';
// import { Package } from 'lucide-react';
// import Link from 'next/link';

// export default function OrdersPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!session?.user) {
//       router.push('/login');
//       return;
//     }
//     fetchOrders();
//   }, [session]);

//   console.log(session?.user.id);

//   const fetchOrders = async () => {
//     try {
//       const res = await api.get('/orders');
//       setOrders(res.data || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PLACED: 'bg-blue-100 text-blue-800',
//       PROCESSING: 'bg-yellow-100 text-yellow-800',
//       SHIPPED: 'bg-purple-100 text-purple-800',
//       DELIVERED: 'bg-green-100 text-green-800',
//       CANCELLED: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
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
//         <h1 className="text-4xl font-bold mb-8">My Orders</h1>

//         {orders.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-md">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               No orders yet
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Start shopping to see your orders here!
//             </p>
//             <Link
//               href="/shop"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
//             >
//               Browse Medicines
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold">Order #{order.id}</h3>
//                     <p className="text-gray-600 text-sm">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="space-y-2 mb-4">
//                     {order.items.map((item) => (
//                       <div
//                         key={item.id}
//                         className="flex justify-between text-sm"
//                       >
//                         <span className="text-gray-600">
//                           {item.medicine?.name ||
//                             `Medicine #${item.medicineId}`}{' '}
//                           x {item.quantity}
//                         </span>
//                         <span className="font-semibold">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Amount</p>
//                       <p className="text-xl font-bold text-blue-600">
//                         ${order.totalAmount.toFixed(2)}
//                       </p>
//                     </div>
//                     <Link
//                       href={`/orders/${order.id}`}
//                       className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//                     >
//                       View Details
//                     </Link>
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

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Package, Star } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  medicine: {
    id: number;
    name: string;
    image: string | null;
  };
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    orderId: number;
    medicineId: number;
    medicineName: string;
    medicineImage?: string;
  }>({
    isOpen: false,
    orderId: 0,
    medicineId: 0,
    medicineName: '',
    medicineImage: '',
  });

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [session, router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/me');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (
    orderId: number,
    medicineId: number,
    medicineName: string,
    medicineImage?: string,
  ) => {
    setReviewModal({
      isOpen: true,
      orderId,
      medicineId,
      medicineName,
      medicineImage,
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      orderId: 0,
      medicineId: 0,
      medicineName: '',
      medicineImage: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <button
            onClick={() => router.push('/reviews')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Star className="w-4 h-4" />
            My Reviews
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              You have not placed any orders yet
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Shipping Address:</strong>
                  </p>
                  <p className="text-gray-700">{order.shippingAddress}</p>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={
                            item.medicine.image || '/placeholder-medicine.jpg'
                          }
                          alt={item.medicine.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.medicine.name}</h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() =>
                            openReviewModal(
                              order.id,
                              item.medicine.id,
                              item.medicine.name,
                              item.medicine.image || undefined,
                            )
                          }
                          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap"
                        >
                          <Star className="w-4 h-4" />
                          Write Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        orderId={reviewModal.orderId}
        medicineId={reviewModal.medicineId}
        medicineName={reviewModal.medicineName}
        medicineImage={reviewModal.medicineImage}
        onSuccess={fetchOrders}
      />
    </div>
  );
}

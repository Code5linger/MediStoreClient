'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // app router
import api from '@/lib/api';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error('Error fetching order:', err));
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p>Total: ${order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <p>Shipping: {order.shippingAddress}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.medicine?.name || item.medicineId} x {item.quantity} — $
            {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import type { Medicine, Category, Order } from '@/types';
import {
  Plus,
  Pill,
  Pencil,
  Trash2,
  Check,
  X,
  Package,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── tab type ──
type Tab = 'medicines' | 'orders';

// ── status badge color map ──
const STATUS_COLOURS: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

// ── what each status can transition to ──
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function SellerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── tab state ──
  const [activeTab, setActiveTab] = useState<Tab>('medicines');

  // ── medicines state ──
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── orders state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    // Debug: Check cookies
    console.log('=== COOKIE DEBUG ===');
    console.log('All cookies:', document.cookie);
    console.log('Has medistore cookie:', document.cookie.includes('medistore'));

    // Debug: Make a test request
    const testAuth = async () => {
      try {
        console.log('Testing auth...');
        const response = await api.get('/medicine'); // Public endpoint
        console.log('✅ Public endpoint works');

        const sellerResponse = await api.get('/orders/seller/orders');
        console.log('✅ Seller endpoint works!', sellerResponse.data);
      } catch (error: any) {
        console.error(
          '❌ Error:',
          error.response?.status,
          error.response?.data,
        );
      }
    };

    testAuth();
  }, []);

  // ── guard ──
  useEffect(() => {
    if (!session?.user || session.user.role !== 'SELLER') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      await Promise.all([fetchMedicines(), fetchOrders()]);
    };

    fetchData();

    if (searchParams.get('addNew') === 'true') {
      setShowForm(true);
      router.replace('/seller/dashboard');
    }
  }, [session, searchParams, router]);

  // ── fetch when tab or filter changes ──
  useEffect(() => {
    if (activeTab !== 'orders') return;

    fetchOrders();
  }, [activeTab, orderStatusFilter]);

  // ─────────────────────── MEDICINES CRUD ────────────────────────
  const fetchMedicines = async () => {
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
      console.error('Error fetching medicines:', error);
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
      fetchMedicines();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const startEdit = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setDeletingId(null);
    setEditData({
      name: medicine.name,
      description: medicine.description || '',
      price: medicine.price,
      stock: medicine.stock,
      image: medicine.image || '',
      categoryId: medicine.categoryId,
    });
  };

  const saveEdit = async (id: number) => {
    try {
      await api.put(`/medicine/${id}`, editData);
      toast.success('Medicine updated successfully!');
      setEditingId(null);
      fetchMedicines();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const deleteMedicine = async (id: number) => {
    try {
      await api.delete(`/medicine/${id}`);
      toast.success('Medicine deleted successfully!');
      setDeletingId(null);
      fetchMedicines();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  // ─────────────────────── ORDERS ─────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const params =
        orderStatusFilter !== 'ALL' ? `?status=${orderStatusFilter}` : '';
      const res = await api.get(`/orders/seller/orders${params}`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/orders/seller/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Order #${orderId} updated to ${newStatus}`);
      fetchOrders(); // refresh list
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ─────────────────────── RENDER ─────────────────────────────────
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
        {/* ── header ── */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          {activeTab === 'medicines' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{showForm ? 'Cancel' : 'Add Medicine'}</span>
            </button>
          )}
        </div>

        {/* ── tabs ── */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition ${
              activeTab === 'medicines'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Medicines</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition ${
              activeTab === 'orders'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </button>
        </div>

        {/* ════════════════ MEDICINES TAB ════════════════ */}
        {activeTab === 'medicines' && (
          <>
            {/* add form — unchanged */}
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
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
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

            {/* medicines table */}
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

                        return (
                          <tr
                            key={medicine.id}
                            className={isDeleting ? 'bg-red-50' : ''}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {medicine.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${medicine.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {medicine.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {categories.find(
                                (c) => c.id === medicine.categoryId,
                              )?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isDeleting ? (
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
          </>
        )}

        {/* ════════════════ ORDERS TAB ════════════════ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* header row with filter */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-bold">Incoming Orders</h2>
              <div className="relative">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PLACED">Placed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Update Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const transitions =
                        ALLOWED_TRANSITIONS[order.status] || [];
                      const isUpdating = updatingOrderId === order.id;

                      return (
                        <tr key={order.id}>
                          {/* order id */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            #{order.id}
                          </td>

                          {/* customer */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer?.email}
                            </div>
                          </td>

                          {/* items — only the seller's items are returned */}
                          <td className="px-6 py-4">
                            <div className="space-y-1 max-w-xs">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="text-sm text-gray-700"
                                >
                                  {item.medicine?.name}{' '}
                                  <span className="text-gray-400">
                                    ×{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* total */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </td>

                          {/* status badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOURS[order.status] || 'bg-gray-100 text-gray-700'}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          {/* date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          {/* status dropdown */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transitions.length === 0 ? (
                              <span className="text-xs text-gray-400 italic">
                                No actions
                              </span>
                            ) : (
                              <div className="relative">
                                <select
                                  disabled={isUpdating}
                                  value="" // always reset so placeholder shows
                                  onChange={(e) => {
                                    if (e.target.value)
                                      updateOrderStatus(
                                        order.id,
                                        e.target.value,
                                      );
                                  }}
                                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="">Move to…</option>
                                  {transitions.map((s) => (
                                    <option key={s} value={s}>
                                      {s.charAt(0) + s.slice(1).toLowerCase()}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
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
        )}
      </div>
    </div>
  );
}

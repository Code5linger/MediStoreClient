'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Users,
  Package,
  ShoppingCart,
  Tag,
  Ban,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Types ──
type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  status: 'ACTIVE' | 'BANNED';
};

type Medicine = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  sellerId: string;
  category: { id: number; name: string };
  seller: { id: string; name: string; email: string };
};

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: { id: string; name: string; email: string };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    medicine: { id: number; name: string };
  }>;
};

type Category = {
  id: number;
  name: string;
};

type Tab = 'users' | 'medicines' | 'orders' | 'categories';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [loading, setLoading] = useState(true);

  // ── Users state ──
  const [users, setUsers] = useState<User[]>([]);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // ── Medicines state ──
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // ── Orders state ──
  const [orders, setOrders] = useState<Order[]>([]);

  // ── Categories state ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '' });
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null,
  );

  // ── Guard ──
  useEffect(() => {
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchData();
  }, [session]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          await fetchUsers();
          break;
        case 'medicines':
          await fetchMedicines();
          break;
        case 'orders':
          await fetchOrders();
          break;
        case 'categories':
          await fetchCategories();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────── USERS ────────────────────────
  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };

  const toggleUserStatus = async (userId: string) => {
    setTogglingUserId(userId);
    try {
      await api.patch(`/admin/users/${userId}/toggle`);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed...');
    } finally {
      setTogglingUserId(null);
    }
  };

  // ─────────────────────── MEDICINES ────────────────────────
  const fetchMedicines = async () => {
    const res = await api.get('/medicine');
    setMedicines(res.data);
  };

  // ─────────────────────── ORDERS ────────────────────────
  const fetchOrders = async () => {
    const res = await api.get('/admin/orders');
    setOrders(res.data);
  };

  // ─────────────────────── CATEGORIES ────────────────────────
  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data || []);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update
        await api.post('/admin/categories/manage', {
          action: 'update',
          categoryId: editingCategory.id,
          name: categoryFormData.name,
        });
        toast.success('Category updated successfully');
      } else {
        // Create
        await api.post('/admin/categories/manage', {
          action: 'create',
          name: categoryFormData.name,
        });
        toast.success('Category created successfully');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryFormData({ name: '' });
      fetchCategories();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed...');
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      await api.post('/admin/categories/manage', {
        action: 'delete',
        categoryId,
      });
      toast.success('Category deleted successfully');
      setDeletingCategoryId(null);
      fetchCategories();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed...');
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name });
    setShowCategoryForm(true);
  };

  const cancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormData({ name: '' });
  };

  // ─────────────────────── RENDER ────────────────────────
  if (loading && activeTab === 'users' && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  // Updated
  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-black">
          <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, medicines, orders, and categories
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 text-black rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition ${
              activeTab === 'users'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition ${
              activeTab === 'medicines'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
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
            <ShoppingCart className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-md font-medium transition ${
              activeTab === 'categories'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </div>

        {/* ════════════════ USERS TAB ════════════════ */}
        {activeTab === 'users' && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">All Users</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
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
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : user.role === 'SELLER'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Ban className="w-3 h-3" />
                            )}
                            <span>{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              disabled={togglingUserId === user.id}
                              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition disabled:opacity-50 ${
                                user.status === 'ACTIVE'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {togglingUserId === user.id
                                ? 'Processing...'
                                : user.status === 'ACTIVE'
                                  ? 'Ban User'
                                  : 'Unban User'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ MEDICINES TAB ════════════════ */}
        {activeTab === 'medicines' && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">All Medicines</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : medicines.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medicines found</p>
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
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
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
                          <div className="text-sm text-gray-600">
                            {medicine.category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {medicine.seller.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {medicine.seller.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${medicine.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              medicine.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : medicine.stock > 0
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {medicine.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ ORDERS TAB ════════════════ */}
        {activeTab === 'orders' && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">All Orders</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            #{order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.length} item(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              order.status === 'DELIVERED'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-700'
                                  : order.status === 'PROCESSING'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : order.status === 'CANCELLED'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ CATEGORIES TAB ════════════════ */}
        {activeTab === 'categories' && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories</h2>
              {!showCategoryForm && (
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              )}
            </div>

            {showCategoryForm && (
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-semibold mb-4">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData({ name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelCategoryForm}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No categories found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => {
                      const isDeleting = deletingCategoryId === category.id;

                      return (
                        <tr
                          key={category.id}
                          className={isDeleting ? 'bg-red-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {category.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isDeleting ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-red-600 font-medium">
                                  Sure?
                                </span>
                                <button
                                  onClick={() => deleteCategory(category.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeletingCategoryId(null)}
                                  className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => startEditCategory(category)}
                                  className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeletingCategoryId(category.id)
                                  }
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
        )}
      </div>
    </div>
  );
}

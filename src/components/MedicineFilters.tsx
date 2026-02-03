// components/MedicineFilters.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Category } from '@/types';

interface Seller {
  id: string;
  name: string;
}

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  categoryId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  sellerId: string | null;
  sortBy: string;
}

export default function MedicineFilters({ onFilterChange }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    sellerId: null,
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, sellersRes] = await Promise.all([
        api.get('/categories'),
        api.get('/medicine/sellers'),
      ]);

      setCategories(categoriesRes.data.data || []);
      setSellers(sellersRes.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      sellerId: null,
      sortBy: 'newest',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.categoryId || ''}
            onChange={(e) =>
              handleFilterChange(
                'categoryId',
                e.target.value ? Number(e.target.value) : null,
              )
            }
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacturer/Seller */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manufacturer
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sellerId || ''}
            onChange={(e) =>
              handleFilterChange('sellerId', e.target.value || null)
            }
          >
            <option value="">All Manufacturers</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.minPrice || ''}
            onChange={(e) =>
              handleFilterChange(
                'minPrice',
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="1000.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              handleFilterChange(
                'maxPrice',
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

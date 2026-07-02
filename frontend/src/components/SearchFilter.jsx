import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Documents', 'Keys', 'Clothing',
  'Wallets/Bags', 'Jewelry', 'Others',
];

const SearchFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  onReset,
  categories = CATEGORIES,
}) => {
  const hasFilters = search || category || status;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6 mb-8 w-full">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter Listings</span>
        {hasFilters && (
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
            Filters Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">

        {/* Search */}
        <div className="sm:col-span-2 relative">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Search</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Title, description, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-400 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-400 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600 font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status + Reset */}
        <div className="flex gap-2 items-end">
          <div className="flex-grow">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-400 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600 font-medium cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
              <option value="Claimed">Claimed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onReset}
            title="Reset all filters"
            className={`p-2.5 border rounded-xl flex items-center justify-center transition-all h-[42px] shrink-0 ${
              hasFilters
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

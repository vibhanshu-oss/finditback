import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import SearchFilter from '../components/SearchFilter';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { HelpCircle } from 'lucide-react';

const Items = ({ forcedType = '' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      let queryParams = [];

      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
      if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
      if (forcedType) queryParams.push(`type=${encodeURIComponent(forcedType)}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/items${queryString}`);

      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add brief debounce for search queries to prevent hammering the server on keystrokes
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, status, forcedType]);

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setStatus('');
  };

  const getPageHeader = () => {
    if (forcedType === 'Lost') {
      return {
        title: 'Lost Items Board',
        subtitle: 'Browse and locate items reported lost by the community.',
      };
    } else if (forcedType === 'Found') {
      return {
        title: 'Found Items Directory',
        subtitle: 'Check through items discovered and logged by good samaritans.',
      };
    }
    return {
      title: 'Lost & Found Noticeboard',
      subtitle: 'Sift through all listings reported on our community bulletin.',
    };
  };

  const header = getPageHeader();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{header.title}</h1>
          <p className="text-sm text-slate-500 font-medium">{header.subtitle}</p>
        </div>

        {/* Filters */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          onReset={handleReset}
        />

        {/* Listings Grid */}
        {loading ? (
          <Loader />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No listings match your search"
            description="We couldn't find any items matching your active filters. Try resetting filters or report a new one."
            onReset={handleReset}
            icon={HelpCircle}
          />
        )}
      </div>
    </div>
  );
};

export default Items;

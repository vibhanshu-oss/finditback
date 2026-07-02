import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Edit2, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

const EditItem = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    location: '',
    date: '',
    imageUrl: '',
    contactPreference: 'Email',
    status: 'Lost',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Electronics', 'Documents', 'Keys', 'Clothing', 'Wallets/Bags', 'Jewelry', 'Others'];
  const contactPreferences = ['Email', 'Phone', 'Either'];
  const statuses = ['Lost', 'Found', 'Claimed', 'Resolved'];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/items/${id}`);
        if (res.data && res.data.success) {
          const item = res.data.data;

          // Owner-only validation check on front-end (use toString() for ObjectId comparison)
          if (item.postedBy._id.toString() !== user?._id?.toString()) {
            navigate('/items', { replace: true });
            return;
          }

          // Format date string to YYYY-MM-DD
          const formattedDate = item.date ? item.date.split('T')[0] : '';

          setFormData({
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'Electronics',
            location: item.location || '',
            date: formattedDate,
            imageUrl: item.imageUrl || '',
            contactPreference: item.contactPreference || 'Email',
            status: item.status || 'Lost',
          });
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Listing not found or connection failure.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchItem();
    }
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, location, date, contactPreference, status } = formData;

    if (!title || !description || !category || !location || !date || !contactPreference || !status) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await api.put(`/items/${id}`, formData);
      if (res.data && res.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage={true} />;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Edit2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Listing</h1>
              <p className="text-sm text-slate-500 font-medium">Update the details of your loss or discovery posting</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Status selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Listing Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold text-slate-700"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold text-slate-700"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Title / Name *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Leather Wallet"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description *</label>
              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide distinctive features..."
                className="w-full p-4 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Central Park"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Lost or Found *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="e.g. https://images.unsplash.com..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
                />
              </div>

              {/* Contact Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Preference *</label>
                <select
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold text-slate-700"
                >
                  {contactPreferences.map((pref) => (
                    <option key={pref} value={pref}>
                      Contact via {pref}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200"
            >
              {submitting ? 'Updating Listing...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditItem;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AddItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    status: 'Lost',
    location: '',
    date: '',
    imageUrl: '',
    contactPreference: 'Email',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Electronics', 'Documents', 'Keys', 'Clothing', 'Wallets/Bags', 'Jewelry', 'Others'];
  const contactPreferences = ['Email', 'Phone', 'Either'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, status, location, date, contactPreference } = formData;

    if (!title || !description || !category || !status || !location || !date || !contactPreference) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await api.post('/items', formData);
      if (res.data && res.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit item report');
    } finally {
      setSubmitting(false);
    }
  };

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
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Report an Item</h1>
              <p className="text-sm text-slate-500 font-medium">Log details of a lost or discovered item to notify the network</p>
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
              {/* Type selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Report Type *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold text-slate-700"
                >
                  <option value="Lost">Lost Item (I lost something)</option>
                  <option value="Found">Found Item (I found something)</option>
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
                placeholder="e.g. Leather Wallet, iPhone 13 Pro"
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
                placeholder="Provide distinctive features, brands, colors, contents of bags, or abstract markings that can help identify it..."
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
                  placeholder="e.g. Central Park Cafe, Library 3rd Floor"
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
                  placeholder="e.g. https://images.unsplash.com/photo..."
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
              {submitting ? 'Submitting Report...' : 'Publish Listing'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItem;

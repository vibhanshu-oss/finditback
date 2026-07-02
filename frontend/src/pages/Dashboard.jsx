import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  FileText,
  Send,
  Inbox,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Plus,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'claims-made', 'claims-received'
  const [listings, setListings] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user's listings
      const listingsRes = await api.get('/items/my-listings');
      if (listingsRes.data && listingsRes.data.success) {
        setListings(listingsRes.data.data);
      }

      // Fetch claims filed by user
      const myClaimsRes = await api.get('/claims/my-claims');
      if (myClaimsRes.data && myClaimsRes.data.success) {
        setMyClaims(myClaimsRes.data.data);
      }

      // Fetch received claims
      const receivedRes = await api.get('/claims/received');
      if (receivedRes.data && receivedRes.data.success) {
        setReceivedClaims(receivedRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Connection failure or error parsing database payloads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleDeleteListing = async (itemId) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      const res = await api.delete(`/items/${itemId}`);
      if (res.data && res.data.success) {
        setListings(listings.filter((item) => item._id !== itemId));
        // Refresh claims in case some were deleted
        const receivedRes = await api.get('/claims/received');
        if (receivedRes.data && receivedRes.data.success) {
          setReceivedClaims(receivedRes.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const handleResolveClaim = async (claimId, newStatus) => {
    try {
      setResolvingId(claimId);
      const res = await api.put(`/claims/${claimId}`, { status: newStatus });
      if (res.data && res.data.success) {
        // Refresh data
        await fetchDashboardData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update claim status');
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <Loader fullPage={true} />;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hello, {user?.name}</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your listings, review claims, and trace recoveries.</p>
          </div>
          <Link
            to="/add-item"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Report an Item
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">My Listings</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{myClaims.length}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Claims Filed</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{receivedClaims.length}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Claims Received</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-2 flex gap-1 mb-8 w-full max-w-lg mx-auto sm:mx-0">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'listings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('claims-made')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'claims-made'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Claims Filed ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('claims-received')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'claims-received'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Received Claims ({receivedClaims.length})
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {/* Tab 1: Listings */}
          {activeTab === 'listings' && (
            listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl || `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=60&w=400`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm ${item.type === 'Lost' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                          {item.type}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-400 font-semibold mb-4">{formatDate(item.createdAt)}</p>

                      <div className="grid grid-cols-3 gap-2 mt-auto border-t border-slate-50 pt-4">
                        <Link
                          to={`/items/${item._id}`}
                          className="py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-slate-600"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                        <Link
                          to={`/edit-item/${item._id}`}
                          className="py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-slate-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(item._id)}
                          className="py-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-slate-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="You haven't listed any items"
                description="Report any lost or found items to begin tracking matches in your dashboard."
              />
            )
          )}

          {/* Tab 2: Claims Filed */}
          {activeTab === 'claims-made' && (
            myClaims.length > 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
                {myClaims.map((claim) => (
                  <div key={claim._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900">
                        Claim on: <Link to={`/items/${claim.item._id}`} className="text-indigo-600 hover:text-indigo-700">{claim.item.title}</Link>
                      </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <span>Submitted on: {formatDate(claim.createdAt)}</span>
                          <span>&bull;</span>
                          <span>Item type: <strong className="text-indigo-600">{claim.item.type}</strong></span>
                        </p>
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-2xl mt-2">
                        "{claim.message}"
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          claim.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : claim.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No claims filed yet"
                description="When you submit ownership proof claims for other users' items, they will appear here."
                showAction={false}
              />
            )
          )}

          {/* Tab 3: Claims Received */}
          {activeTab === 'claims-received' && (
            receivedClaims.length > 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
                {receivedClaims.map((claim) => (
                  <div key={claim._id} className="p-6 hover:bg-slate-50/40 transition-colors space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Claim by <span className="text-indigo-600">{claim.requester.name}</span> on{' '}
                          <Link to={`/items/${claim.item._id}`} className="text-indigo-600 hover:text-indigo-700 font-extrabold">{claim.item.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          Received on: {formatDate(claim.createdAt)} | Contact: {claim.requester.email} {claim.requester.phone && `(${claim.requester.phone})`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            claim.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : claim.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl max-w-4xl text-sm text-slate-600 italic">
                      "{claim.message}"
                    </div>

                    {claim.status === 'Pending' && (
                      <div className="flex gap-2 w-full max-w-xs">
                        <button
                          onClick={() => handleResolveClaim(claim._id, 'Accepted')}
                          disabled={resolvingId !== null}
                          className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Claim
                        </button>
                        <button
                          onClick={() => handleResolveClaim(claim._id, 'Rejected')}
                          disabled={resolvingId !== null}
                          className="px-4 py-2 bg-slate-150 hover:bg-red-50 hover:text-red-600 disabled:bg-slate-100 text-slate-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200/50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No claims received"
                description="When other users claim ownership of items you posted, you will find their files here."
                showAction={false}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

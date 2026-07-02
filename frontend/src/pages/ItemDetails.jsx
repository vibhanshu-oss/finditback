import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { MapPin, Calendar, Mail, Phone, ShieldQuestion, Send, User, ChevronRight, Check, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim Form States (for non-owner)
  const [claimMessage, setClaimMessage] = useState('');
  const [claimStatus, setClaimStatus] = useState(null); // 'Pending', 'Accepted', 'Rejected' or null
  const [myClaim, setMyClaim] = useState(null);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');

  // Received Claims States (for owner)
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [resolvingClaimId, setResolvingClaimId] = useState(null);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/items/${id}`);
      if (res.data && res.data.success) {
        setItem(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Item listing not found or database error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimsStatus = async () => {
    if (!user || !item) return;

    const isOwner = item.postedBy._id.toString() === user._id.toString();

    if (isOwner) {
      // Fetch claims on this item
      try {
        const res = await api.get('/claims/received');
        if (res.data && res.data.success) {
          const filtered = res.data.data.filter((claim) => claim.item._id === id);
          setReceivedClaims(filtered);
        }
      } catch (err) {
        console.error('Error fetching received claims:', err);
      }
    } else {
      // Check if logged-in user has claimed this item
      try {
        const res = await api.get('/claims/my-claims');
        if (res.data && res.data.success) {
          const claim = res.data.data.find((c) => c.item._id === id);
          if (claim) {
            setMyClaim(claim);
            setClaimStatus(claim.status);
          }
        }
      } catch (err) {
        console.error('Error checking claim status:', err);
      }
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    if (item) {
      fetchClaimsStatus();
    }
  }, [item, user]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) return;

    try {
      setSubmittingClaim(true);
      const res = await api.post('/claims', {
        itemId: id,
        message: claimMessage,
      });

      if (res.data && res.data.success) {
        setClaimSuccess('Claim request submitted successfully!');
        setClaimMessage('');
        // Reload claims
        fetchItemDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim request');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleResolveClaim = async (claimId, newStatus) => {
    try {
      setResolvingClaimId(claimId);
      const res = await api.put(`/claims/${claimId}`, { status: newStatus });
      if (res.data && res.data.success) {
        // Reload details & claims
        fetchItemDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve claim request');
    } finally {
      setResolvingClaimId(null);
    }
  };

  if (loading) return <Loader fullPage={true} />;

  if (error && !item) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Details</h3>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <Link to="/items" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl inline-block">
          Return to Board
        </Link>
      </div>
    );
  }

  const isOwner = user && item.postedBy._id.toString() === user._id.toString();
  const defaultImage = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3`;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-8">
          <Link to="/items" className="hover:text-indigo-600 transition-colors">Listings</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 truncate">{item.title}</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Listing Details Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative aspect-video bg-slate-100 max-h-[400px]">
                <img
                  src={item.imageUrl || defaultImage}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex gap-2">
                    <span
                      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                        item.type === 'Lost'
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-emerald-500 border-emerald-500 text-white'
                      }`}
                    >
                      {item.type}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{item.title}</h1>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h4>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</h4>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Contacts & Claims */}
          <div className="space-y-6">
            {/* Publisher Information */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Reported By</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {item.postedBy.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{item.postedBy.name}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Author</p>
                </div>
              </div>

              {/* Show contact details only if logged in */}
              {user ? (
                <div className="space-y-2 border-t border-slate-100 pt-4 text-sm font-medium">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{item.postedBy.email}</span>
                  </div>
                  {item.postedBy.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{item.postedBy.phone}</span>
                    </div>
                  )}
                  <div className="text-xs font-semibold text-slate-400 pt-2">
                    Contact Preference: <span className="text-slate-600">{item.contactPreference}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center mt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Please{' '}
                    <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
                      Sign In
                    </Link>{' '}
                    to view contact details.
                  </p>
                </div>
              )}
            </div>

            {/* Claims Request Action Box */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ownership Status</h3>

              {item.status === 'Resolved' ? (
                <div className="bg-slate-50 text-slate-600 border border-slate-100 rounded-xl p-4 text-center">
                  <Check className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Resolved</p>
                  <p className="text-xs mt-1 text-slate-400">This item has been successfully reclaimed.</p>
                </div>
              ) : !user ? (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                  <ShieldQuestion className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Log in to file a claim request or help identify ownership.
                  </p>
                  <Link
                    to="/login"
                    className="mt-4 w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg inline-block"
                  >
                    Login to Claim
                  </Link>
                </div>
              ) : isOwner ? (
                /* Item Owner View: Manage Claim Requests Received */
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    You listed this item. Manage claimant verification files below:
                  </p>
                  {receivedClaims.length > 0 ? (
                    <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
                      {receivedClaims.map((claim) => (
                        <div
                          key={claim._id}
                          className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2 relative"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-700">{claim.requester.name}</p>
                              <p className="text-[10px] text-slate-400">{claim.requester.email}</p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                claim.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                                  : claim.status === 'Accepted'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : 'bg-red-50 text-red-600 border-red-200'
                              }`}
                            >
                              {claim.status}
                            </span>
                          </div>

                          <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-50 line-clamp-3">
                            "{claim.message}"
                          </p>

                          {claim.status === 'Pending' && (
                            <div className="flex gap-2 pt-1.5">
                              <button
                                onClick={() => handleResolveClaim(claim._id, 'Accepted')}
                                disabled={resolvingClaimId !== null}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                onClick={() => handleResolveClaim(claim._id, 'Rejected')}
                                disabled={resolvingClaimId !== null}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-red-50 hover:text-red-600 disabled:bg-slate-100 text-slate-600 rounded-lg font-bold flex items-center justify-center active:scale-95 transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-400 text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      No claims received yet
                    </p>
                  )}
                </div>
              ) : claimStatus ? (
                /* Regular User: Already filed a claim */
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 justify-center text-slate-700">
                    <ShieldQuestion className="w-5 h-5 text-indigo-500" />
                    <p className="text-xs font-bold uppercase tracking-wider">Claim Submitted</p>
                  </div>
                  <div
                    className={`p-2.5 rounded-lg border text-center font-bold text-xs ${
                      claimStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : claimStatus === 'Accepted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                  >
                    Status: {claimStatus}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                    {claimStatus === 'Pending'
                      ? 'The listing publisher has been notified of your claim. Check your dashboard for status updates.'
                      : claimStatus === 'Accepted'
                      ? 'Congratulations! Your ownership claim has been accepted. Coordinate safely via the listed contact details.'
                      : 'Unfortunately, the owner has rejected this claim request.'}
                  </p>
                </div>
              ) : (
                /* Regular User: Form to file a Claim Request */
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Do you believe this item belongs to you? Submit a claim with proof of ownership.
                  </p>

                  {claimSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl">
                      <Check className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">{claimSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleClaimSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Ownership Proof *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={claimMessage}
                        onChange={(e) => setClaimMessage(e.target.value)}
                        placeholder="Provide descriptions, serial numbers, distinguishing marks, or details of where/when you lost it..."
                        className="w-full p-3 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingClaim || !claimMessage.trim()}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all duration-200"
                    >
                      <Send className="w-3 h-3" />
                      {submittingClaim ? 'Filing Claim...' : 'Submit Claim Request'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

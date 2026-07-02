import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Security Enforcement: Redirect to forgot-password if verification is not complete
    const isVerified = location.state?.verified;
    const stateEmail = location.state?.email || '';
    
    if (!isVerified) {
      navigate('/forgot-password', { replace: true });
      return;
    }
    
    setEmail(stateEmail);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await api.put('/auth/reset-password', { email, password });

      if (res.data && res.data.success) {
        setSuccess('Password updated successfully! Redirecting to login...');
        
        // Remove transient storage
        localStorage.removeItem('resetEmail');

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-sm p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Create a new strong password for your FindItBack account
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl mb-6 animate-pulse">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm shadow-indigo-100 transition-all duration-200 mt-2"
          >
            {loading ? 'Saving New Password...' : 'Save Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

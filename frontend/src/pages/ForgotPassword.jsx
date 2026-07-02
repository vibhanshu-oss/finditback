import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setDevOtp('');

      const res = await api.post('/auth/forgot-password', { email });

      if (res.data && res.data.success) {
        setSuccess(res.data.message);
        
        // Save email to localStorage for persistence
        localStorage.setItem('resetEmail', email);

        if (res.data.otp) {
          setDevOtp(res.data.otp);
        }

        // Redirect to verification screen after 3 seconds
        setTimeout(() => {
          navigate('/verify-otp', { 
            state: { 
              email, 
              otp: res.data.otp || '' 
            } 
          });
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check connection.');
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
        {/* Back navigation */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Enter your email and we'll send you a 6-digit OTP code to verify ownership
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

        {devOtp && (
          <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-xl mb-6 space-y-1">
            <p className="font-bold uppercase tracking-wider">🔧 Developer Mode Testing Alert</p>
            <p>Generated Password Reset OTP: <strong className="text-sm bg-white px-2 py-0.5 border rounded-md font-mono text-indigo-600">{devOtp}</strong></p>
            <p className="text-[10px] text-amber-600">Redirecting to verification page...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm shadow-indigo-100 transition-all duration-200"
          >
            {loading ? 'Sending OTP Code...' : 'Request OTP Code'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

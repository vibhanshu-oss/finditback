import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hintOtp, setHintOtp] = useState('');

  useEffect(() => {
    // Attempt to retrieve email from route state, fallback to localStorage
    const stateEmail = location.state?.email || '';
    const storedEmail = localStorage.getItem('resetEmail') || '';
    setEmail(stateEmail || storedEmail);

    // If dev mode OTP was passed in route state, display it as a developer tip
    if (location.state?.otp) {
      setHintOtp(location.state.otp);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Please fill in both email and OTP code');
      return;
    }

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError('OTP must be a 6-digit numeric code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await api.post('/auth/verify-reset-otp', { email, otp });

      if (res.data && res.data.success) {
        setSuccess(res.data.message);
        
        // Navigate to reset-password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              email, 
              verified: true 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
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
          to="/forgot-password"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Change Email
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Verify OTP Code</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Enter the 6-digit verification code sent to your email address below
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

        {hintOtp && (
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs rounded-xl mb-6 font-medium">
            🔧 [Dev Mode Hint] Verification OTP is: <strong className="font-mono bg-white px-1.5 py-0.5 border rounded text-indigo-700">{hintOtp}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input (mostly read-only/prefilled, but editable if needed) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800 font-medium"
            />
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">OTP Verification Code</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only allow numbers
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-800 tracking-[0.25em] font-mono text-center font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm shadow-indigo-100 transition-all duration-200"
          >
            {loading ? 'Verifying OTP...' : 'Verify Code'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;

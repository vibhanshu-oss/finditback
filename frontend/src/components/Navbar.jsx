import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Track scroll to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/items', label: 'All Items' },
    { path: '/lost-items', label: 'Lost' },
    { path: '/found-items', label: 'Found' },
    { path: '/about', label: 'About' },
  ];

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 font-semibold'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <nav
      className={`sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100 transition-shadow duration-300 ${
        scrolled ? 'shadow-sm shadow-slate-200/50' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm shadow-indigo-200">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent">
                FindItBack
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={navLinkClass} end={link.path === '/'}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/add-item"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-200/60 hover:shadow-md hover:shadow-indigo-200/70"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Item
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="h-5 w-px bg-slate-200 mx-1" />
                {/* User avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden lg:block max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="inline-flex items-center gap-1.5 p-2 text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-sm shadow-indigo-200/60 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-3 pt-3 pb-5 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="h-px bg-slate-100 my-2 mx-1" />

              {user ? (
                <div className="space-y-1 px-1">
                  {/* Mobile user info */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/add-item"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Report Item
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl font-medium text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl shadow-sm transition-all hover:bg-indigo-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

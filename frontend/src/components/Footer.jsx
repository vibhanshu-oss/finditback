import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-sm shadow-indigo-200/50 group-hover:shadow-indigo-200 transition-shadow">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                FindItBack
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
              A modern full-stack Lost &amp; Found platform connecting people who lost belongings
              with those who found them. Built with the MERN stack.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/your-username/finditback"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-all hover:text-slate-800"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                GitHub Repo
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/items', label: 'All Listings' },
                { to: '/lost-items', label: 'Lost Items' },
                { to: '/found-items', label: 'Found Items' },
                { to: '/add-item', label: 'Report an Item' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Register' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 mt-12 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-400">
            &copy; {year} FindItBack. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            Made with{' '}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" aria-label="love" />{' '}
            by <span className="font-semibold text-slate-500">Vibhanshu</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

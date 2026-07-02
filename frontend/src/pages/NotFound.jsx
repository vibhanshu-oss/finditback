import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        Sorry, the page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;

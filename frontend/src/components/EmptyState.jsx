import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, PlusCircle } from 'lucide-react';

const EmptyState = ({
  title = 'Nothing here yet',
  description = 'No items match your current filters.',
  onReset,
  showAction = true,
  icon: Icon = PackageSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
        <Icon className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">{description}</p>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        )}
        {showAction && (
          <Link
            to="/add-item"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200/60 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Report an Item
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

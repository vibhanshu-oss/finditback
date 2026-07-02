import React from 'react';

const BADGE_STYLES = {
  Lost:     'bg-amber-50 text-amber-700 border-amber-200/80',
  Found:    'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Claimed:  'bg-sky-50 text-sky-700 border-sky-200/80',
  Resolved: 'bg-slate-100 text-slate-500 border-slate-200/80',
};

const DOT_STYLES = {
  Lost:     'bg-amber-500',
  Found:    'bg-emerald-500',
  Claimed:  'bg-sky-500',
  Resolved: 'bg-slate-400',
};

const StatusBadge = ({ status }) => {
  const badge = BADGE_STYLES[status] || 'bg-slate-50 text-slate-500 border-slate-200/80';
  const dot = DOT_STYLES[status] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;

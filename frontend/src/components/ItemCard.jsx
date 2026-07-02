import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

const ItemCard = ({ item }) => {
  const { _id, title, description, type, location, date, imageUrl, status, category } = item;

  const defaultImage =
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3';
  const imageSource = imageUrl || defaultImage;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200/70 transition-all duration-300 overflow-hidden flex flex-col h-full group"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={imageSource}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${
              type === 'Lost'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {type || status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category tag */}
        {category && (
          <div className="flex items-center gap-1 mb-2.5">
            <Tag className="w-3 h-3 text-slate-300" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              {category}
            </span>
          </div>
        )}

        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 border-t border-slate-50 pt-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span className="truncate font-medium text-slate-500">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-300" />
            <span className="font-medium text-slate-500">{formatDate(date)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/items/${_id}`}
          className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-xs text-slate-600 rounded-xl flex items-center justify-center gap-1.5 transition-colors group/btn"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ItemCard;

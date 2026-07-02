import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, CheckCircle, ArrowRight, ShieldCheck,
  HelpCircle, Sparkles, Users, Clock
} from 'lucide-react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const stats = [
  { icon: Users, value: '500+', label: 'Active Users' },
  { icon: Search, value: '1,200+', label: 'Items Listed' },
  { icon: CheckCircle, value: '350+', label: 'Items Reunited' },
  { icon: Clock, value: '< 48h', label: 'Avg. Recovery Time' },
];

const steps = [
  {
    icon: Search,
    color: 'bg-amber-50 text-amber-600',
    step: '01',
    title: 'List an Item',
    desc: 'Submit a detailed description with category, last-known location, and an optional image to maximise visibility.',
  },
  {
    icon: MapPin,
    color: 'bg-indigo-50 text-indigo-600',
    step: '02',
    title: 'Search & Claim',
    desc: 'Use live search and category filters to browse listings. File a claim with proof of ownership in seconds.',
  },
  {
    icon: CheckCircle,
    color: 'bg-emerald-50 text-emerald-600',
    step: '03',
    title: 'Retrieve Safely',
    desc: 'Owners review claims, accept the best match, and coordinate a safe hand-off using in-platform contact details.',
  },
];

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/items');
        if (res.data?.success) setRecentItems(res.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load recent items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-200/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-32 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">

            {/* Badge */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 font-semibold text-xs mb-7 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted Community Lost &amp; Found
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Recover What's Yours,{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Return What You Find.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="text-base sm:text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              FindItBack connects people who lost items with good samaritans who found them.
              Simple to post, easy to search, fast to recover.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex flex-col sm:flex-row justify-center items-center gap-3"
            >
              <Link
                to="/items"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-indigo-300/40 hover:shadow-indigo-300/60 transition-all duration-200 text-sm"
              >
                Browse Listings
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/add-item"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 active:scale-95 text-slate-700 font-semibold rounded-xl shadow-sm transition-all duration-200 text-sm"
              >
                Report an Item
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="flex flex-col items-center text-center gap-2 py-2"
              >
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-1">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Three Steps to Reunion
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Our streamlined process gets lost items back to their owners as fast as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, color, step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.7}
                className="relative p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-slate-100 select-none group-hover:text-slate-200 transition-colors">
                  {step}
                </span>
                <div className={`inline-flex p-3.5 rounded-2xl mb-5 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Items ──────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12"
          >
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Community Board</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recent Postings</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                The latest reports from our FindItBack community.
              </p>
            </div>
            <Link
              to="/items"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
            >
              See All Listings
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {loading ? (
            <Loader />
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item, i) => (
                <motion.div
                  key={item._id}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-8 bg-white rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="font-bold text-slate-700 mb-1">No listings yet</h3>
              <p className="text-xs text-slate-500 mb-5">
                Be the first to create a post on our community noticeboard!
              </p>
              <Link
                to="/add-item"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200/60 hover:bg-indigo-700 transition-all"
              >
                Report an Item
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Lost something? Found something?
            </h2>
            <p className="text-indigo-200 text-base mb-8 font-medium">
              Join hundreds of community members already using FindItBack to reconnect belongings with their owners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all text-sm"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/items"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-500/30 hover:bg-indigo-500/50 border border-white/20 text-white font-semibold rounded-xl active:scale-95 transition-all text-sm"
              >
                Browse Listings
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { ShieldCheck, Heart, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            About FindItBack
          </motion.h1>
          <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
            Discover the drive, technical principles, and community mission behind the FindItBack Lost and Found platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 sm:p-10 space-y-8"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              FindItBack was created to simplify the stressful experience of losing personal items. Traditional noticeboards are local and inefficient. Our platform digitizes this bulletin, allowing smart query indexing, secure identity verification, and straightforward claim coordination to maximize recoverability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
            <div className="flex gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Verify Identity</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Authentication barriers ensure only valid community members list items and check ownership documents.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Collaborative Spacing</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Bridges the communication gap between losers and discoverers inside a structured environment.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Live Categorization</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Real-time index updates, debounced text search, and category selectors index listings.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Good Samaritans</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Promotes citizen honesty by offering a sleek bulletin where found goods are easily returned.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8 w-full';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
          }}
        />
        {fullPage && (
          <motion.p
            className="text-sm font-medium text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading FindItBack...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Loader;

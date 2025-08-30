
import React from 'react';
import { motion } from 'framer-motion';

const GenericPage = ({ title, icon, children }) => {
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        {Icon && <Icon className="h-8 w-8 text-brand-400" />}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};

export default GenericPage;

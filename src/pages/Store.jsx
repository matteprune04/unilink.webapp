
import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';
import { motion } from 'framer-motion';

const Store = () => {
  return (
    <>
      <Helmet>
        <title>Store - UNILINK</title>
        <meta name="description" content="Sfoglia il nostro merchandise esclusivo e le risorse per studenti." />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            UNILINK Store
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Merchandise esclusivo e risorse per portare la tua esperienza universitaria al livello successivo.
          </p>
        </div>
        <ProductsList />
      </motion.div>
    </>
  );
};

export default Store;
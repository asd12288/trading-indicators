'use client'

import React from "react";
import { HiCheck } from "react-icons/hi";
import { motion } from "framer-motion";

const Benefit = ({ benefit }: { benefit: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 text-green-50"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-white">
        <HiCheck className="text-lg" />
      </span>
      <p className="text-sm text-slate-300 md:text-base">{benefit}</p>
    </motion.div>
  );
};

export default Benefit;

"use client";
import React from "react";
import { motion } from "framer-motion";

interface CarouselProps {
  children: React.ReactNode[];
}

const InfiniteCarousel: React.FC<CarouselProps> = ({ children }) => {
  // Duplicate children to allow a seamless scroll loop.
  const duplicatedChildren = [...children, ...children];

  // Calculate animation duration (adjust speed as needed)
  const duration = children.length * 5; // e.g., 5 seconds per slide

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex"
        // Animate from 0 to the negative width percentage of the first set of children
        animate={{ x: `-${25 * children.length}%` }}
        transition={{
          ease: "linear",
          duration: duration,
          repeat: Infinity,
        }}
      >
        {duplicatedChildren.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteCarousel;

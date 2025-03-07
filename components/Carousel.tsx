"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation, useAnimationFrame } from "framer-motion";

interface CarouselProps {
  children: React.ReactNode[];
  speed?: number; // Speed factor (lower is slower)
  pauseOnHover?: boolean;
  autoplay?: boolean;
}

const InfiniteCarousel: React.FC<CarouselProps> = ({
  children,
  speed = 1,
  pauseOnHover = true,
  autoplay = true,
}) => {
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Duplicate children for infinite effect
  const duplicatedChildren = [...children, ...children, ...children];

  // Get refs for measurements
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Calculate widths on mount and window resize
  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current && contentRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContentWidth(contentRef.current.scrollWidth / 3); // Divide by 3 because we tripled the content
      }
    };

    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, [children]);

  // Set up the animation when measurements are ready
  useEffect(() => {
    if (contentWidth > 0 && containerWidth > 0) {
      setShouldAnimate(contentWidth > containerWidth);

      if (contentWidth > containerWidth && autoplay) {
        controls.start({
          x: -contentWidth,
          transition: {
            duration: contentWidth / (50 * speed),
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      }
    }
  }, [contentWidth, containerWidth, controls, speed, autoplay]);

  // Handle hover state
  useEffect(() => {
    if (pauseOnHover && shouldAnimate) {
      if (isHovering) {
        controls.stop();
      } else if (autoplay) {
        controls.start({
          x: -contentWidth,
          transition: {
            duration: contentWidth / (50 * speed),
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      }
    }
  }, [
    isHovering,
    controls,
    contentWidth,
    pauseOnHover,
    speed,
    shouldAnimate,
    autoplay,
  ]);

  if (!shouldAnimate) {
    // If content fits within container, show without animation
    return (
      <div className="flex w-full justify-center overflow-hidden py-6">
        <div className="flex flex-wrap justify-center gap-4">
          {children.map((child, index) => (
            <div key={index} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden py-6"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="flex"
        ref={contentRef}
        animate={controls}
        initial={{ x: 0 }}
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

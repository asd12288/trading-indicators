"use client";

import React from "react";
import { motion } from "framer-motion";

interface GeneralLoaderProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  text?: string;
  fullScreen?: boolean;
}

const GeneralLoader: React.FC<GeneralLoaderProps> = ({
  size = "medium",
  showText = true,
  text = "Loading...",
  fullScreen = false,
}) => {
  // Size mappings
  const sizeClasses = {
    small: "h-24 w-24",
    medium: "h-32 w-32",
    large: "h-40 w-40",
  };
  
  const containerClasses = fullScreen 
    ? "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" 
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Outer glowing ring */}
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 blur-xl"></div>
          
          {/* Outer circle */}
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(15, 23, 42, 0.5)"
              strokeWidth="8"
            />
            
            {/* Progress circle - animated */}
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ 
                pathLength: [0, 0.5, 1],
                rotate: 360 
              }}
              transition={{
                pathLength: { 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                },
                rotate: { 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }
              }}
              style={{ 
                pathLength: 0.8,
                rotate: 0,
                transformOrigin: "center" 
              }}
            />
            
            {/* Trading chart line */}
            <motion.path
              d="M20,70 Q35,30 45,60 T65,45 T85,55"
              fill="none"
              stroke="rgba(16, 185, 129, 0.6)"
              strokeWidth="2"
              strokeDasharray="2 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
            />
            
            {/* Define gradient for progress circle */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center logo */}
          
        </div>
        
        {showText && (
          <div className="mt-6 flex items-center">
            <div className="mr-2 flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-300">{text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralLoader;

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface TooltipProps {
  targetId: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  targetId,
  title,
  content,
  position,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const [tooltipStyle, setTooltipStyle] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const positionTooltip = () => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft =
          window.scrollX || document.documentElement.scrollLeft;

        // Add an outline to highlight the target element
        targetElement.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.5)";
        targetElement.style.zIndex = "1000";
        targetElement.style.position = "relative";

        let top = 0;
        let left = 0;

        switch (position) {
          case "top":
            top = rect.top + scrollTop - 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case "right":
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 10;
            break;
          case "bottom":
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case "left":
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 10;
            break;
        }

        setTooltipStyle({ top, left });

        // Scroll the element into view if needed
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    positionTooltip();

    // Clean up function
    return () => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.style.boxShadow = "";
        targetElement.style.zIndex = "";
      }
    };
  }, [targetId, position]);

  const getPositionClass = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2 transform -translate-x-1/2";
      case "right":
        return "left-full ml-2 transform -translate-y-1/2";
      case "bottom":
        return "top-full mt-2 transform -translate-x-1/2";
      case "left":
        return "right-full mr-2 transform -translate-y-1/2";
    }
  };

  return (
    <div
      className="fixed z-[1001] w-64"
      style={{
        top: `${tooltipStyle.top}px`,
        left: `${tooltipStyle.left}px`,
      }}
    >
      <div className={`relative ${getPositionClass()}`}>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/90 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              aria-label="Close tooltip"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-300">{content}</p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="mr-2 rounded-md bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600"
                >
                  Previous
                </button>
              )}
              {!isLast && (
                <button
                  onClick={onNext}
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
                >
                  Next
                </button>
              )}
              {isLast && (
                <button
                  onClick={onNext}
                  className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                >
                  Finish
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:underline"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

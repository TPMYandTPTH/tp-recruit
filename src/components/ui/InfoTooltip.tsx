"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  size?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export default function InfoTooltip({ text, size = 14, position = "top" }: InfoTooltipProps) {
  const [show, setShow] = useState(false);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#E2DFE8] hover:bg-[#C2C7CD] text-[#4B4C6A] transition-colors cursor-help ml-1"
        aria-label="More info"
      >
        <Info size={size} strokeWidth={2.5} />
      </button>
      {show && (
        <div className={`absolute ${positionClasses[position]} z-50 w-64 px-3 py-2 text-xs leading-relaxed text-white bg-[#4B4C6A] rounded-lg shadow-lg pointer-events-none`}>
          {text}
          <div className={`absolute w-2 h-2 bg-[#4B4C6A] transform rotate-45 ${
            position === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1" :
            position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1" :
            position === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1" :
            "right-full top-1/2 -translate-y-1/2 -mr-1"
          }`} />
        </div>
      )}
    </span>
  );
}

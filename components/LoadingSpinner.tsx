import React from "react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
  inline?: boolean;
};

function LoadingSpinner({
  size = "md",
  message,
  className = "",
  inline = false,
}: LoadingSpinnerProps) {
  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5 sm:h-3 sm:w-3",
  };

  const containerSize = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12 sm:h-14 sm:w-14",
  };

  const Dots = () => (
    <div className={`relative ${containerSize[size]}`}>
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className={`
            absolute top-1/2 left-1/2
            ${dotSize[size]}
            bg-indigo-500 rounded-full
            animate-[winspin_1.2s_linear_infinite]
          `}
          style={{
            transform: `
              rotate(${i * 45}deg)
              translate(${size === "lg" ? "1.2rem" : size === "md" ? "0.9rem" : "0.6rem"})
            `,
            opacity: (i + 1) / 8,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  // 🔹 INLINE SPINNER
  if (inline) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <Dots />
        {message && (
          <span className="text-sm text-slate-600">
            {message}
          </span>
        )}
      </span>
    );
  }

  // 🔹 FULL PAGE SPINNER
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
    >
      <Dots />
      {message && (
        <p className="max-w-xs text-sm text-slate-600 sm:text-base">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;


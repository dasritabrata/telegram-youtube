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
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4 sm:h-12 sm:w-12",
  };

  // 🔹 INLINE SPINNER (for buttons / text)
  if (inline) {
    return (
      <span
        className={`inline-flex items-center gap-2 ${className}`}
      >
        <span
          className={`animate-spin rounded-full border-slate-300 border-t-indigo-600 ${sizeClasses[size]}`}
        />
        {message && (
          <span className="text-sm text-slate-600">
            {message}
          </span>
        )}
      </span>
    );
  }

  // 🔹 FULL PAGE / CENTERED SPINNER
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-slate-300 border-t-indigo-600 ${sizeClasses[size]}`}
      />

      {message && (
        <p className="max-w-xs text-sm text-slate-600 sm:text-base">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;

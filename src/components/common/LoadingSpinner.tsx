import React from 'react';

interface Props {
  className?: string;
}

export function LoadingSpinner({ className = "h-12 w-12" }: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-white/20 border-t-white ${className}`} />
    </div>
  );
}
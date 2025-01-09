import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  verified: boolean;
  className?: string;
}

export function VerificationBadge({ verified, className = '' }: Props) {
  if (!verified) return null;

  return (
    <div 
      className={`inline-flex items-center text-sm text-blue-600 ${className}`}
      title="Verified Profile"
    >
      <CheckCircle className="w-4 h-4 mr-1" />
      <span>Verified</span>
    </div>
  );
}
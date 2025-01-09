import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  features: string[];
}

export function PlanFeatureList({ features }: Props) {
  return (
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
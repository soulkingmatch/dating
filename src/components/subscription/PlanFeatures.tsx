import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  features: string[];
}

export function PlanFeatures({ features }: Props) {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
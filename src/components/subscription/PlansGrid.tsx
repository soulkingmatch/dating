import React from 'react';
import { PlanCard } from './PlanCard';
import type { SubscriptionPlan } from '../../types/subscription';

interface Props {
  plans: SubscriptionPlan[];
  onSubscribe: (planId: string) => void;
}

export function PlansGrid({ plans, onSubscribe }: Props) {
  return (
    <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  );
}
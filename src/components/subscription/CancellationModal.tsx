import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPeriodEnd: string;
  loading: boolean;
}

export function CancellationModal({ isOpen, onClose, onConfirm, currentPeriodEnd, loading }: Props) {
  if (!isOpen) return null;

  const formattedDate = new Date(currentPeriodEnd).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold">Cancel Subscription</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel your subscription? Your benefits will continue until:
          </p>
          
          <p className="font-semibold text-lg text-center py-2">
            {formattedDate}
          </p>

          <p className="text-sm text-gray-500">
            After this date, your account will revert to the free plan. You can reactivate your subscription at any time before the end date.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Canceling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
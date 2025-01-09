import React, { useState } from 'react';
import { Mail, Lock, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  onSuccess: (email: string) => void;
}

export function SignupForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuthStore();
  const { initialize } = useSubscriptionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp(email, password);
      if (error) throw error;
      if (data.user) {
        await initialize(); // Initialize subscription data
        onSuccess(email);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-sm text-purple-800">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" />
          Free Account Includes:
        </h3>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>3 matches per day</li>
          <li>Basic profile customization</li>
          <li>10 messages per day</li>
          <li>View public profiles</li>
        </ul>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Email"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          {loading ? <LoadingSpinner /> : 'Create Account'}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
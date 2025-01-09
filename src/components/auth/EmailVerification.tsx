import React from 'react';
import { Mail } from 'lucide-react';

interface Props {
  email: string;
}

export function EmailVerification({ email }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Check your email
        </h2>
        
        <p className="text-gray-600 mb-6">
          We just sent a verification link to:
          <br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account and continue.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            I've verified my email
          </button>
        </div>
      </div>
    </div>
  );
}
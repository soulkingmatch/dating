import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { EmailVerification } from './EmailVerification';
import { PageBackground } from '../common/PageBackground';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
  };

  if (verificationEmail) {
    return (
      <PageBackground>
        <EmailVerification email={verificationEmail} />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Crown className="text-purple-600 w-8 h-8 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Soul King Match</h1>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm onSuccess={handleSignupSuccess} />
          )}

          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </PageBackground>
  );
}
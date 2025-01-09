import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { ProfileHeader } from './ProfileHeader';
import { CreatePost } from './CreatePost';
import { ProfileFeed } from './ProfileFeed';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function ProfilePage() {
  const { profile, loading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">Please complete your profile to continue using the app.</p>
          <button 
            onClick={() => fetchProfile()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader profile={profile} />
        <CreatePost />
        <ProfileFeed userId={profile.id} />
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../../services/profileService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { UserProfileHeader } from './UserProfileHeader';
import { ProfileFeed } from './ProfileFeed';
import type { Profile } from '../../types/profile';

export function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userProfile = await fetchUserProfile(userId);
        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!profile) return <div className="text-center">Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfileHeader profile={profile} />
        <ProfileFeed userId={profile.id} />
      </div>
    </div>
  );
}
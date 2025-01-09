import React, { useState } from 'react';
import { Camera, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import type { Profile } from '../../types/profile';
import { useProfileStore } from '../../store/profileStore';
import { uploadProfileImage } from '../../services/profileService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { VerificationBadge } from './VerificationBadge';
import { LastActive } from './LastActive';
import { ProfileCompletion } from './ProfileCompletion';
import { ProfilePrompts } from './ProfilePrompts';

interface Props {
  profile: Profile;
}

export function ProfileHeader({ profile }: Props) {
  const { updateProfile } = useProfileStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      type === 'avatar' ? setUploadingAvatar(true) : setUploadingCover(true);
      
      const url = await uploadProfileImage(file, type);
      await updateProfile({ [type === 'avatar' ? 'avatar_url' : 'cover_url']: url });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      type === 'avatar' ? setUploadingAvatar(false) : setUploadingCover(false);
    }
  };

  const handlePromptsUpdate = async (prompts: any[]) => {
    try {
      await updateProfile({ profile_prompts: prompts });
    } catch (err) {
      console.error('Error updating prompts:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 bg-purple-100">
          {uploadingCover ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {profile.cover_url ? (
                <img 
                  src={profile.cover_url} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500" />
              )}
              <label className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                />
                <Camera className="w-5 h-5 text-white" />
              </label>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 py-4">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="relative w-32 h-32">
              {uploadingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-100 rounded-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="w-full h-full rounded-full border-4 border-white bg-purple-100 overflow-hidden group">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-purple-600 font-bold">
                        {profile.full_name?.[0]}
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 cursor-pointer transition-all">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'avatar')}
                    />
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md mt-20">
              {error}
            </div>
          )}

          {/* Profile Details */}
          <div className="ml-40">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
              <VerificationBadge verified={profile.verified || false} />
              <LastActive lastActive={profile.last_active || null} />
            </div>

            <p className="text-gray-600 mt-1">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {profile.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  <span>{profile.education}</span>
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span>{profile.occupation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCompletion profile={profile} />
        <ProfilePrompts profile={profile} onUpdate={handlePromptsUpdate} />
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { AIPreferencesForm } from './forms/AIPreferencesForm';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Profile } from '../../types/profile';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: Props) {
  const { profile, updateProfile } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'ai'>('basic');

  const handleSubmit = async (data: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);
      await updateProfile(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="p-4">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 ${
                activeTab === 'basic'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 ${
                activeTab === 'ai'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              AI Preferences
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'basic' ? (
            <BasicInfoForm 
              profile={profile} 
              onSubmit={handleSubmit}
              disabled={loading}
            />
          ) : (
            <AIPreferencesForm 
              profile={profile}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          )}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
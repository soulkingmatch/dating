import React, { useState } from 'react';
import { User, Calendar, MapPin, Heart } from 'lucide-react';
import type { Profile } from '../../../types/profile';

interface Props {
  profile: Profile;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  disabled?: boolean;
}

export function BasicInfoForm({ profile, onSubmit, disabled }: Props) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    birth_date: profile.birth_date || '',
    gender: profile.gender || '',
    looking_for: profile.looking_for || [],
    location: profile.location || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Full Name
          </div>
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Birth Date
          </div>
        </label>
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-400" />
            Looking For
          </div>
        </label>
        <select
          multiple
          value={formData.looking_for}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            looking_for: Array.from(e.target.selectedOptions, option => option.value)
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            Location
          </div>
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
          placeholder="City, Country"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
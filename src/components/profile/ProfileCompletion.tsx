import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import type { Profile } from '../../types/profile';
import { useProfileStore } from '../../store/profileStore';

interface Props {
  profile: Profile;
}

export function ProfileCompletion({ profile }: Props) {
  const { updateProfile } = useProfileStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sections = [
    { 
      name: 'Basic Info',
      field: 'full_name',
      complete: !!profile.full_name,
      type: 'text',
      placeholder: 'Enter your full name',
      value: profile.full_name || ''
    },
    { 
      name: 'Birth Date',
      field: 'birth_date',
      complete: !!profile.birth_date,
      type: 'date',
      value: profile.birth_date || ''
    },
    { 
      name: 'About Me',
      field: 'bio',
      complete: !!profile.bio,
      type: 'textarea',
      placeholder: 'Tell us about yourself...',
      value: profile.bio || ''
    },
    { 
      name: 'Location',
      field: 'location',
      complete: !!profile.location,
      type: 'text',
      placeholder: 'Enter your city, country',
      value: profile.location || ''
    },
    { 
      name: 'Education',
      field: 'education',
      complete: !!profile.education,
      type: 'text',
      placeholder: 'Enter your education',
      value: profile.education || ''
    },
    { 
      name: 'Occupation',
      field: 'occupation',
      complete: !!profile.occupation,
      type: 'text',
      placeholder: 'Enter your occupation',
      value: profile.occupation || ''
    }
  ];

  const completedSections = sections.filter(s => s.complete).length;
  const completionPercentage = Math.round((completedSections / sections.length) * 100);

  const handleEdit = (section: typeof sections[0]) => {
    setEditingField(section.field);
    setFieldValue(section.value);
    setError(null);
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    try {
      setError(null);
      await updateProfile({ [editingField]: fieldValue });
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profile Completion</h3>
        <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.field} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {section.complete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                )}
                <span className="font-medium">{section.name}</span>
              </div>
              <button
                onClick={() => handleEdit(section)}
                className="text-purple-600 hover:text-purple-700 flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                {section.complete ? 'Edit' : 'Complete'}
              </button>
            </div>

            {editingField === section.field ? (
              <div className="space-y-2">
                {section.type === 'textarea' ? (
                  <textarea
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={section.placeholder}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                ) : (
                  <input
                    type={section.type}
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={section.placeholder}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingField(null);
                      setError(null);
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                {section.value || 'Not completed'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
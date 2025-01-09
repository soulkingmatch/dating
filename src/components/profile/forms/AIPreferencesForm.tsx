import React, { useState } from 'react';
import { Brain, Cpu, Lightbulb, MessageSquare } from 'lucide-react';
import type { Profile } from '../../../types/profile';
import { AI_TOOLS, AI_INTERESTS } from '../../../constants/aiPreferences';

interface Props {
  profile: Profile;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  disabled?: boolean;
}

export function AIPreferencesForm({ profile, onSubmit, disabled }: Props) {
  const [formData, setFormData] = useState({
    favorite_llms: profile.favorite_llms || [],
    ai_tools: profile.ai_tools || [],
    ai_interests: profile.ai_interests || [],
    ai_use_case: profile.ai_use_case || ''
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
            <Brain className="w-4 h-4 text-purple-500" />
            Favorite Language Models
          </div>
        </label>
        <input
          type="text"
          value={formData.favorite_llms.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            favorite_llms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="GPT-4, Claude, LLaMA (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            AI Tools You Use
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AI_TOOLS.map((tool) => (
            <label key={tool} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.ai_tools.includes(tool)}
                onChange={(e) => {
                  const newTools = e.target.checked
                    ? [...formData.ai_tools, tool]
                    : formData.ai_tools.filter(t => t !== tool);
                  setFormData(prev => ({ ...prev, ai_tools: newTools }));
                }}
                disabled={disabled}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-500" />
            AI Interests
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AI_INTERESTS.map((interest) => (
            <label key={interest} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.ai_interests.includes(interest)}
                onChange={(e) => {
                  const newInterests = e.target.checked
                    ? [...formData.ai_interests, interest]
                    : formData.ai_interests.filter(i => i !== interest);
                  setFormData(prev => ({ ...prev, ai_interests: newInterests }));
                }}
                disabled={disabled}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            Favorite AI Use Case
          </div>
        </label>
        <textarea
          value={formData.ai_use_case}
          onChange={(e) => setFormData(prev => ({ ...prev, ai_use_case: e.target.value }))}
          placeholder="Tell us about your favorite way to use AI..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
          disabled={disabled}
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
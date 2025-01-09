import React from 'react';
import { Brain, Cpu, Lightbulb, MessageSquare } from 'lucide-react';
import { AI_TOOLS, AI_INTERESTS } from '../../types/profile';

interface Props {
  values: {
    favorite_llms: string[];
    ai_tools: string[];
    ai_interests: string[];
    ai_use_case: string;
  };
  onChange: (values: any) => void;
}

export function AIPreferencesForm({ values, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Favorite Language Models
          </div>
        </label>
        <input
          type="text"
          placeholder="GPT-4, Claude, LLaMA (comma-separated)"
          value={values.favorite_llms.join(', ')}
          onChange={(e) => onChange({
            ...values,
            favorite_llms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-500" />
            AI Tools You Use
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AI_TOOLS.map((tool) => (
            <label key={tool} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.ai_tools.includes(tool)}
                onChange={(e) => {
                  const newTools = e.target.checked
                    ? [...values.ai_tools, tool]
                    : values.ai_tools.filter(t => t !== tool);
                  onChange({ ...values, ai_tools: newTools });
                }}
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
            <Lightbulb className="w-5 h-5 text-purple-500" />
            AI Interests
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AI_INTERESTS.map((interest) => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.ai_interests.includes(interest)}
                onChange={(e) => {
                  const newInterests = e.target.checked
                    ? [...values.ai_interests, interest]
                    : values.ai_interests.filter(i => i !== interest);
                  onChange({ ...values, ai_interests: newInterests });
                }}
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
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Favorite AI Use Case
          </div>
        </label>
        <textarea
          value={values.ai_use_case}
          onChange={(e) => onChange({ ...values, ai_use_case: e.target.value })}
          placeholder="Tell us about your favorite way to use AI..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
        />
      </div>
    </div>
  );
}
import React from 'react';
import { Brain, Cpu, Lightbulb } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface Props {
  profile: Profile;
  aiMatchScore: number;
}

export function AIMatchCard({ profile, aiMatchScore }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div 
        className="h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${profile.avatar_url || 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80'})` }}
      >
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {profile.full_name}, {new Date().getFullYear() - new Date(profile.birth_date).getFullYear()}
            </h2>
            <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
              {aiMatchScore}% AI Match
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <div className="flex flex-wrap gap-2">
            {profile.favorite_llms.map((llm, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {llm}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-500" />
          <div className="flex flex-wrap gap-2">
            {profile.ai_tools.map((tool, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          <div className="flex flex-wrap gap-2">
            {profile.ai_interests.map((interest, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Favorite AI Use Case</h3>
          <p className="text-gray-600">{profile.ai_use_case}</p>
        </div>
      </div>
    </div>
  );
}
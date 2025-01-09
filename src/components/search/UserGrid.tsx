import React from 'react';
import { Brain, Cpu } from 'lucide-react';
import type { Profile } from '../../types/profile';
import { Link } from 'react-router-dom';

interface Props {
  users: Profile[];
}

export function UserGrid({ users }: Props) {
  if (!users.length) {
    return (
      <div className="mt-8 text-center bg-white rounded-lg shadow-xl p-8">
        <p className="text-gray-600">No users found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map(user => (
        <Link
          key={user.id}
          to={`/profile/${user.id}`}
          className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <div className="h-32 bg-purple-100 relative">
            {user.cover_url && (
              <img 
                src={user.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute -bottom-10 left-4">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-purple-100">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url}
                    alt={user.full_name || ''}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl text-purple-600 font-bold">
                      {user.full_name?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-12 p-4">
            <h3 className="font-semibold text-lg text-gray-900">{user.full_name}</h3>
            <p className="text-sm text-gray-600 mt-1">{user.bio}</p>

            {/* AI Interests */}
            {user.ai_interests?.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Brain className="w-4 h-4" />
                  <span>Interests</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.ai_interests.slice(0, 3).map(interest => (
                    <span 
                      key={interest}
                      className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.ai_interests.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{user.ai_interests.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* AI Tools */}
            {user.ai_tools?.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>Tools</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.ai_tools.slice(0, 3).map(tool => (
                    <span 
                      key={tool}
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                  {user.ai_tools.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{user.ai_tools.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
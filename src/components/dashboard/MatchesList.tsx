import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { Match } from '../../types/match';
import { useProfileStore } from '../../store/profileStore';

interface Props {
  matches: Match[];
  onAccept: (matchId: string) => void;
  onReject: (matchId: string) => void;
}

export function MatchesList({ matches, onAccept, onReject }: Props) {
  const { profile } = useProfileStore();

  if (!matches.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No matches yet. Keep exploring!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map(match => (
        <div key={match.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">{match.user2_id === profile?.id ? 'New match request!' : 'Pending match'}</h3>
              <p className="text-sm text-gray-600">
                {match.status === 'pending' ? 'Waiting for response' : `Match ${match.status}`}
              </p>
            </div>
          </div>
          {match.status === 'pending' && match.user2_id === profile?.id && (
            <div className="flex space-x-2">
              <button
                onClick={() => onReject(match.id)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Decline
              </button>
              <button
                onClick={() => onAccept(match.id)}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Accept
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useProfileStore } from '../../store/profileStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Props {
  matchId: string;
  partnerName: string;
  partnerAvatar: string | null;
}

export function ChatRoom({ matchId, partnerName, partnerAvatar }: Props) {
  const [newMessage, setNewMessage] = useState('');
  const { profile } = useProfileStore();
  const { currentSubscription } = useSubscriptionStore();
  const { messages, loading, error, send } = useChat(matchId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await send(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const canSendMessages = currentSubscription?.subscription_plans.messaging_limit === null || 
    (currentSubscription?.subscription_plans.messaging_limit || 0) > 0;

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="p-4 border-b flex items-center space-x-3">
        {partnerAvatar ? (
          <img 
            src={partnerAvatar} 
            alt={partnerName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold">
              {partnerName[0]}
            </span>
          </div>
        )}
        <h3 className="font-semibold">{partnerName}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender_id === profile?.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        {canSendMessages ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              Upgrade to Premium to send unlimited messages!
            </p>
            <a
              href="/subscription"
              className="mt-2 inline-block text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Upgrade Now
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
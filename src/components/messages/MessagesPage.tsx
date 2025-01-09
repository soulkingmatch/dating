import React from 'react';
import { MessageCircle } from 'lucide-react';

export function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <MessageCircle className="text-white w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold text-white">Messages</h1>
        </div>
        
        {/* Message list will be implemented here */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-center text-gray-600">Your messages will appear here</p>
        </div>
      </div>
    </div>
  );
}
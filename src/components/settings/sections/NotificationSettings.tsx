import React from 'react';
import { Switch } from '../../common/Switch';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">New Matches</h3>
          <p className="text-sm text-gray-500">Get notified when you have new matches</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Match Notifications"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Messages</h3>
          <p className="text-sm text-gray-500">Receive notifications for new messages</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Message Notifications"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Profile Likes</h3>
          <p className="text-sm text-gray-500">Get notified when someone likes your profile</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Like Notifications"
        />
      </div>
    </div>
  );
}
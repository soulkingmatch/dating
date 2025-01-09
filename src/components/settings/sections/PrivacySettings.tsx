import React from 'react';
import { Switch } from '../../common/Switch';

export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Read Receipts</h3>
          <p className="text-sm text-gray-500">Let others know when you've read their messages</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Read Receipts"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Location Sharing</h3>
          <p className="text-sm text-gray-500">Share your location with matches</p>
        </div>
        <Switch
          checked={false}
          onChange={() => {}}
          label="Location Sharing"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Profile Indexing</h3>
          <p className="text-sm text-gray-500">Allow your profile to appear in search results</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Search Visibility"
        />
      </div>
    </div>
  );
}
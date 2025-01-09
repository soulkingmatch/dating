import React from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Switch } from '../../common/Switch';

export function ProfileSettings() {
  const { profile } = useProfileStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
          <p className="text-sm text-gray-500">Control who can see your profile</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Public Profile"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Show Online Status</h3>
          <p className="text-sm text-gray-500">Let others see when you're online</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Online Status"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Activity Status</h3>
          <p className="text-sm text-gray-500">Show your last active status</p>
        </div>
        <Switch
          checked={true}
          onChange={() => {}}
          label="Activity Status"
        />
      </div>
    </div>
  );
}
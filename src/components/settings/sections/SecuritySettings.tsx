import React from 'react';
import { useAuthStore } from '../../../store/authStore';

export function SecuritySettings() {
  const { signOut } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
        <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Update Password
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
        <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Enable 2FA
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
        <p className="text-sm text-gray-500 mt-1">
          Permanently delete your account and all data
        </p>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Account
        </button>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
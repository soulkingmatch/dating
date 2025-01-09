import React from 'react';
import { Settings, Bell, Lock, User, CreditCard, Shield } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { ProfileSettings } from './sections/ProfileSettings';
import { NotificationSettings } from './sections/NotificationSettings';
import { PrivacySettings } from './sections/PrivacySettings';
import { SubscriptionSettings } from './sections/SubscriptionSettings';
import { SecuritySettings } from './sections/SecuritySettings';

export function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Settings className="text-white w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <SettingsSection icon={User} title="Profile">
          <ProfileSettings />
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notifications">
          <NotificationSettings />
        </SettingsSection>

        <SettingsSection icon={Lock} title="Privacy">
          <PrivacySettings />
        </SettingsSection>

        <SettingsSection icon={CreditCard} title="Subscription">
          <SubscriptionSettings />
        </SettingsSection>

        <SettingsSection icon={Shield} title="Security">
          <SecuritySettings />
        </SettingsSection>
      </div>
    </div>
  );
}